import * as net from "net";
import fs from "fs";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const path = data.toString().split(" ")[1];
    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (path === "/user-agent") {
      const str = data
        .toString()
        .split(/user-agent: /i)[1]
        .split("\r\n")[0];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`
      );
    } else if (path.startsWith("/echo/")) {
      const str = path.replace("/echo/", "");
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`
      );
    } else if (path.startsWith("/files/")) {
      const dir = process.argv[2] === "--directory" ? process.argv[3] : "";
      const filename = path.replace("/files/", "");
      const filepath = `${dir}/${filename}`;
      try {
        const content = fs.readFileSync(filepath);
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`
        );
      } catch {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

server.listen(4221, "localhost", () => {
  console.log("Server is running on port 4221");
});
