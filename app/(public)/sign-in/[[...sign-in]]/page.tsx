import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-[#fbfbfa] px-5 py-10">
      <SignIn
        appearance={{
          elements: {
            cardBox:
              "shadow-[0_18px_60px_rgba(15,23,42,0.10)] rounded-[24px] border border-slate-200",
            footerActionLink: "text-[#1688e8] font-bold",
            formButtonPrimary:
              "bg-[#101116] hover:bg-[#24252c] rounded-full font-extrabold",
            headerSubtitle: "text-[#77777c]",
            headerTitle: "text-[#1e1e22] font-black tracking-[-0.03em]",
            socialButtonsBlockButton:
              "rounded-full border-slate-200 font-bold hover:bg-slate-50",
          },
        }}
        fallbackRedirectUrl="/documents"
        forceRedirectUrl="/documents"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
