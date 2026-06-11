"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { BadgeIcon } from "@/components/brand/BadgeIcon"
import { FEATURED_BADGES, BADGE_META } from "@/lib/badges"
import { createClient } from "@/lib/supabase/client"
import type { Conversation, Message } from "@/lib/types"
import { CheckCircle2, Send, ShieldCheck, Sparkles, X } from "lucide-react"
import { toast } from "sonner"

interface ChatDockProps {
  currentUserId: string
  // Sunucuda hesaplanan en iyi otomatik eşleşmenin conversation id'si (varsa).
  autoConversationId?: string | null
}

// Sağ tarafa sabitlenen sohbet paneli.
// İki şekilde açılır:
//  1) URL'de ?chat=<conversationId> varsa (ör. /feed?chat=...),
//  2) sunucu bir otomatik eşleşme bulduysa (autoConversationId) — kullanıcı kapatana
//     kadar otomatik açılır; kapatınca o oturumda tekrar açılmaz.
export function ChatDock({ currentUserId, autoConversationId }: ChatDockProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paramChat = searchParams.get("chat")
  const [closedId, setClosedId] = useState<string | null>(null)

  const autoChat = autoConversationId && autoConversationId !== closedId ? autoConversationId : null
  const chatId = paramChat ?? autoChat

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState("")
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  // Sohbet + mesajları çek ve gerçek-zamanlı yeni mesajlara abone ol.
  useEffect(() => {
    if (!chatId) {
      setConversation(null)
      setMessages([])
      return
    }
    const supabase = createClient()

    supabase
      .from("conversations")
      .select(`
        *,
        items(id, title, type, photo_urls, category, location_text, city),
        initiator:initiator_id(id, full_name, avatar_url, username, is_verified),
        owner:owner_id(id, full_name, avatar_url, username, is_verified)
      `)
      .eq("id", chatId)
      .single()
      .then(({ data }) => setConversation((data as Conversation) ?? null))

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", chatId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages((data as Message[]) ?? []))

    const channel = supabase
      .channel(`dock:${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${chatId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message]),
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [chatId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!chatId) return null

  const other =
    conversation?.initiator_id === currentUserId ? conversation?.owner : conversation?.initiator
  const item = conversation?.items

  function close() {
    // URL'den geldiyse parametreyi düşür; otomatik açıldıysa bu oturumda kapalı tut.
    setClosedId(chatId)
    if (paramChat) router.replace(pathname)
  }

  async function sendMessage() {
    if (!chatId || !newMsg.trim() || sending) return
    setSending(true)
    const supabase = createClient()
    const { error } = await supabase.from("messages").insert({
      conversation_id: chatId,
      sender_id: currentUserId,
      content: newMsg.trim(),
    })
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", chatId)
    setSending(false)
    if (error) { toast.error("Mesaj gönderilemedi"); return }
    setNewMsg("")
  }

  return (
    <aside className="fixed right-0 top-16 bottom-0 z-40 flex w-full max-w-md flex-col border-l border-[#E8EDEB] bg-white shadow-2xl">
      {/* Eşleşen kullanıcı başlığı */}
      <div className="bg-[#073A30] p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 ring-2 ring-[#32E1BE]">
              <AvatarImage src={other?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-[#0F5547] text-white">
                {other?.full_name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold leading-none">{other?.full_name ?? "Eşleşen Kullanıcı"}</span>
                {other?.is_verified && <CheckCircle2 className="h-4 w-4 text-[#32E1BE]" />}
              </div>
              <span className="text-xs text-[#9FD9CC]">{other?.is_verified ? "Verified User" : "Üye"}</span>
            </div>
          </div>
          <button onClick={close} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-[#32E1BE]" />
          Eşleşme sağlandı — sohbete başlayın 🎉
        </p>
        <div className="mt-2 flex items-center gap-2">
          {FEATURED_BADGES.map((b) => (
            <span key={b} title={BADGE_META[b].label}>
              <BadgeIcon badge={b} size={24} />
            </span>
          ))}
        </div>
      </div>

      {/* İlan bağlamı */}
      {item && (
        <Link
          href={`/items/${item.id}`}
          className="flex items-center gap-2 border-b border-[#E8EDEB] bg-[#F7F9F8] px-4 py-2 text-xs text-[#073A30] hover:bg-[#EEF4F2]"
        >
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.type === "lost" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {item.type === "lost" ? "Kayıp" : "Bulundu"}
          </span>
          <span className="font-medium truncate">📦 {item.title}</span>
        </Link>
      )}

      {/* Mesajlar */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMine
                    ? "rounded-br-sm bg-[#073A30] text-white"
                    : "rounded-bl-sm border border-[#E8EDEB] bg-[#F7F9F8] text-[#073A30]"
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <p className={`mt-1 text-xs ${isMine ? "text-right text-white/60" : "text-[#6B7773]"}`}>
                  {new Date(msg.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {/* Giriş */}
      <div className="border-t border-[#E8EDEB] p-3">
        <div className="mb-2 flex items-start gap-2 rounded-lg bg-[#FFF8E7] p-2.5 text-xs text-[#8a6d00]">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#caa600]" />
          <span>Güvenliğiniz için buluşma noktasını kamuya açık, kalabalık alanlardan seçin.</span>
        </div>
        <div className="flex gap-2">
          <Textarea
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Mesajını yaz..."
            rows={1}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button
            onClick={sendMessage}
            disabled={sending || !newMsg.trim()}
            className="bg-[#073A30] px-4 text-white hover:bg-[#0F5547]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
