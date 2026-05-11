"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TR_CITIES } from "@/lib/types"
import { User } from "lucide-react"

const profileSchema = z.object({
  full_name: z.string().min(2, "En az 2 karakter").max(100),
  username: z.string()
    .min(3, "En az 3 karakter")
    .max(20, "En fazla 20 karakter")
    .regex(/^[a-z0-9_]+$/, "Sadece küçük harf, rakam ve alt çizgi"),
  city: z.string().min(1, "Şehir seçin"),
  bio: z.string().max(200).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileStepProps {
  onSubmit: (data: ProfileFormData) => Promise<void>
  onBack: () => void
}

export function ProfileStep({ onSubmit, onBack }: ProfileStepProps) {
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState("")

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  async function onFormSubmit(data: ProfileFormData) {
    setLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#073A30] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[#32E1BE]" />
        </div>
        <h2 className="text-2xl font-bold text-[#073A30]">Profilini Oluştur</h2>
        <p className="text-[#6B7773] mt-2 text-sm">Topluluğa katılmak için profilini tamamla</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#073A30] mb-2">Ad Soyad *</label>
          <Input {...register("full_name")} placeholder="Adın ve soyadın" />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#073A30] mb-2">Kullanıcı Adı *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7773] text-sm">@</span>
            <Input
              {...register("username")}
              placeholder="kullanici_adi"
              className="pl-7"
              onChange={(e) => setValue("username", e.target.value.toLowerCase())}
            />
          </div>
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#073A30] mb-2">Şehir *</label>
          <Select
            value={city}
            onValueChange={(val) => { if (val) { setCity(val); setValue("city", val) } }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              {TR_CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#073A30] mb-2">Hakkında (isteğe bağlı)</label>
          <Textarea
            {...register("bio")}
            placeholder="Kendin hakkında kısaca bir şeyler yaz..."
            rows={3}
            maxLength={200}
          />
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-bold py-3"
          >
            {loading ? "Oluşturuluyor..." : "Profili Oluştur"}
          </Button>
          <Button variant="ghost" onClick={onBack} className="w-full text-[#6B7773]">
            Geri Dön
          </Button>
        </div>
      </form>
    </div>
  )
}
