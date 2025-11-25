const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5173;
const publicDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const safePath = req.url.split("?")[0].replace(/\/+$/, "");
  const requested = safePath === "" || safePath === "/" ? "/index.html" : safePath;
  const filePath = path.join(publicDir, requested);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA fallback: always serve index.html for unmatched routes.
      const fallback = path.join(publicDir, "index.html");
      fs.readFile(fallback, (readErr, data) => {
        if (readErr) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("404 Not Found");
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(data);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("500 Internal Server Error");
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`GuruChat frontend running at http://localhost:${PORT}`);
});
