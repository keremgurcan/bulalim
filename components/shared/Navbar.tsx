"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Search, Menu, X } from "lucide-react"
import { useState } from "react"
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

  const isActive = (path: string) => pathname === path

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E8EDEB]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href={profile ? "/feed" : "/"} className="flex-shrink-0">
          <LogoFull size="md" />
        </Link>

        {profile && (
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7773] w-4 h-4" />
            <input
              type="search"
              placeholder="İlan ara..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E8EDEB] bg-[#F7F9F8] text-sm focus:outline-none focus:ring-2 focus:ring-[#32E1BE] focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value
                  router.push(`/feed?q=${encodeURIComponent(q)}`)
                }
              }}
            />
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
                  İlanlar
                </Button>
              </Link>
              <Link href="/map">
                <Button
                  variant={isActive("/map") ? "default" : "ghost"}
                  size="sm"
                  className={isActive("/map") ? "bg-[#073A30] text-white" : "text-[#073A30]"}
                >
                  Harita
                </Button>
              </Link>
              <Link href="/items/new">
                <Button size="sm" className="bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-semibold">
                  + İlan Ver
                </Button>
              </Link>

              <button className="relative p-2 rounded-lg hover:bg-[#F7F9F8] transition-colors">
                <Bell className="w-5 h-5 text-[#073A30]" />
              </button>

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
                  <DropdownMenuItem render={<Link href="/profile">Profilim</Link>} />
                  <DropdownMenuItem render={<Link href="/messages">Mesajlar</Link>} />
                  <DropdownMenuItem render={<Link href="/settings">Ayarlar</Link>} />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-[#073A30]">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-[#073A30] hover:bg-[#0F5547] text-white">
                  Kayıt Ol
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
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">İlanlar</Button>
              </Link>
              <Link href="/map" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">Harita</Button>
              </Link>
              <Link href="/messages" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">Mesajlar</Button>
              </Link>
              <Link href="/profile" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-[#073A30]">Profilim</Button>
              </Link>
              <Link href="/items/new" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-semibold">
                  + İlan Ver
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-red-600">
                Çıkış Yap
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
