import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/shared/Navbar"
import { ChatDock } from "@/components/shared/ChatDock"
import { Toaster } from "@/components/ui/sonner"
import { syncTopMatchConversation } from "@/lib/auto-match"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Otomatik eşleştirme: kullanıcının ilanlarıyla %50+ örtüşen zıt ilanları bul,
  // sohbeti oluştur ve en iyi eşleşmeyi sağdaki panelde otomatik aç.
  // Eşleştirme bir hata verirse sayfa yine de açılmalı.
  let autoConversationId: string | null = null
  try {
    autoConversationId = await syncTopMatchConversation(supabase, user.id)
  } catch {
    autoConversationId = null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile} />
      <main className="flex-1">
        {children}
      </main>
      <Suspense fallback={null}>
        <ChatDock currentUserId={user.id} autoConversationId={autoConversationId} />
      </Suspense>
      <Toaster richColors position="top-center" />
    </div>
  )
}
