import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-6 py-16">
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
}
