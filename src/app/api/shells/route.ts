import { getShells } from "@/server/queries/queries";

export async function GET() {
  return Response.json({ data: await getShells() });
}
