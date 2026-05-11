"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isValidTCKimlik } from "@/lib/tc-kimlik"
import { Shield } from "lucide-react"

const tcSchema = z.object({
  tc: z.string().refine(isValidTCKimlik, { message: "Geçerli bir TC Kimlik numarası girin" }),
})

type TcFormData = z.infer<typeof tcSchema>

interface TcKimlikStepProps {
  onNext: (tc: string) => void
  onBack: () => void
}

export function TcKimlikStep({ onNext, onBack }: TcKimlikStepProps) {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<TcFormData>({
    resolver: zodResolver(tcSchema),
  })

  function onSubmit(data: TcFormData) {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onNext(data.tc)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#073A30] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-[#32E1BE]" />
        </div>
        <h2 className="text-2xl font-bold text-[#073A30]">TC Kimlik Doğrulama</h2>
        <p className="text-[#6B7773] mt-2 text-sm">Güvenli topluluk için kimlik doğrulaması zorunludur</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        ⚠️ <strong>Demo modu</strong> — Bu doğrulama sadece TC Kimlik algoritma kontrolü yapar.
        Gerçek uygulamada NVI servisi entegre edilecektir.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#073A30] mb-2">TC Kimlik Numarası</label>
          <Input
            {...register("tc")}
            placeholder="11 haneli TC Kimlik numaranız"
            maxLength={11}
            type="text"
            inputMode="numeric"
            className="text-center text-lg tracking-widest font-mono"
          />
          {errors.tc && (
            <p className="text-red-500 text-xs mt-1">{errors.tc.message}</p>
          )}
        </div>
        <p className="text-xs text-[#6B7773] bg-[#F7F9F8] rounded-lg p-3">
          🔒 TC Kimlik numaranız şifrelenmiş olarak saklanır. Ham numara hiçbir zaman kaydedilmez.
        </p>
        <div className="space-y-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#073A30] hover:bg-[#0F5547] text-white font-semibold py-3"
          >
            {loading ? "Doğrulanıyor..." : "Doğrula ve Devam Et"}
          </Button>
          <Button variant="ghost" onClick={onBack} className="w-full text-[#6B7773]">
            Geri Dön
          </Button>
        </div>
      </form>
    </div>
  )
}
