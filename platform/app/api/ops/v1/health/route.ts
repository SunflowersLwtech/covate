import { handle, health, noRoute } from "../../../../lib/ops";

// GET /api/ops/v1/health — what this surface does and the release it runs. No
// database: the console calling it never wakes Neon.
export function GET(req: Request) {
  return handle(req, health);
}

// Every other method answers 404, not Next's 405 (see lib/ops.ts).
export { noRoute as POST, noRoute as PUT, noRoute as PATCH, noRoute as DELETE, noRoute as OPTIONS };
