import { } from "@react-router/node"
import { } from "@react-router/dev/config";
import { createServer } from "http";
//import { } from "@react-router/serve"
/*import express from "express";
import { createRequestHandler } from "@remix-run/express";
import { myMiddleware } from "./my-middleware"; // Import your custom middleware

// Create an Express app instance
const app = express();

// Apply your custom middleware to vet requests
app.use(myMiddleware);

// Only use the server build in production; in dev, Vite handles it
if (process.env.NODE_ENV !== "development") {
  const build = require("@remix-run/dev/server-build");
  app.all("*", createRequestHandler({ build, mode: "production" }));
} else {
  // In dev mode, Vite will handle the Remix request handler
  app.all("*", (req, res, next) => {
    next(); // Pass control to Vite's Remix middleware
  });
}

// Export the Express app as middleware for Vite
export default function configureServer() {
  return app;
}*/

const server = createServer()

