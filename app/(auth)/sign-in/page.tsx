"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogoFull } from "@/components/brand/LogoFull"
import { PhoneStep } from "@/components/auth/PhoneStep"
import { SmsStep } from "@/components/auth/SmsStep"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [phone, setPhone] = useState("")

  function handlePhoneNext(phoneNum: string) {
    setPhone(phoneNum)
    setStep(1)
  }

  async function handleSmsNext() {
    const supabase = createClient()
    const email = `${phone.replace(/\s/g, "").replace("+", "")}@bulalim.app`

    const { data, error } = await supabase
      .from("profiles")
      .select("tc_kimlik_hash")
      .eq("phone", phone.replace(/\s/g, ""))
      .single()

    if (error || !data) {
      toast.error("Bu telefon numarasıyla kayıtlı hesap bulunamadı")
      return
    }

    const password = `${data.tc_kimlik_hash}_${phone.replace(/\s/g, "")}`
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      toast.error("Giriş başarısız")
      return
    }

    toast.success("Hoş geldin!")
    router.push("/feed")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col">
      <header className="p-4 border-b border-[#E8EDEB] bg-white">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/">
            <LogoFull size="sm" />
          </Link>
          <Link href="/sign-up" className="text-sm text-[#6B7773] hover:text-[#073A30]">
            Hesabın yok mu? <span className="text-[#073A30] font-semibold">Kayıt Ol</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8EDEB]">
            {step === 0 && <PhoneStep onNext={handlePhoneNext} />}
            {step === 1 && (
              <SmsStep phone={phone} onNext={handleSmsNext} onBack={() => setStep(0)} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
