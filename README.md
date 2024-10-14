
# Cache Proxy

A simple caching proxy server built with Node.js and TypeScript.

## Features

- Proxies requests to a specified origin server
- Caches responses for improved performance
- Supports cache clearing
- Configurable port and origin server

## Installation

1. Clone the repository
2. Install dependencies:


npm install


## Usage

### Starting the proxy server


npm run dev -- -p <port> -o <origin_url>


Options:
- `-p, --port <number>`: Port to run the proxy server on (default: 3000)
- `-o, --origin <url>`: URL of the origin server (default: http://dummyjson.com)

Example:

npm run dev -- -p 8080 -o https://api.example.com


### Clearing the cache


npm run dev -- clear-cache


## Scripts

- `npm run test`: Run TypeScript compiler without emitting files
- `npm run build`: Build the project
- `npm run watch`: Watch for changes and rebuild
- `npm run lint`: Run ESLint
- `npm run clean`: Remove the dist directory
- `npm run prepare`: Build the project (runs automatically before `npm publish`)
- `npm run dev`: Start the development server

## Dependencies

- http-proxy: ^1.18.1
- commander: (inferred from usage, version not specified in package.json)

## Dev Dependencies

- @types/http-proxy: ^1.17.15
- ts-node: ^10.9.2
- typescript: ^5.6.3

## License

ISC
