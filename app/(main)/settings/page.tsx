"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { TR_CITIES } from "@/lib/types"
import type { Profile } from "@/lib/types"
import { toast } from "sonner"
import { User, Shield, LogOut, Trash2 } from "lucide-react"
import { useT } from "@/components/i18n/LocaleProvider"

export default function SettingsPage() {
  const router = useRouter()
  const t = useT().settings
  const [profile, setProfile] = useState<Profile | null>(null)
  const [city, setCity] = useState("")
  const [bio, setBio] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
        if (data) {
          setProfile(data)
          setCity(data.city ?? "")
          setBio(data.bio ?? "")
          setFullName(data.full_name ?? "")
        }
      })
    })
  }, [])

  async function saveProfile() {
    if (!profile) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, city, bio })
      .eq("id", profile.id)
    setLoading(false)
    if (error) { toast.error(t.saveError); return }
    toast.success(t.saved)
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  async function deleteAccount() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from("profiles").delete().eq("id", user.id)
    await supabase.auth.signOut()
    router.push("/")
    toast.success(t.accountDeleted)
  }

  if (!profile) return <div className="max-w-xl mx-auto px-4 py-12 text-center text-[#6B7773]">{t.loading}</div>

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#073A30] mb-6">{t.title}</h1>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-[#E8EDEB] p-6 space-y-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-[#32E1BE]" />
          <h2 className="font-semibold text-[#073A30]">{t.account}</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7773] mb-1.5">{t.phone}</label>
          <Input value={profile.phone} disabled className="bg-[#F7F9F8] text-[#6B7773]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7773] mb-1.5">{t.fullName}</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7773] mb-1.5">{t.city}</label>
          <Select value={city} onValueChange={(v) => { if (v) setCity(v) }}>
            <SelectTrigger>
              <SelectValue placeholder={t.cityPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {TR_CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7773] mb-1.5">{t.about}</label>
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t.aboutPlaceholder}
            maxLength={200}
          />
        </div>

        <Button
          onClick={saveProfile}
          disabled={loading}
          className="w-full bg-[#073A30] hover:bg-[#0F5547] text-white"
        >
          {loading ? t.saving : t.save}
        </Button>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl border border-[#E8EDEB] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#32E1BE]" />
          <h2 className="font-semibold text-[#073A30]">{t.privacy}</h2>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-[#073A30]">{t.profileVisibility}</p>
            <p className="text-xs text-[#6B7773]">{t.profileVisibilityDesc}</p>
          </div>
          <div className="w-11 h-6 bg-[#32E1BE] rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-[#E8EDEB] p-6">
        <h2 className="font-semibold text-[#073A30] mb-4">{t.accountActions}</h2>
        <div className="space-y-3">
          <Button
            onClick={signOut}
            variant="outline"
            className="w-full justify-start gap-2 border-[#E8EDEB] text-[#073A30] hover:bg-[#F7F9F8]"
          >
            <LogOut className="w-4 h-4" />
            {t.signOut}
          </Button>
          <Button
            onClick={() => setDeleteOpen(true)}
            variant="ghost"
            className="w-full justify-start gap-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            {t.deleteAccount}
          </Button>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">{t.deleteAccount}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#6B7773]">{t.deleteConfirm}</p>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} className="flex-1">{t.cancel}</Button>
            <Button onClick={deleteAccount} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              {t.yesDelete}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
