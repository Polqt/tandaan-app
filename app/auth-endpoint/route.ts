import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    auth.protect();

    const { sessionClaims } = await auth();
    const { room } = await req.json();

}