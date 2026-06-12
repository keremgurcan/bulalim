import "server-only"
import { cookies } from "next/headers"
import { normalizeLocale, getDictionary, type Locale } from "./i18n"

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return normalizeLocale(cookieStore.get("locale")?.value)
}

export async function getServerDict() {
  return getDictionary(await getServerLocale())
}
