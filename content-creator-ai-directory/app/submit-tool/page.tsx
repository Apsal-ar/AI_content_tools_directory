import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SubmitToolForm } from "@/components/SubmitToolForm";

export default async function SubmitToolPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=" + encodeURIComponent("/submit-tool"));
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? "";

  return (
    <SubmitToolForm
      userEmail={email || "Signed-in user"}
      userId={userId}
    />
  );
}
