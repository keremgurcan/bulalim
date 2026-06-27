"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Loader2, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useT } from "@/components/i18n/LocaleProvider"

interface SearchClientProps {
  currentUserId: string | null
}

interface ProfileResult {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  city: string | null
  rank: string
  is_verified: boolean
}

const MIN_CHARS = 2

export function SearchClient({ currentUserId }: SearchClientProps) {
  const t = useT().app.userSearch
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProfileResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const term = query.trim()
    if (term.length < MIN_CHARS) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    const handle = setTimeout(async () => {
      const supabase = createClient()
      // PostgREST .or() filtresini bozabilecek karakterleri temizle.
      const safe = term.replace(/[%,()]/g, " ").trim()
      let q = supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, city, rank, is_verified")
        .or(`full_name.ilike.%${safe}%,username.ilike.%${safe}%`)
        .limit(20)
      if (currentUserId) q = q.neq("id", currentUserId)

      const { data } = await q
      setResults((data as ProfileResult[]) ?? [])
      setLoading(false)
      setSearched(true)
    }, 300)

    return () => clearTimeout(handle)
  }, [query, currentUserId])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#073A30]">{t.title}</h1>
      <p className="mt-1 text-sm text-[#6B7773]">{t.subtitle}</p>

      <div className="relative mt-5">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7773]" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          className="w-full rounded-2xl border border-[#E8EDEB] bg-white py-3.5 pl-12 pr-12 text-[#073A30] placeholder:text-[#9aa8a4] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#32E1BE]"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-[#32E1BE]" />
        )}
      </div>

      <div className="mt-6">
        {query.trim().length < MIN_CHARS ? (
          <p className="py-10 text-center text-sm text-[#9aa8a4]">{t.hint}</p>
        ) : searched && results.length === 0 && !loading ? (
          <p className="py-10 text-center text-sm text-[#6B7773]">{t.empty}</p>
        ) : (
          <ul className="space-y-2">
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/profile/${p.username}`}
                  className="flex items-center gap-3 rounded-2xl border border-[#E8EDEB] bg-white p-3 transition-colors hover:border-[#32E1BE] hover:bg-[#F7F9F8]"
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={p.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-[#073A30] text-white">
                      {p.full_name?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold text-[#073A30]">{p.full_name}</span>
                      {p.is_verified && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#32E1BE]" />}
                    </div>
                    <p className="truncate text-xs text-[#6B7773]">
                      @{p.username}
                      {p.city ? ` · ${p.city}` : ""}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
