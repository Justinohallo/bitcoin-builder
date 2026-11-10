import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  // If Clerk is not configured, show a message
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-4">
            Authentication Not Configured
          </h1>
          <p className="text-neutral-400">
            Clerk authentication is not set up in this environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-neutral-900 border border-neutral-800",
              headerTitle: "text-neutral-100",
              headerSubtitle: "text-neutral-400",
              socialButtonsBlockButton:
                "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700",
              formButtonPrimary:
                "bg-orange-400 hover:bg-orange-500 text-neutral-950",
              formFieldInput:
                "bg-neutral-950 border-neutral-700 text-neutral-100",
              formFieldLabel: "text-neutral-300",
              footerActionLink: "text-orange-400 hover:text-orange-300",
              identityPreviewText: "text-neutral-200",
              identityPreviewEditButton:
                "text-orange-400 hover:text-orange-300",
            },
          }}
        />
      </div>
    </div>
  );
}
