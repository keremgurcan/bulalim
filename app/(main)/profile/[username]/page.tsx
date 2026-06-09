import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfilePage } from "./client"
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

  return (
    <ProfilePage
      profile={profile}
      items={items ?? []}
      earnedBadges={earnedBadges}
      isOwn={isOwn}
    />
  )
}
