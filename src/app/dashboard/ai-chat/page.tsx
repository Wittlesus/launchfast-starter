import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AiChatContent from "@/components/ai-chat/AiChatContent";

export default async function AiChatPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <AiChatContent user={session.user} />;
}
