"use client";

import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3000"; // Update this if the server runs on a different URL or port

export const socket = io(SERVER_URL, {
  path: "/socket.io",
});