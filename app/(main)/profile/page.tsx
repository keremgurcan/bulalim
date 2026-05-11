import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfilePage } from "./[username]/client"

export default async function MyProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/sign-in")

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  if (profile?.username) {
    redirect(`/profile/${profile.username}`)
  }

  return null
}
