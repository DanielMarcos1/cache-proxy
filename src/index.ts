import { Command } from "commander";
import { createServer, IncomingMessage, OutgoingHttpHeaders } from "http";
import { createProxyServer } from "http-proxy";
import { createHash } from "crypto";

const program = new Command();

program
  .option("-p, --port <number>", "Port to run the proxy server on", "3000")
  .option("-o, --origin <url>", "URL of the origin server", "http://dummyjson.com");

program.parse(process.argv);

const options = program.opts();

const proxy = createProxyServer({
  target: options.origin,
  changeOrigin: true,
  ws: true,
  secure: false,
});

const cache = new Map<string, { response: IncomingMessage, headers: OutgoingHttpHeaders }>();

const server = createServer((req, res) => {
  const cacheKey = createHash("sha256")
    .update((req.method || "UNKNOWN") + (req.url || ""))
    .digest("hex");

  if (cache.has(cacheKey)) {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      res.writeHead(cachedResponse.response.statusCode || 200, cachedResponse.headers);
      cachedResponse.response.pipe(res);
      res.writeHead(200, { "X-Cache": "HIT" });
    }
  } else {
    res.writeHead(200, { "X-Cache": "MISS" });
    proxy.web(req, res, {
      secure: false,
      changeOrigin: true,
      ws: true,
    }, (err) => {
      console.error("Error forwarding request:", err);
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("Bad Gateway");
    });

    proxy.on("proxyRes", (proxyRes, req, res) => {
      cache.set(cacheKey, { response: proxyRes, headers: proxyRes.headers });
    });

    proxy.on("error", (err, req, res) => {
      console.error("Proxy error:", err);       
      if ('writeHead' in res && typeof res.writeHead === 'function') {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        console.error("Response object is not valid");
      }
    });
  }
});

const clearCache = () => {
  cache.clear();
  console.log("Cache cleared");
};

program
  .command("clear-cache")
  .description("Clear the cache")
  .action(() => clearCache());

program.on("command:*", () => {
  console.error("Invalid command: %s", program.args.join(" "));
  program.outputHelp();
  process.exit(1);
});

server.listen(options.port, () => {
  console.log(`Caching proxy server running on port ${options.port}`);
});

program.parse(process.argv);
