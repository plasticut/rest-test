const config = require('config');
const http = require('http');
const app = require('./app');

const port = config.get('port');
const host = config.get('host');

const server = http.createServer(app);
server.listen(port, host, error => {
  if (error) {
    console.error(error);
    return process.exit(1);
  }

  console.log(`Server listen on http://${host}:${port}`);
});
