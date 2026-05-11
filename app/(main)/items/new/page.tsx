"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { CATEGORY_LABELS, TR_CITIES } from "@/lib/types"
import type { ItemCategory } from "@/lib/types"
import { toast } from "sonner"
import { Upload, X, Search, Star } from "lucide-react"

const LocationPicker = dynamic(
  () => import("@/components/map/LocationPicker").then(m => m.LocationPicker),
  { ssr: false }
)

const itemSchema = z.object({
  title: z.string().min(3, "En az 3 karakter").max(80, "En fazla 80 karakter"),
  description: z.string().min(10, "En az 10 karakter").max(500),
  category: z.string().min(1, "Kategori seçin"),
  date_lost_or_found: z.string().min(1, "Tarih seçin"),
  city: z.string().min(1, "Şehir seçin"),
})

type ItemFormData = z.infer<typeof itemSchema>

export default function NewItemPage() {
  const router = useRouter()
  const [step, setStep] = useState<0 | 1>(0)
  const [itemType, setItemType] = useState<"lost" | "found" | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [location, setLocation] = useState({ lat: 41.0082, lng: 28.9784, address: "" })
  const [city, setCity] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: { date_lost_or_found: new Date().toISOString().split("T")[0] },
  })

  const title = watch("title") ?? ""

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3)
    setPhotos(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  function removePhoto(i: number) {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i))
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleLocationChange(lat: number, lng: number, address: string) {
    setLocation({ lat, lng, address })
  }

  async function onSubmit(data: ItemFormData) {
    if (!itemType) { toast.error("İlan türü seçin"); return }
    if (!location.address) { toast.error("Konum seçin"); return }

    setLoading(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error("Giriş yapmanız gerekiyor"); setLoading(false); return }

    const photoUrls: string[] = []
    for (const photo of photos) {
      const ext = photo.name.split(".").pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("item-photos")
        .upload(path, photo, { contentType: photo.type })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("item-photos").getPublicUrl(path)
        photoUrls.push(urlData.publicUrl)
      }
    }

    const { data: item, error } = await supabase.from("items").insert({
      user_id: user.id,
      type: itemType,
      title: data.title,
      description: data.description,
      category: data.category as ItemCategory,
      photo_urls: photoUrls,
      lat: location.lat,
      lng: location.lng,
      location_text: location.address,
      city: data.city,
      date_lost_or_found: data.date_lost_or_found,
      status: "active",
    }).select().single()

    setLoading(false)

    if (error || !item) {
      toast.error("İlan oluşturulurken hata oluştu")
      return
    }

    // Award points
    const points = itemType === "found" ? 10 : 5
    await supabase.rpc("increment_points", { user_id: user.id, amount: points })

    toast.success("İlanın yayınlandı! Topluluk arayışına başlıyor ✨")
    router.push(`/items/${item.id}`)
  }

  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#073A30] text-center mb-2">Nasıl bir ilan vereceksin?</h1>
        <p className="text-center text-[#6B7773] mb-10">Kaybettiğin mi, yoksa bulduğun mu var?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => { setItemType("lost"); setStep(1) }}
            className="group border-2 border-[#E8EDEB] rounded-2xl p-8 text-center hover:border-red-400 hover:bg-red-50 transition-all"
          >
            <div className="text-6xl mb-4">😟</div>
            <h2 className="text-xl font-bold text-[#073A30] mb-2 group-hover:text-red-600">Bir şey kaybettim</h2>
            <p className="text-sm text-[#6B7773]">Kayıp ilanı oluştur, topluluk yardımına koşsun</p>
            <div className="mt-4 text-xs text-[#6B7773] bg-[#F7F9F8] rounded-lg px-3 py-2">+5 puan</div>
          </button>

          <button
            onClick={() => { setItemType("found"); setStep(1) }}
            className="group border-2 border-[#E8EDEB] rounded-2xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition-all"
          >
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-bold text-[#073A30] mb-2 group-hover:text-green-600">Bir şey buldum</h2>
            <p className="text-sm text-[#6B7773]">Buluntu ilanı ver, sahibe kavuştur</p>
            <div className="mt-4 text-xs text-[#6B7773] bg-[#F7F9F8] rounded-lg px-3 py-2">+10 puan</div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setStep(0)} className="text-[#6B7773] hover:text-[#073A30]">←</button>
        <div>
          <h1 className="text-2xl font-bold text-[#073A30]">
            {itemType === "lost" ? "😟 Kayıp İlanı" : "✨ Buluntu İlanı"}
          </h1>
          <p className="text-sm text-[#6B7773]">Detayları doldur, ilan ver</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photos */}
        <div>
          <label className="block text-sm font-semibold text-[#073A30] mb-2">Fotoğraf (en fazla 3)</label>
          <div className="flex gap-3 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E8EDEB]">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-[#E8EDEB] flex flex-col items-center justify-center cursor-pointer hover:border-[#32E1BE] transition-colors">
                <Upload className="w-6 h-6 text-[#6B7773]" />
                <span className="text-xs text-[#6B7773] mt-1">Ekle</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-[#073A30] mb-2">Başlık *</label>
          <Input {...register("title")} placeholder="Örn: Siyah deri cüzdan" maxLength={80} />
          <div className="flex justify-between mt-1">
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            <span className="text-xs text-[#6B7773] ml-auto">{title.length}/80</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[#073A30] mb-2">Açıklama *</label>
          <Textarea
            {...register("description")}
            placeholder="Eşyayı detaylı açıkla: rengi, markası, içindekiler, ayırt edici özellikleri..."
            rows={4}
            maxLength={500}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Category + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#073A30] mb-2">Kategori *</label>
            <Select value={category} onValueChange={(v) => { if (v) { setCategory(v); setValue("category", v) } }}>
              <SelectTrigger>
                <SelectValue placeholder="Seçin" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(CATEGORY_LABELS) as [ItemCategory, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#073A30] mb-2">
              {itemType === "lost" ? "Kaybolma Tarihi" : "Bulma Tarihi"} *
            </label>
            <Input
              {...register("date_lost_or_found")}
              type="date"
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.date_lost_or_found && <p className="text-red-500 text-xs mt-1">{errors.date_lost_or_found.message}</p>}
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-[#073A30] mb-2">Şehir *</label>
          <Select value={city} onValueChange={(v) => { if (v) { setCity(v); setValue("city", v) } }}>
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

        {/* Location Picker */}
        <div>
          <label className="block text-sm font-semibold text-[#073A30] mb-2">Konum *</label>
          <LocationPicker onLocationChange={handleLocationChange} />
          {!location.address && (
            <p className="text-amber-600 text-xs mt-1">Lütfen haritada konum seçin</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-bold py-3 text-base"
        >
          {loading ? "İlan Yayınlanıyor..." : "İlanı Yayınla ✨"}
        </Button>
      </form>
    </div>
  )
}
