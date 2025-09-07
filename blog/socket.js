"use client";

import { io } from "socket.io-client";

const SERVER_URL = process.env.SERVER_URL; 

export const socket = io(SERVER_URL, {
  path: "/socket.io",
});

// Attach to window for debugging
if (typeof window !== "undefined") {
  window.socket = socket;
}