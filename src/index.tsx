import { serve } from "bun";
import index from "./index.html";
import { handleMessage, upgradeConnection } from "./lib/server/ws";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import env from "./lib/server/env";


const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/assets/*": async (req) => {

      const path = new URL(req.url).pathname

      const file = Bun.file("." + path)

      return new Response(file , {
        headers: {
          "Content-Type": file.type
        }
      })
    },

    '/scribe-token': async (req) => {

      const elevenlabs = new ElevenLabsClient({
        apiKey: env.ELEVENLABS_API_KEY,
      });

      const token = await elevenlabs.tokens.singleUse.create("realtime_scribe");

      return new Response(JSON.stringify(token), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },
  fetch(req, server) {

    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      if (!upgradeConnection(req, server)) return new Response("Upgrade failed", { status: 400 });
    }

    return new Response("WebSocket endpoint is at /ws", { status: 200 });
  },
  websocket: {
    open: (ws) => {
      console.log("Client connected");
    },
    message: handleMessage,
    close: (ws) => {
      console.log("Client disconnected");
    }
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    // hmr: true,

    // Echo console logs from the browser to the server
    // console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
