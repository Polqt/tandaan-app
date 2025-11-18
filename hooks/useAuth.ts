import { adminDB } from "@/firebase-admin";

export async function POST(req: Request) {
  const payload = await req.json();
  const user = payload.user;

  await adminDB.collection("users").doc(user.id).set({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: new Date(),
  });

  return new Response(JSON.stringify({ success: true }));
}
