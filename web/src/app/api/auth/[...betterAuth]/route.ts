import { auth } from "@/lib/auth";

export const GET = async (req: Request) => {
  console.log("GET /api/auth/* called:", req.url);
  return auth.handler(req);
};

export const POST = async (req: Request) => {
  console.log("POST /api/auth/* called:", req.url);
  return auth.handler(req);
};
