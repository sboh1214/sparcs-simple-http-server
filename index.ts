import http, { IncomingMessage, ServerResponse } from "http";
import fs from "fs";

const port = 3000; // 변경 가능

function response(res: ServerResponse, statusCode: number, message: string) {
  res.writeHead(statusCode, { "Content-Type": "text/plain" });
  res.end(message);
  return;
}

http
  .createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.httpVersion !== "1.1") {
      return response(res, 505, "Invalid HTTP Version: Please use 1.1");
    }

    if (req.url === "/") {
      if (req.method !== "GET") {
        return response(
          res,
          405,
          "Invalid HTTP Method: Please use GET when request page."
        );
      }
      if (!req.headers.cookie?.includes("login=true")) {
        res.writeHead(302, { Location: "/login" });
        return res.end();
      }
      fs.readFile("./public/index.html", (err, data) => {
        if (!err) {
          res.writeHead(200, { "Content-Type": "text/html" });
          return res.end(data);
        } else {
          return response(res, 500, "Internal Server Error");
        }
      });
    } else if (req.url === "/login") {
      if (req.method === "GET") {
        fs.readFile("./public/login.html", (err, data) => {
          if (!err) {
            res.writeHead(200, { "Content-Type": "text/html" });
            return res.end(data);
          } else {
            return response(res, 500, "Internal Server Error");
          }
        });
      } else if (req.method === "POST") {
        res.writeHead(303, { Location: "/", "Set-Cookie": "login=true" });
        return res.end();
      } else {
        return response(
          res,
          405,
          "Invalid HTTP Method: Please use GET or POST."
        );
      }
    } else if (req.url === "/logout") {
      if (req.method === "POST") {
        res.writeHead(303, { Location: "/", "Set-Cookie": "login=false" });
        return res.end();
      }
    } else {
      if (req.method !== "GET") {
        return response(
          res,
          405,
          "Invalid HTTP Method: Please use GET when request page."
        );
      }
      fs.readFile("./public/not-found.html", (err, data) => {
        if (!err) {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(data);
        } else {
          return response(res, 500, "Server Error: There is no not-found.html");
        }
      });
    }
  })
  .listen(port, () => {
    console.log("Server listening on " + port);
  });
