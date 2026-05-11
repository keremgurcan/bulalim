"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone } from "lucide-react"

const phoneSchema = z.object({
  phone: z.string().regex(/^\+90 5\d{2} \d{3} \d{2} \d{2}$/, "Geçerli bir Türk mobil numarası girin"),
})

type PhoneFormData = z.infer<typeof phoneSchema>

interface PhoneStepProps {
  onNext: (phone: string, code: string) => void
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 2) return `+90 `
  if (digits.length <= 5) return `+90 ${digits.slice(2)}`
  if (digits.length <= 8) return `+90 ${digits.slice(2, 5)} ${digits.slice(5)}`
  if (digits.length <= 10) return `+90 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  return `+90 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`
}

export function PhoneStep({ onNext }: PhoneStepProps) {
  const [loading, setLoading] = useState(false)
  const [demoCode, setDemoCode] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  })

  function onSubmit(data: PhoneFormData) {
    setLoading(true)
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    sessionStorage.setItem("bulalim_sms_code", code)
    setDemoCode(code)
    setTimeout(() => {
      setLoading(false)
      onNext(data.phone, code)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#073A30] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-[#32E1BE]" />
        </div>
        <h2 className="text-2xl font-bold text-[#073A30]">Telefon Numaranı Gir</h2>
        <p className="text-[#6B7773] mt-2 text-sm">SMS kodu göndereceğiz (demo modunda ekranda gösterilecek)</p>
      </div>

      {demoCode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
          📱 <strong>Demo modu</strong> — SMS kodu: <strong className="text-lg">{demoCode}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#073A30] mb-2">Telefon Numarası</label>
          <Input
            {...register("phone")}
            placeholder="+90 5__ ___ __ __"
            className="text-lg tracking-widest"
            onChange={(e) => {
              const formatted = formatPhone(e.target.value)
              setValue("phone", formatted)
            }}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#073A30] hover:bg-[#0F5547] text-white font-semibold py-3"
        >
          {loading ? "Kod Gönderiliyor..." : "Kod Gönder"}
        </Button>
      </form>
    </div>
  )
}
