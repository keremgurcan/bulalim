import { createClient } from "@/lib/supabase/server"
import { MessagesClient } from "./client"
import type { Conversation } from "@/lib/types"

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      *,
      items(id, title, type, photo_urls, category),
      initiator:initiator_id(id, full_name, avatar_url, username),
      owner:owner_id(id, full_name, avatar_url, username),
      messages(id, content, sender_id, created_at, read_at)
    `)
    .or(`initiator_id.eq.${user?.id},owner_id.eq.${user?.id}`)
    .order("last_message_at", { ascending: false })

  return (
    <MessagesClient
      conversations={(conversations as Conversation[]) ?? []}
      currentUserId={user?.id ?? ""}
    />
  )
}
