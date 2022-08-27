# MyClassics API

MyClassics is an online eBook reader for all free ebooks avaliable through Project Gutenberg. This repo is the backend only, and the frontend (https://github.com/tonyliaccount/my-classics) is within a separate repo.

## Demo

A demo deployment can be found here: https://myclassics.herokuapp.com/

## Tech Stack and API
- Express
- Gutendex for catalog metadata, Project Gutenberg as main resource.

## Installation
Clone the repo, and run "npm run start" or simply "node index.js" to start the express server. Make sure the frontend endpoints are adjusted to point to your server (the endpoint in the frontend repo points to a demo backend).

## Lessons Learned
- CORS is a hard concept.

## Next Steps
- Login functionality
- "My List" for registered user
- CDN integration (epub files are currently stored as static assets).

