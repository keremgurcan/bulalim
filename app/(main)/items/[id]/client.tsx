"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import type { Item } from "@/lib/types"
import { toast } from "sonner"
import { MessageCircle, CheckCircle2, Trash2, Edit } from "lucide-react"

interface ItemActionsProps {
  item: Item
  isOwner: boolean
  userId: string | null
}

export function ItemActions({ item, isOwner, userId }: ItemActionsProps) {
  const router = useRouter()
  const [messageOpen, setMessageOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  async function sendMessage() {
    if (!userId || !message.trim()) return
    setSending(true)
    const supabase = createClient()

    let { data: conv } = await supabase
      .from("conversations")
      .select("id")
      .eq("item_id", item.id)
      .eq("initiator_id", userId)
      .single()

    if (!conv) {
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({ item_id: item.id, initiator_id: userId, owner_id: item.user_id })
        .select("id")
        .single()
      if (error || !newConv) { toast.error("Sohbet başlatılamadı"); setSending(false); return }
      conv = newConv
    }

    const { error } = await supabase.from("messages").insert({
      conversation_id: conv.id,
      sender_id: userId,
      content: message.trim(),
    })

    setSending(false)
    if (error) { toast.error("Mesaj gönderilemedi"); return }

    setMessageOpen(false)
    setMessage("")
    toast.success("Mesajın gönderildi!")
    router.push("/messages")
  }

  async function markResolved() {
    const supabase = createClient()
    await supabase.from("items").update({ status: "resolved" }).eq("id", item.id)
    toast.success("İlan çözüldü olarak işaretlendi!")
    router.refresh()
  }

  async function deleteItem() {
    if (!confirm("Bu ilanı silmek istediğine emin misin?")) return
    const supabase = createClient()
    await supabase.from("items").delete().eq("id", item.id)
    toast.success("İlan silindi")
    router.push("/feed")
  }

  return (
    <>
      <div className="space-y-2">
        {!isOwner && userId && item.status === "active" && (
          <Button
            onClick={() => setMessageOpen(true)}
            className="w-full bg-[#073A30] hover:bg-[#0F5547] text-white gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Mesaj Gönder
          </Button>
        )}

        {!userId && (
          <Link href="/sign-in">
            <Button className="w-full bg-[#073A30] hover:bg-[#0F5547] text-white">
              Mesaj göndermek için giriş yap
            </Button>
          </Link>
        )}

        {isOwner && item.status === "active" && (
          <>
            <Button
              onClick={markResolved}
              variant="outline"
              className="w-full border-[#32E1BE] text-[#073A30] gap-2 hover:bg-[#32E1BE]/10"
            >
              <CheckCircle2 className="w-4 h-4 text-[#32E1BE]" />
              Bulundu Olarak İşaretle
            </Button>
            <Button
              onClick={deleteItem}
              variant="ghost"
              className="w-full text-red-500 hover:bg-red-50 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              İlanı Sil
            </Button>
          </>
        )}
      </div>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mesaj Gönder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-[#F7F9F8] rounded-lg p-3 text-sm">
              <span className="text-[#6B7773]">İlan: </span>
              <span className="font-medium text-[#073A30]">{item.title}</span>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mesajını yaz..."
              rows={4}
              maxLength={500}
            />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setMessageOpen(false)} className="flex-1">İptal</Button>
              <Button
                onClick={sendMessage}
                disabled={sending || !message.trim()}
                className="flex-1 bg-[#073A30] hover:bg-[#0F5547] text-white"
              >
                {sending ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
