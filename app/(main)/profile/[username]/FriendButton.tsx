"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck, Clock, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { useT } from "@/components/i18n/LocaleProvider"
import { sendFriendRequest, acceptFriendRequest, removeFriend, openFriendConversation } from "./actions"

export type FriendStatus = "none" | "outgoing" | "incoming" | "friends"

interface FriendButtonProps {
  profileId: string
  status: FriendStatus
}

export function FriendButton({ profileId, status }: FriendButtonProps) {
  const t = useT().profile
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setBusy(true)
    const res = await fn()
    setBusy(false)
    if (!res.ok) {
      toast.error(res.error ?? "İşlem başarısız")
      return false
    }
    router.refresh()
    return true
  }

  async function handleMessage() {
    setBusy(true)
    const res = await openFriendConversation(profileId)
    setBusy(false)
    if (!res.ok || !res.conversationId) {
      toast.error(res.error ?? "Sohbet açılamadı")
      return
    }
    router.push(`/messages?c=${res.conversationId}`)
  }

  if (status === "friends") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleMessage}
          disabled={busy}
          className="gap-2 bg-[#073A30] text-white hover:bg-[#0F5547]"
        >
          <MessageCircle className="h-4 w-4" />
          {t.sendMessage}
        </Button>
        <Button
          variant="outline"
          onClick={() => run(() => removeFriend(profileId))}
          disabled={busy}
          className="gap-2 border-[#E8EDEB] text-[#6B7773]"
        >
          <UserCheck className="h-4 w-4 text-[#1FC4A2]" />
          {t.friendsLabel}
        </Button>
      </div>
    )
  }

  if (status === "incoming") {
    return (
      <Button
        onClick={() => run(() => acceptFriendRequest(profileId))}
        disabled={busy}
        className="gap-2 bg-[#32E1BE] font-semibold text-[#073A30] hover:bg-[#1FC4A2]"
      >
        <UserCheck className="h-4 w-4" />
        {t.acceptRequest}
      </Button>
    )
  }

  if (status === "outgoing") {
    return (
      <Button
        variant="outline"
        onClick={() => run(() => removeFriend(profileId))}
        disabled={busy}
        className="gap-2 border-[#E8EDEB] text-[#6B7773]"
      >
        <Clock className="h-4 w-4" />
        {t.requestSent}
      </Button>
    )
  }

  return (
    <Button
      onClick={() => run(() => sendFriendRequest(profileId))}
      disabled={busy}
      className="gap-2 bg-[#32E1BE] font-semibold text-[#073A30] hover:bg-[#1FC4A2]"
    >
      <UserPlus className="h-4 w-4" />
      {t.addFriend}
    </Button>
  )
}
