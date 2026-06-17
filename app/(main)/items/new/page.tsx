"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { computeSimilarityScore, MATCH_THRESHOLD } from "@/lib/matching"
import { CATEGORY_LABELS, TR_CITIES } from "@/lib/types"
import type { ItemCategory } from "@/lib/types"
import { useT } from "@/components/i18n/LocaleProvider"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"

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
  return (
    <Suspense fallback={null}>
      <NewItemForm />
    </Suspense>
  )
}

function NewItemForm() {
  const router = useRouter()
  const dict = useT()
  const t = dict.newItem
  const searchParams = useSearchParams()
  // BUL → buluntu (found) ilanı, İlan Ver → kayıp (lost) ilanı: tür linkten gelirse seçim adımını atla
  const typeParam = searchParams.get("type")
  const presetType: "lost" | "found" | null =
    typeParam === "lost" || typeParam === "found" ? typeParam : null
  const [step, setStep] = useState<0 | 1>(presetType ? 1 : 0)
  const [itemType, setItemType] = useState<"lost" | "found" | null>(presetType)
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
    if (!itemType) { toast.error(t.errType); return }
    if (!location.address) { toast.error(t.errLocation); return }

    setLoading(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error(t.errLogin); setLoading(false); return }

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
      toast.error(t.errCreate)
      return
    }

    // Award points
    const points = itemType === "found" ? 10 : 5
    await supabase.rpc("increment_points", { user_id: user.id, amount: points })

    // Otomatik eşleştirme: zıt türdeki aktif ilanlarda %50+ kelime eşleşmesi ara.
    // En iyi eşleşme bulunursa o ilan sahibiyle sohbeti otomatik aç ve oraya yönlendir.
    const { data: candidates } = await supabase
      .from("items")
      .select("id, user_id, type, title, description, category, lat, lng, date_lost_or_found")
      .eq("type", itemType === "lost" ? "found" : "lost")
      .eq("status", "active")
      .neq("user_id", user.id)
      .limit(100)

    const best = (candidates ?? [])
      .map((c: typeof item) => ({ c, score: computeSimilarityScore(item, c) }))
      .filter((m) => m.score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score)[0]

    if (best) {
      const { data: conv } = await supabase
        .from("conversations")
        .upsert(
          { item_id: best.c.id, initiator_id: user.id, owner_id: best.c.user_id },
          { onConflict: "item_id,initiator_id" },
        )
        .select()
        .single()

      if (conv) {
        const pct = Math.round(best.score * 100)
        // İlk mesajı otomatik bırak ki sohbet boş açılmasın ve eşleşme bağlamı belli olsun.
        await supabase.from("messages").insert({
          conversation_id: conv.id,
          sender_id: user.id,
          content: `Merhaba! İlanlarımız %${pct} eşleşti — "${item.title}" ile "${best.c.title}". Sanırım eşya konusunda yardımlaşabiliriz 🙂`,
        })
        await supabase
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conv.id)

        toast.success(t.matchFound.replace("{n}", String(pct)))
        router.push(`/feed?chat=${conv.id}`)
        return
      }
    }

    toast.success(t.successPublished)
    router.push(`/items/${item.id}`)
  }

  if (step === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[#073A30] text-center mb-2">{t.pickTitle}</h1>
        <p className="text-center text-[#6B7773] mb-10">{t.pickSubtitle}</p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <button
            onClick={() => { setItemType("lost"); setStep(1) }}
            className="group relative overflow-hidden rounded-[28px] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#32E1BE]/40"
            aria-label={`${t.lostCardTitle} — ${t.lostCardDesc}`}
          >
            <div className="relative aspect-[3234/1944] w-full">
              <Image
                src="/type-lost.png"
                alt={t.lostCardTitle}
                fill
                sizes="(min-width: 768px) 460px, calc(100vw - 32px)"
                className="object-contain"
                priority
              />
            </div>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#073A30] shadow-sm">{t.lostPoints}</span>
          </button>

          <button
            onClick={() => { setItemType("found"); setStep(1) }}
            className="group relative overflow-hidden rounded-[28px] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#32E1BE]/40"
            aria-label={`${t.foundCardTitle} — ${t.foundCardDesc}`}
          >
            <div className="relative aspect-[3234/1944] w-full">
              <Image
                src="/type-found.png"
                alt={t.foundCardTitle}
                fill
                sizes="(min-width: 768px) 460px, calc(100vw - 32px)"
                className="object-contain"
                priority
              />
            </div>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#073A30] shadow-sm">{t.foundPoints}</span>
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
            {itemType === "lost" ? t.lostHeader : t.foundHeader}
          </h1>
          <p className="text-sm text-[#6B7773]">{t.formSubtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photos */}
        <div>
          <label className="block text-sm font-semibold text-[#073A30] mb-2">{t.photos}</label>
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
                <span className="text-xs text-[#6B7773] mt-1">{t.addPhoto}</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-[#073A30] mb-2">{t.title}</label>
          <Input {...register("title")} placeholder={t.titlePlaceholder} maxLength={80} />
          <div className="flex justify-between mt-1">
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            <span className="text-xs text-[#6B7773] ml-auto">{title.length}/80</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[#073A30] mb-2">{t.description}</label>
          <Textarea
            {...register("description")}
            placeholder={t.descriptionPlaceholder}
            rows={4}
            maxLength={500}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Category + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#073A30] mb-2">{t.category}</label>
            <Select value={category} onValueChange={(v) => { if (v) { setCategory(v); setValue("category", v) } }}>
              <SelectTrigger>
                <SelectValue placeholder={t.select} />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CATEGORY_LABELS) as ItemCategory[]).map((k) => (
                  <SelectItem key={k} value={k}>{dict.categories[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#073A30] mb-2">
              {itemType === "lost" ? t.dateLost : t.dateFound} *
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
          <label className="block text-sm font-semibold text-[#073A30] mb-2">{t.city}</label>
          <Select value={city} onValueChange={(v) => { if (v) { setCity(v); setValue("city", v) } }}>
            <SelectTrigger>
              <SelectValue placeholder={t.selectCity} />
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
          <label className="block text-sm font-semibold text-[#073A30] mb-2">{t.location}</label>
          <LocationPicker onLocationChange={handleLocationChange} />
          {!location.address && (
            <p className="text-amber-600 text-xs mt-1">{t.pickLocation}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-bold py-3 text-base"
        >
          {loading ? t.publishing : t.publish}
        </Button>
      </form>
    </div>
  )
}
