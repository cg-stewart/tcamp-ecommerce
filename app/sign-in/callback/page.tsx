import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignInCallback() {
  const { has } = await auth();
  
  // Redirect based on role
  if (has({ role: 'org:admin' })) {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}
