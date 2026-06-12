"use client"

import { createContext, useContext } from "react"
import { dictionaries, type Locale } from "@/lib/i18n"

const LocaleContext = createContext<Locale>("tr")

interface LocaleProviderProps {
  locale: Locale
  children: React.ReactNode
}

// İç sayfalardaki client bileşenlerin dili okuyabilmesi için sağlayıcı.
export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

// Aktif dilin sözlüğünü döndürür.
export function useT() {
  return dictionaries[useContext(LocaleContext)]
}

// Dili cookie'ye yazıp sayfayı yeniler (sunucu yeni dilde render etsin).
export function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000`
  window.location.reload()
}
