// Vercel serverless entrypoint. All /api/* requests are rewritten here
// (see vercel.json) and delegated to the shared Express app. Wrapping the app
// in an explicit (req, res) handler keeps Vercel's handler detection happy.
import type { IncomingMessage, ServerResponse } from "http";
import app from "../server/app";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}
