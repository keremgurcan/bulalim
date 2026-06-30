import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfilePage } from "./client"
import type { FriendStatus } from "./FriendButton"
import { getEarnedBadges } from "@/lib/badges"

interface Props {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const [{ data: profile }, { data: { user } }] = await Promise.all([
    supabase.from("profiles").select("*").eq("username", username).single(),
    supabase.auth.getUser(),
  ])

  if (!profile) notFound()

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  const itemList = items ?? []
  const resolvedCount = itemList.filter((i) => i.status === "resolved").length
  const earnedBadges = getEarnedBadges({
    itemCount: itemList.length,
    resolvedCount,
    isVerified: profile.is_verified,
  })
  const isOwn = user?.id === profile.id

  // Arkadaşlık durumu (giriş yapılmış ve başkasının profili ise)
  let friendStatus: FriendStatus = "none"
  if (user && !isOwn) {
    const { data: rels } = await supabase
      .from("friend_requests")
      .select("requester_id, addressee_id, status")
      .or(
        `and(requester_id.eq.${user.id},addressee_id.eq.${profile.id}),and(requester_id.eq.${profile.id},addressee_id.eq.${user.id})`
      )
    const list = rels ?? []
    if (list.some((r) => r.status === "accepted")) {
      friendStatus = "friends"
    } else if (list.some((r) => r.requester_id === user.id && r.status === "pending")) {
      friendStatus = "outgoing"
    } else if (list.some((r) => r.requester_id === profile.id && r.status === "pending")) {
      friendStatus = "incoming"
    }
  }

  return (
    <ProfilePage
      profile={profile}
      items={items ?? []}
      earnedBadges={earnedBadges}
      isOwn={isOwn}
      friendStatus={friendStatus}
      isAuthed={!!user}
    />
  )
}
