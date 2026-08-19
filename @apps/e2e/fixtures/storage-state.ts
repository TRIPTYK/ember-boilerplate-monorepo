import path from "node:path";

/**
 * Where the `setup` project writes the signed-in browser state that every
 * authenticated project reuses. Git-ignored — it holds a real access token.
 */
export const STORAGE_STATE = path.join(import.meta.dirname, "..", ".auth", "user.json");
