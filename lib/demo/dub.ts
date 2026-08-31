import { Dub } from "dub";

export function createDubClient() {
  const token = process.env.DUB_API_KEY;
  if (!token) {
    throw new Error("Missing DUB_API_KEY");
  }

  return new Dub({ token });
}
