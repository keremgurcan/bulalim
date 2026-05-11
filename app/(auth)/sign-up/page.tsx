"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogoFull } from "@/components/brand/LogoFull"
import { PhoneStep } from "@/components/auth/PhoneStep"
import { SmsStep } from "@/components/auth/SmsStep"
import { TcKimlikStep } from "@/components/auth/TcKimlikStep"
import { ProfileStep } from "@/components/auth/ProfileStep"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const STEPS = ["Telefon", "SMS Kodu", "TC Kimlik", "Profil"]

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [phone, setPhone] = useState("")
  const [tc, setTc] = useState("")

  function handlePhoneNext(phoneNum: string) {
    setPhone(phoneNum)
    setStep(1)
  }

  function handleSmsNext() {
    setStep(2)
  }

  function handleTcNext(tcNum: string) {
    setTc(tcNum)
    setStep(3)
  }

  async function handleProfileSubmit(data: {
    full_name: string
    username: string
    city: string
    bio?: string
  }) {
    const supabase = createClient()

    const email = `${phone.replace(/\s/g, "").replace("+", "")}@bulalim.app`
    const password = `${tc}_${phone.replace(/\s/g, "")}`

    // Try sign up first, fall back to sign in if user already exists
    let userId: string | null = null

    const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      // User already registered — try signing in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError || !signInData.user) {
        toast.error("Bu telefon numarası zaten kayıtlı. Giriş yapmayı dene.")
        return
      }
      userId = signInData.user.id
    } else if (!authData.user) {
      toast.error("Kayıt sırasında bir hata oluştu")
      return
    } else {
      userId = authData.user.id
    }

    // Check if profile already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single()

    if (existing) {
      // Profile exists, just sign in and redirect
      toast.success("Hoş geldin tekrar!")
      router.push("/feed")
      router.refresh()
      return
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      phone: phone.replace(/\s/g, ""),
      tc_kimlik_hash: tc,
      full_name: data.full_name,
      username: data.username,
      city: data.city,
      bio: data.bio ?? null,
      is_verified: true,
      rank: "Yeni Üye",
      points: 0,
    })

    if (profileError) {
      if (profileError.message.includes("username")) {
        toast.error("Bu kullanıcı adı zaten alınmış, başka bir tane dene")
      } else if (profileError.message.includes("phone")) {
        toast.error("Bu telefon numarası zaten kayıtlı")
      } else {
        toast.error("Profil oluşturulurken hata: " + profileError.message)
      }
      return
    }

    toast.success("Hoş geldin! Profilin oluşturuldu.")
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
          <Link href="/sign-in" className="text-sm text-[#6B7773] hover:text-[#073A30]">
            Zaten üye misin? <span className="text-[#073A30] font-semibold">Giriş Yap</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i < step
                        ? "bg-[#32E1BE] text-[#073A30]"
                        : i === step
                        ? "bg-[#073A30] text-white"
                        : "bg-[#E8EDEB] text-[#6B7773]"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-12 sm:w-20 transition-colors ${
                        i < step ? "bg-[#32E1BE]" : "bg-[#E8EDEB]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-[#6B7773]">
              {STEPS.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8EDEB]">
            {step === 0 && <PhoneStep onNext={handlePhoneNext} />}
            {step === 1 && <SmsStep phone={phone} onNext={handleSmsNext} onBack={() => setStep(0)} />}
            {step === 2 && <TcKimlikStep onNext={handleTcNext} onBack={() => setStep(1)} />}
            {step === 3 && <ProfileStep onSubmit={handleProfileSubmit} onBack={() => setStep(2)} />}
          </div>
        </div>
      </div>
    </div>
  )
}
