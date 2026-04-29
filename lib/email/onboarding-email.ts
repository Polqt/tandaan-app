type OnboardingEmailInput = {
  email: string;
  firstName?: string | null;
  invitedRoomCount?: number;
};

export async function sendOnboardingEmail({
  email,
  firstName,
  invitedRoomCount = 0,
}: OnboardingEmailInput) {
  if (!email) {
    return { queued: false, reason: "missing_email" as const };
  }

  const token = process.env.RESEND_API_KEY;
  const from = process.env.ONBOARDING_FROM_EMAIL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!token || !from) {
    return { queued: false, reason: "missing_provider" as const };
  }

  const greeting = firstName?.trim() || "there";
  const invitationLine =
    invitedRoomCount > 0
      ? `<p style="margin:16px 0 0;color:#5f5e5e;font-size:15px;line-height:1.7;">You already have ${invitedRoomCount} shared document${invitedRoomCount === 1 ? "" : "s"} waiting inside your workspace.</p>`
      : "";

  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from,
      html: `
        <div style="font-family:Inter,system-ui,sans-serif;background:#f7f4ed;padding:32px;color:#2f3430;">
          <div style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid #ebe6db;border-radius:28px;padding:32px;">
            <p style="margin:0 0 12px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#8a8a87;">Welcome to Tandaan</p>
            <h1 style="margin:0;font-size:32px;line-height:1.05;">Hey ${greeting}, your sketchbook is ready.</h1>
            <p style="margin:18px 0 0;color:#5f5e5e;font-size:15px;line-height:1.7;">Tandaan is built for shared notes, replayable decisions, and collaborative writing that still feels tactile.</p>
            ${invitationLine}
            <div style="margin-top:24px;">
              <a href="${appUrl}/documents" style="display:inline-block;background:#2f3430;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600;">Open your workspace</a>
            </div>
            <p style="margin:22px 0 0;color:#8a8a87;font-size:13px;line-height:1.7;">Start with a blank page, a meeting note, or a product brief. Replay and comments are already wired in.</p>
          </div>
        </div>
      `,
      subject: "Your Tandaan workspace is ready",
      to: email,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to queue onboarding email");
  }

  return { queued: true };
}
