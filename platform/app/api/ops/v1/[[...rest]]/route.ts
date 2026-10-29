import { noRoute } from "../../../../lib/ops";

// Everything else under /api/ops/v1, including the bare base URL and every write the
// console knows about (POST /users/{id}/plan|block|quota|credits, POST /pools/{pool}/reset,
// GET /pools): 404 in the ops envelope, after the token check.
export {
  noRoute as GET,
  noRoute as POST,
  noRoute as PUT,
  noRoute as PATCH,
  noRoute as DELETE,
  noRoute as OPTIONS,
};
