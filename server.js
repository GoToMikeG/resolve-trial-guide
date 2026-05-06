const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const PORT = 3030;
const DIR  = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.jsx':  'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(DIR, filePath);

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ifaces = os.networkInterfaces();
  let localIP = 'localhost';
  Object.values(ifaces).flat().forEach(i => {
    if (i.family === 'IPv4' && !i.internal) localIP = i.address;
  });

  console.log('');
  console.log('  GoTo Resolve Trial Guide — running');
  console.log('');
  console.log('  Local:    http://localhost:' + PORT);
  console.log('  Network:  http://' + localIP + ':' + PORT);
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
