"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { LogoFull } from "@/components/brand/LogoFull"
import { PhoneStep } from "@/components/auth/PhoneStep"
import { SmsStep } from "@/components/auth/SmsStep"
import { TcKimlikStep } from "@/components/auth/TcKimlikStep"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ShieldCheck } from "lucide-react"
import type { ItemCategory } from "@/lib/types"
import { useT } from "@/components/i18n/LocaleProvider"

function SignInInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useT()
  const [step, setStep] = useState(0)
  const [phone, setPhone] = useState("")

  const intent = searchParams.get("intent") as "lost" | "found" | null
  const loc = searchParams.get("loc")
  const category = searchParams.get("category") as ItemCategory | null

  function handlePhoneNext(phoneNum: string) {
    setPhone(phoneNum)
    setStep(1)
  }

  // SMS doğrulandıktan sonra TC kimlik adımına geç (giriş de e-Devlet doğrulamalı).
  function handleSmsNext() {
    setStep(2)
  }

  async function handleTcSubmit(tc: string) {
    const supabase = createClient()
    const phoneDigits = phone.replace(/\s/g, "")
    const email = `${phoneDigits.replace("+", "")}@bulalim.app`
    const password = `${tc}_${phoneDigits}`

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    const isEn = t.language === "English"
    if (signInError) {
      toast.error(isEn ? "Incorrect phone or Turkish ID details" : "Telefon veya TC Kimlik bilgileri hatalı")
      return
    }

    toast.success(isEn ? "Welcome!" : "Hoş geldin!")
    // Ana sayfadaki switch'ten gelindiyse ilan verme akışına yönlendir.
    router.push(intent ? "/items/new" : "/feed")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9F8]">
      <header className="border-b border-[#E8EDEB] bg-white p-4">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Link href="/">
            <LogoFull size="sm" />
          </Link>
          <Link href="/sign-up" className="text-sm text-[#6B7773] hover:text-[#073A30]">
            {t.auth.noAccount} <span className="font-semibold text-[#073A30]">{t.auth.signUp}</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* e-Devlet trust banner */}
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#32E1BE]/30 bg-[#32E1BE]/10 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1FC4A2]" />
            <div className="text-sm">
              <p className="font-semibold text-[#073A30]">{t.auth.secureTitle}</p>
              <p className="mt-0.5 text-[#6B7773]">{t.auth.secureDesc}</p>
            </div>
          </div>

          {/* Intent context from landing switch */}
          {intent && (
            <div className="mb-4 rounded-2xl border border-[#E8EDEB] bg-white p-4 text-sm text-[#073A30]">
              <span className="font-semibold">
                {intent === "lost" ? t.auth.lostIntent : t.auth.foundIntent}
              </span>
              {category && t.categories[category] && <> · {t.categories[category]}</>}
              {loc && <> · {loc}</>}
              <p className="mt-1 text-xs text-[#6B7773]">{t.auth.continueNote}</p>
            </div>
          )}

          <div className="rounded-2xl border border-[#E8EDEB] bg-white p-8 shadow-sm">
            {step === 0 && <PhoneStep onNext={handlePhoneNext} />}
            {step === 1 && <SmsStep phone={phone} onNext={handleSmsNext} onBack={() => setStep(0)} />}
            {step === 2 && <TcKimlikStep onNext={handleTcSubmit} onBack={() => setStep(1)} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F9F8]" />}>
      <SignInInner />
    </Suspense>
  )
}
