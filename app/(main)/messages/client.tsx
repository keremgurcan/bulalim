"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import type { Conversation, Message } from "@/lib/types"
import { Send, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface MessagesClientProps {
  conversations: Conversation[]
  currentUserId: string
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

export function MessagesClient({ conversations, currentUserId }: MessagesClientProps) {
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selected) return
    const supabase = createClient()

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", selected.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data as Message[] ?? []))

    const channel = supabase
      .channel(`conv:${selected.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${selected.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selected?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!selected || !newMsg.trim() || sending) return
    setSending(true)
    const supabase = createClient()
    const { error } = await supabase.from("messages").insert({
      conversation_id: selected.id,
      sender_id: currentUserId,
      content: newMsg.trim(),
    })
    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", selected.id)
    setSending(false)
    if (error) { toast.error("Mesaj gönderilemedi"); return }
    setNewMsg("")
  }

  function getOtherUser(conv: Conversation) {
    return conv.initiator_id === currentUserId ? conv.owner : conv.initiator
  }

  const unreadCount = (conv: Conversation) =>
    (conv.messages ?? []).filter(
      (m) => m.sender_id !== currentUserId && !m.read_at
    ).length

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-64px)] flex border-x border-[#E8EDEB]">
      {/* Conversation list */}
      <div className={`w-full md:w-80 border-r border-[#E8EDEB] flex flex-col ${selected ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-[#E8EDEB]">
          <h2 className="font-bold text-[#073A30] text-lg">Mesajlar</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-[#6B7773]">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm">Henüz mesajın yok</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherUser(conv)
              const lastMsg = (conv.messages ?? []).at(-1)
              const unread = unreadCount(conv)

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-[#F7F9F8] transition-colors text-left border-b border-[#E8EDEB] ${
                    selected?.id === conv.id ? "bg-[#F7F9F8]" : ""
                  }`}
                >
                  <Avatar className="w-11 h-11 flex-shrink-0">
                    <AvatarImage src={other?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-[#073A30] text-white text-sm">
                      {other?.full_name?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-[#073A30] truncate">{other?.full_name}</span>
                      <span className="text-xs text-[#6B7773] flex-shrink-0">
                        {lastMsg ? timeAgo(lastMsg.created_at) : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[#6B7773] truncate">{lastMsg?.content ?? "Sohbet başladı"}</p>
                      {unread > 0 && (
                        <span className="bg-[#32E1BE] text-[#073A30] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#32E1BE] truncate mt-0.5">{conv.items?.title}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Chat thread */}
      <div className={`flex-1 flex flex-col ${selected ? "flex" : "hidden md:flex"}`}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-[#6B7773]">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <p>Sohbet seçin</p>
            </div>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 p-4 border-b border-[#E8EDEB]">
              <button onClick={() => setSelected(null)} className="md:hidden">
                <ArrowLeft className="w-5 h-5 text-[#073A30]" />
              </button>
              <Avatar className="w-9 h-9">
                <AvatarImage src={getOtherUser(selected)?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-[#073A30] text-white text-sm">
                  {getOtherUser(selected)?.full_name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-[#073A30]">{getOtherUser(selected)?.full_name}</p>
                <Link href={`/items/${selected.item_id}`} className="text-xs text-[#32E1BE] hover:underline">
                  📦 {selected.items?.title}
                </Link>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.sender_id === currentUserId
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${
                        isMine
                          ? "bg-[#073A30] text-white rounded-br-sm"
                          : "bg-[#F7F9F8] text-[#073A30] border border-[#E8EDEB] rounded-bl-sm"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMine ? "text-white/60 text-right" : "text-[#6B7773]"}`}>
                        {new Date(msg.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#E8EDEB]">
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
                  className="bg-[#073A30] hover:bg-[#0F5547] text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
