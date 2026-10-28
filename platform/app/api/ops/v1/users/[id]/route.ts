import { handle, noRoute, readUser } from "../../../../../lib/ops";

// GET /api/ops/v1/users/{id} — one account by its uuid.
export function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(req, async () => readUser(req, (await params).id));
}

// No writes: POST /users/{id} answers 404 here, and /users/{id}/plan|block|quota|credits
// fall through to ../../[[...rest]].
export { noRoute as POST, noRoute as PUT, noRoute as PATCH, noRoute as DELETE, noRoute as OPTIONS };
