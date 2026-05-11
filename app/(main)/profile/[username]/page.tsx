import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfilePage } from "./client"
import type { BadgeType } from "@/lib/badges"

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

  const [{ data: items }, { data: badges }] = await Promise.all([
    supabase
      .from("items")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_badges")
      .select("badge")
      .eq("user_id", profile.id),
  ])

  const earnedBadges = (badges?.map((b: { badge: BadgeType }) => b.badge) ?? []) as BadgeType[]
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
