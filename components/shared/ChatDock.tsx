"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import type { Conversation, Message } from "@/lib/types"
import { ArrowLeft, CheckCircle2, MessageCircle, Send, ShieldCheck, Sparkles, X } from "lucide-react"
import { toast } from "sonner"

interface ChatDockProps {
  currentUserId: string
  // Sunucuda hesaplanan en iyi otomatik eşleşmenin conversation id'si (varsa).
  autoConversationId?: string | null
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Şimdi"
  if (mins < 60) return `${mins}dk`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}s`
  return `${Math.floor(hours / 24)}g`
}

// Sağ tarafa sabitlenen sohbet paneli. Eşleşen TÜM kullanıcıları listeler;
// kişi seçilince o kişiyle sohbet açılır. Otomatik eşleşme (autoConversationId)
// veya ?chat=<id> ile panel açık başlar.
export function ChatDock({ currentUserId, autoConversationId }: ChatDockProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paramChat = searchParams.get("chat")

  const initialChatId = paramChat ?? autoConversationId ?? null
  const [open, setOpen] = useState<boolean>(!!initialChatId)
  const [selectedId, setSelectedId] = useState<string | null>(initialChatId)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState("")
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  // Okundu bilgisi (DB'de messages UPDATE izni yok) — istemci tarafında localStorage'da
  // tutulur: bir sohbet açıldığında "o ana kadarı görüldü" işaretlenir.
  const [seen, setSeen] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bulalim_seen")
      if (raw) setSeen(JSON.parse(raw))
    } catch {
      // yok say
    }
  }, [])

  const markSeen = useCallback((convId: string) => {
    setSeen((prev) => {
      const next = { ...prev, [convId]: new Date().toISOString() }
      try { localStorage.setItem("bulalim_seen", JSON.stringify(next)) } catch { /* yok say */ }
      return next
    })
  }, [])

  // Kullanıcının tüm sohbetlerini (eşleşen herkes) çek — listeyi tazeler.
  const loadConversations = useCallback(() => {
    const supabase = createClient()
    supabase
      .from("conversations")
      .select(`
        *,
        items(id, title, type, photo_urls, category),
        initiator:initiator_id(id, full_name, avatar_url, username, is_verified),
        owner:owner_id(id, full_name, avatar_url, username, is_verified),
        messages(id, content, sender_id, created_at, read_at)
      `)
      .or(`initiator_id.eq.${currentUserId},owner_id.eq.${currentUserId}`)
      .order("last_message_at", { ascending: false })
      .then(({ data }) => setConversations((data as Conversation[]) ?? []))
  }, [currentUserId])

  useEffect(() => { loadConversations() }, [loadConversations])

  // Panel her açıldığında listeyi tazele (son mesajlar güncel görünsün).
  useEffect(() => {
    if (open) loadConversations()
  }, [open, loadConversations])

  // Seçili sohbetin mesajlarını çek + gerçek-zamanlı yeni mesajlara abone ol.
  useEffect(() => {
    if (!selectedId) {
      setMessages([])
      return
    }
    const supabase = createClient()

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", selectedId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages((data as Message[]) ?? []))

    // Sohbet açıldı → görüldü olarak işaretle (yeşil rozet gider).
    markSeen(selectedId)

    const channel = supabase
      .channel(`dock:${selectedId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selectedId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
          markSeen(selectedId) // açık sohbette gelen mesaj okunmuş sayılır
          loadConversations() // liste önizlemesi/sırası tazelensin
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedId, markSeen, loadConversations])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function getOther(conv: Conversation) {
    return conv.initiator_id === currentUserId ? conv.owner : conv.initiator
  }

  // Okunmamış = karşı taraftan gelen ve "görüldü" anından sonraki mesajlar.
  function unreadCount(conv: Conversation) {
    const seenAt = seen[conv.id]
    return (conv.messages ?? []).filter(
      (m) => m.sender_id !== currentUserId && (!seenAt || new Date(m.created_at) > new Date(seenAt)),
    ).length
  }

  const totalUnread = conversations.reduce((sum, c) => sum + unreadCount(c), 0)

  function closeDock() {
    setOpen(false)
    if (paramChat) router.replace(pathname)
  }

  async function sendMessage() {
    if (!selectedId || !newMsg.trim() || sending) return
    setSending(true)
    const supabase = createClient()
    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedId,
      sender_id: currentUserId,
      content: newMsg.trim(),
    })
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", selectedId)
    setSending(false)
    if (error) { toast.error("Mesaj gönderilemedi"); return }
    setNewMsg("")
    loadConversations() // liste son mesajla yenilensin
  }

  // Panel kapalıyken sağ kenarda küçük açma sekmesi (kişi seçmek için tekrar açılır).
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/3 z-40 flex items-center gap-2 rounded-l-xl bg-[#073A30] py-3 pl-3 pr-2 text-white shadow-lg transition-transform hover:translate-x-0 hover:bg-[#0F5547]"
        aria-label="Sohbetleri aç"
      >
        <MessageCircle className="h-5 w-5" />
        {totalUnread > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#32E1BE] px-1 text-xs font-bold text-[#073A30]">
            {totalUnread}
          </span>
        )}
      </button>
    )
  }

  const selected = conversations.find((c) => c.id === selectedId) ?? null
  const other = selected ? getOther(selected) : null

  return (
    <aside className="fixed right-0 top-16 bottom-0 z-40 flex w-full max-w-md flex-col border-l border-[#E8EDEB] bg-white shadow-2xl">
      {/* Panel başlığı */}
      <div className="flex items-center justify-between bg-[#073A30] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          {selected && (
            <button onClick={() => setSelectedId(null)} className="rounded-lg p-1 hover:bg-white/10" aria-label="Geri">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          {selected ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 ring-2 ring-[#32E1BE]">
                <AvatarImage src={other?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-[#0F5547] text-xs text-white">
                  {other?.full_name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span className="font-bold leading-none">{other?.full_name ?? "Kullanıcı"}</span>
                {other?.is_verified && <CheckCircle2 className="h-4 w-4 text-[#32E1BE]" />}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#32E1BE]" />
              <span className="font-bold">Eşleşmeler & Sohbetler</span>
            </div>
          )}
        </div>
        <button onClick={closeDock} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Kapat">
          <X className="h-5 w-5" />
        </button>
      </div>

      {selected ? (
        <ThreadView
          selected={selected}
          messages={messages}
          currentUserId={currentUserId}
          newMsg={newMsg}
          setNewMsg={setNewMsg}
          sending={sending}
          sendMessage={sendMessage}
          endRef={endRef}
        />
      ) : (
        <ConversationList
          conversations={conversations}
          currentUserId={currentUserId}
          getOther={getOther}
          unreadCount={unreadCount}
          onSelect={setSelectedId}
        />
      )}
    </aside>
  )
}

interface ConversationListProps {
  conversations: Conversation[]
  currentUserId: string
  getOther: (c: Conversation) => Conversation["owner"]
  unreadCount: (c: Conversation) => number
  onSelect: (id: string) => void
}

function ConversationList({ conversations, getOther, unreadCount, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-[#6B7773]">
        <div className="mb-3 text-4xl">💬</div>
        <p className="text-sm">Henüz eşleşmen yok.</p>
        <p className="mt-1 text-xs">Bir ilan verince eşleşen kişiler burada listelenir.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => {
        const other = getOther(conv)
        const lastMsg = (conv.messages ?? []).at(-1)
        const unread = unreadCount(conv)
        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className="flex w-full items-center gap-3 border-b border-[#E8EDEB] p-3 text-left transition-colors hover:bg-[#F7F9F8]"
          >
            <Avatar className="h-11 w-11 flex-shrink-0">
              <AvatarImage src={other?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-[#073A30] text-sm text-white">
                {other?.full_name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-semibold text-[#073A30]">{other?.full_name}</span>
                <span className="flex-shrink-0 text-xs text-[#6B7773]">{lastMsg ? timeAgo(lastMsg.created_at) : ""}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs text-[#6B7773]">{lastMsg?.content ?? "Sohbet başladı"}</p>
                {unread > 0 && (
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#32E1BE] text-xs font-bold text-[#073A30]">
                    {unread}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-[#32E1BE]">📦 {conv.items?.title}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

interface ThreadViewProps {
  selected: Conversation
  messages: Message[]
  currentUserId: string
  newMsg: string
  setNewMsg: (v: string) => void
  sending: boolean
  sendMessage: () => void
  endRef: React.RefObject<HTMLDivElement | null>
}

function ThreadView({ selected, messages, currentUserId, newMsg, setNewMsg, sending, sendMessage, endRef }: ThreadViewProps) {
  const item = selected.items
  return (
    <>
      {/* İlan bağlamı */}
      {item && (
        <Link
          href={`/items/${item.id}`}
          className="flex items-center gap-2 border-b border-[#E8EDEB] bg-[#F7F9F8] px-4 py-2 text-xs text-[#073A30] hover:bg-[#EEF4F2]"
        >
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.type === "lost" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {item.type === "lost" ? "Kayıp" : "Bulundu"}
          </span>
          <span className="truncate font-medium">📦 {item.title}</span>
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
    </>
  )
}
