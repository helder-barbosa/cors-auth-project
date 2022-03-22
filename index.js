const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const port = process.env.API_PORT || 3000;

server.listen(port, () => {
  console.log(`[SERVER] Running on port ${port}`);
});
