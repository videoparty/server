# Prime Video Party server
![Build](https://github.com/videoparty/server/workflows/Build/badge.svg)

<p style="text-align: center" align="center">
  <img src="https://primevideoparty.com/logo-full.png" alt="PvP logo"/>
</p>

Watch video's from primevideo.com together in sync! This server facilitates synchronization features using a websocket.
The [chrome extension](https://github.com/videoparty/prime-chrome) handles all client-side actions (start video, pause, resume, seek time) coming from or going to the server.

## Setup & run
Make sure your machine runs [Node.js](https://nodejs.org/) version 10 or above.

```shell script
> npm install
> npm run start
```

If you'd like to run this server as a continuous background service in a production environment,
use `npm run forever` and set up a reverse proxy with https that points to the PvP server.

## Contributions
Spotted a bug or got a new feature in mind? Pull requests are very much appreciated!

## Disclaimer
**Prime Video** is a trademark of **Amazon Technologies, Inc.**, a subsidiary of **Amazon.com, Inc.**
The author of this Work is not affiliated with those companies.

## License
[apache-2.0](LICENSE)