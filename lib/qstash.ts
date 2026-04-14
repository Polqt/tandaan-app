import { Client } from "@upstash/qstash";

let client: Client | null | undefined;

export function getQStashClient() {
  if (client !== undefined) return client;

  const token = process.env.QSTASH_TOKEN;
  if (!token) {
    client = null;
    return client;
  }

  client = new Client({ token });
  return client;
}
