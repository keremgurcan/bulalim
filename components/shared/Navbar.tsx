"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Languages, Search } from "lucide-react"
import { NavChatLink } from "@/components/shared/NavChatLink"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { useState } from "react"
import { useT, useLocale, setLocaleCookie } from "@/components/i18n/LocaleProvider"
import { LogoFull } from "@/components/brand/LogoFull"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"

interface NavbarProps {
  profile?: Profile | null
}

export function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useT().app.nav
  const locale = useLocale()

  const isActive = (path: string) => pathname === path

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E8EDEB]">
      <div className="relative max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href={profile ? "/feed" : "/"} className="flex-shrink-0">
          <LogoFull size="lg" />
        </Link>

        {profile && (
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <Link href="/items/new">
              <span className="rounded-full bg-[#32E1BE] px-7 py-2 text-base font-bold tracking-wide text-[#073A30] transition-colors hover:bg-[#1FC4A2]">
                {t.post}
              </span>
            </Link>
          </div>
        )}

        <nav className="hidden md:flex items-center gap-2">
          {profile ? (
            <>
              <Link href="/feed">
                <Button
                  variant={isActive("/feed") ? "default" : "ghost"}
                  size="sm"
                  className={isActive("/feed") ? "bg-[#073A30] text-white" : "text-[#073A30]"}
                >
                  {t.listings}
                </Button>
              </Link>
              <Link href="/map">
                <Button
                  variant={isActive("/map") ? "default" : "ghost"}
                  size="sm"
                  className={isActive("/map") ? "bg-[#073A30] text-white" : "text-[#073A30]"}
                >
                  {t.map}
                </Button>
              </Link>
              <Link
                href="/search"
                aria-label={t.search}
                className="p-2 rounded-lg hover:bg-[#F7F9F8] transition-colors"
              >
                <Search className="w-5 h-5 text-[#073A30]" />
              </Link>
              <button
                onClick={() => setLocaleCookie(locale === "en" ? "tr" : "en")}
                className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-[#073A30] hover:bg-[#F7F9F8] transition-colors"
                aria-label="Dil / Language"
              >
                <Languages className="w-4 h-4" /> {locale === "en" ? "EN" : "TR"}
              </button>
              <ThemeToggle />
              <NavChatLink userId={profile.id} label={t.messages} />

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="rounded-full ring-2 ring-[#E8EDEB] hover:ring-[#32E1BE] transition-all">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={profile.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-[#073A30] text-white text-xs">
                          {profile.full_name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem render={<Link href="/profile">{t.profile}</Link>} />
                  <DropdownMenuItem render={<Link href="/messages">{t.messages}</Link>} />
                  <DropdownMenuItem render={<Link href="/settings">{t.settings}</Link>} />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    {t.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <button
                onClick={() => setLocaleCookie(locale === "en" ? "tr" : "en")}
                className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-[#073A30] hover:bg-[#F7F9F8] transition-colors"
                aria-label="Dil / Language"
              >
                <Languages className="w-4 h-4" /> {locale === "en" ? "EN" : "TR"}
              </button>
              <ThemeToggle />
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-[#073A30]">
                  {t.signIn}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-[#073A30] hover:bg-[#0F5547] text-white">
                  {t.signUp}
                </Button>
              </Link>
            </>
          )}
        </nav>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#F7F9F8]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8EDEB] bg-white px-4 py-3 flex flex-col gap-2">
          {profile ? (
            <>
              <Link href="/feed" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">{t.listings}</Button>
              </Link>
              <Link href="/map" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">{t.map}</Button>
              </Link>
              <Link href="/search" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">
                  <Search className="w-4 h-4 mr-1" /> {t.search}
                </Button>
              </Link>
              <Link href="/messages" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">{t.messages}</Button>
              </Link>
              <Link href="/profile" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">{t.profile}</Button>
              </Link>
              <Link href="/items/new" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-semibold">
                  {t.post}
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setLocaleCookie(locale === "en" ? "tr" : "en")}
                className="w-full justify-start text-[#073A30]"
              >
                <Languages className="w-4 h-4 mr-1" /> {locale === "en" ? "English" : "Türkçe"}
              </Button>
              <ThemeToggle className="w-full justify-start flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[#073A30] hover:bg-[#F7F9F8] transition-colors" />
              <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-red-600">
                {t.signOut}
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">Giriş Yap</Button>
              </Link>
              <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-[#073A30] text-white">Kayıt Ol</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
