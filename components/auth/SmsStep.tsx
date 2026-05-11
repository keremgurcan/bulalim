"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface SmsStepProps {
  phone: string
  onNext: () => void
  onBack: () => void
}

export function SmsStep({ phone, onNext, onBack }: SmsStepProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value
    setDigits(newDigits)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleSubmit() {
    const code = digits.join("")
    const expected = sessionStorage.getItem("bulalim_sms_code")
    if (code === expected) {
      setError("")
      onNext()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= 3) {
        setError("3 yanlış deneme. Lütfen geri dön ve yeni kod iste.")
      } else {
        setError(`Yanlış kod. ${3 - newAttempts} deneme hakkın kaldı.`)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#073A30] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-[#32E1BE]" />
        </div>
        <h2 className="text-2xl font-bold text-[#073A30]">SMS Kodu</h2>
        <p className="text-[#6B7773] mt-2 text-sm">
          <strong>{phone}</strong> numarasına gönderilen 6 haneli kodu gir
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:border-[#32E1BE] transition-colors"
            style={{ borderColor: digit ? "#32E1BE" : "#E8EDEB" }}
          />
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleSubmit}
          disabled={digits.join("").length < 6 || attempts >= 3}
          className="w-full bg-[#073A30] hover:bg-[#0F5547] text-white font-semibold py-3"
        >
          Doğrula
        </Button>
        <Button variant="ghost" onClick={onBack} className="w-full text-[#6B7773]">
          Geri Dön
        </Button>
      </div>
    </div>
  )
}
