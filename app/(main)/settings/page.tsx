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

export default function SettingsPage() {
  const router = useRouter()
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
    if (error) { toast.error("Kaydedilemedi"); return }
    toast.success("Profil güncellendi")
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
    toast.success("Hesabın silindi")
  }

  if (!profile) return <div className="max-w-xl mx-auto px-4 py-12 text-center text-[#6B7773]">Yükleniyor...</div>

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#073A30] mb-6">Ayarlar</h1>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-[#E8EDEB] p-6 space-y-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-[#32E1BE]" />
          <h2 className="font-semibold text-[#073A30]">Hesap Bilgileri</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7773] mb-1.5">Telefon</label>
          <Input value={profile.phone} disabled className="bg-[#F7F9F8] text-[#6B7773]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7773] mb-1.5">Ad Soyad</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7773] mb-1.5">Şehir</label>
          <Select value={city} onValueChange={(v) => { if (v) setCity(v) }}>
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              {TR_CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7773] mb-1.5">Hakkında</label>
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kendin hakkında..."
            maxLength={200}
          />
        </div>

        <Button
          onClick={saveProfile}
          disabled={loading}
          className="w-full bg-[#073A30] hover:bg-[#0F5547] text-white"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl border border-[#E8EDEB] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#32E1BE]" />
          <h2 className="font-semibold text-[#073A30]">Gizlilik</h2>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-[#073A30]">Profil görünürlüğü</p>
            <p className="text-xs text-[#6B7773]">Profilin arama sonuçlarında görünsün</p>
          </div>
          <div className="w-11 h-6 bg-[#32E1BE] rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-[#E8EDEB] p-6">
        <h2 className="font-semibold text-[#073A30] mb-4">Hesap İşlemleri</h2>
        <div className="space-y-3">
          <Button
            onClick={signOut}
            variant="outline"
            className="w-full justify-start gap-2 border-[#E8EDEB] text-[#073A30] hover:bg-[#F7F9F8]"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </Button>
          <Button
            onClick={() => setDeleteOpen(true)}
            variant="ghost"
            className="w-full justify-start gap-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Hesabı Sil
          </Button>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Hesabı Sil</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#6B7773]">
            Hesabını silmek istediğine emin misin? Bu işlem geri alınamaz.
            Tüm ilanların ve mesajların silinecek.
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} className="flex-1">İptal</Button>
            <Button onClick={deleteAccount} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              Evet, Sil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
