import { handle, lookupUsers, noRoute } from "../../../../../lib/ops";

// POST /api/ops/v1/users/lookup {"email": "<whole address>"} — a POST, not ?email=,
// so the address stays out of access logs.
export function POST(req: Request) {
  return handle(req, () => lookupUsers(req));
}

export { noRoute as GET, noRoute as PUT, noRoute as PATCH, noRoute as DELETE, noRoute as OPTIONS };
