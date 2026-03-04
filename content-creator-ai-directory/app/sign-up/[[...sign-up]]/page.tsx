import { SignUp } from "@clerk/nextjs";

const signUpAppearance = {
  variables: {
    colorPrimary: "#00f5d4",
    colorBackground: "#000000",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.7)",
    colorInputBackground: "rgba(255,255,255,0.05)",
    colorInputText: "#ffffff",
    borderRadius: "0.5rem",
  },
  elements: {
    formButtonPrimary:
      "bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)]",
    card: "bg-black border border-[var(--teal-bright)]/30",
    headerTitle: "text-white",
    headerSubtitle: "text-white/70",
    socialButtonsBlockButton:
      "border-[var(--teal-bright)]/50 text-[var(--teal-bright)]",
    formFieldLabel: "text-white/90",
    formFieldInput:
      "bg-white/5 border-white/20 text-white placeholder:text-white/50",
    footerActionLink:
      "text-[var(--teal-bright)] hover:text-[var(--teal-light)]",
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-black px-4 py-12">
      <SignUp
        appearance={signUpAppearance}
        fallbackRedirectUrl="/"
        signInUrl="/sign-in"
      />
    </div>
  );
}
