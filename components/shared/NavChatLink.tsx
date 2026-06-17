"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface NavChatLinkProps {
  userId: string
  label: string
}

/**
 * Navbar'daki mesaj (chat) ikonu. Okunmamış mesaj varsa kırmızı rozet gösterir.
 * Okundu bilgisi /messages ile aynı localStorage anahtarından (bulalim_seen) okunur,
 * böylece sohbet açılınca rozet temizlenir.
 */
export function NavChatLink({ userId, label }: NavChatLinkProps) {
  const pathname = usePathname()
  const [unread, setUnread] = useState(0)

  const load = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: convs } = await supabase
        .from("conversations")
        .select("id")
        .or(`initiator_id.eq.${userId},owner_id.eq.${userId}`)
      const ids = (convs ?? []).map((c) => (c as { id: string }).id)
      if (ids.length === 0) {
        setUnread(0)
        return
      }
      const { data: msgs } = await supabase
        .from("messages")
        .select("conversation_id, sender_id, created_at")
        .in("conversation_id", ids)
        .order("created_at", { ascending: false })

      const lastByConv = new Map<string, { sender_id: string; created_at: string }>()
      for (const m of (msgs ?? []) as { conversation_id: string; sender_id: string; created_at: string }[]) {
        if (!lastByConv.has(m.conversation_id)) lastByConv.set(m.conversation_id, m)
      }

      let seen: Record<string, string> = {}
      try {
        seen = JSON.parse(localStorage.getItem("bulalim_seen") || "{}")
      } catch {
        seen = {}
      }

      let count = 0
      for (const [cid, m] of lastByConv) {
        if (m.sender_id === userId) continue
        const seenAt = seen[cid] ? new Date(seen[cid]).getTime() : 0
        if (new Date(m.created_at).getTime() > seenAt) count++
      }
      setUnread(count)
    } catch {
      // yok say
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load, pathname])

  useEffect(() => {
    const supabase = createClient()
    const ch = supabase
      .channel("nav-unread")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => load())
      .subscribe()

    const onSeen = () => load()
    const onFocus = () => load()
    window.addEventListener("bulalim:seen", onSeen)
    window.addEventListener("focus", onFocus)
    return () => {
      supabase.removeChannel(ch)
      window.removeEventListener("bulalim:seen", onSeen)
      window.removeEventListener("focus", onFocus)
    }
  }, [load])

  return (
    <Link
      href="/messages"
      aria-label={label}
      className="relative p-2 rounded-lg hover:bg-[#F7F9F8] transition-colors"
    >
      <MessageCircle className="w-5 h-5 text-[#073A30]" />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  )
}
