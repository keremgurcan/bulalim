import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/shared/Navbar"
import { Toaster } from "@/components/ui/sonner"
import { LocaleProvider } from "@/components/i18n/LocaleProvider"
import { normalizeLocale } from "@/lib/i18n"
import { syncTopMatchConversation } from "@/lib/auto-match"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("locale")?.value)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Otomatik eşleştirme: kullanıcının ilanlarıyla %50+ örtüşen zıt ilanları bul ve
  // sohbeti oluştur (yan etki). Hata verirse sayfa yine de açılmalı.
  try {
    await syncTopMatchConversation(supabase, user.id)
  } catch {
    // yok say
  }

  return (
    <LocaleProvider locale={locale}>
      <div className="flex flex-col min-h-screen">
        <Navbar profile={profile} />
        <main className="flex-1">
          {children}
        </main>
        <Toaster richColors position="top-center" />
      </div>
    </LocaleProvider>
  )
}
