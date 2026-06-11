import { ShieldCheck, MapPin, Clock, BadgeCheck, AlertTriangle, Navigation } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ChatMessage {
  from: "owner" | "other"
  text: string
  highlight?: boolean
}

// 4. görseldeki güvenli mesajlaşma + konum doğrulama akışının birebir demosu.
const OWNER = { name: "Zeynep Karagüz", initials: "ZK" }
const OTHER = { name: "Caner Şahin", initials: "CŞ" }
const OWNER_BADGES = ["Item Hunter", "Detective", "Helper"]

const MESSAGES: ChatMessage[] = [
  {
    from: "owner",
    text: "Caner Bey merhaba! Evet, bu ilan tam da o lokasyonda. Sistem doğrulaması ile ilanın sahibi olduğunuzu teyit ettim.",
  },
  {
    from: "owner",
    text: "Eşleşme sağlandı! Bu beni motive etti — 320 Puan kazandım 🎉",
    highlight: true,
  },
  {
    from: "other",
    text: "Merhaba, bu telefonun sahibi benim. Haritada tam olarak Beşiktaş İskelesi önünde düşürmüştüm. O zaman 'Kayıp' pini bırakmıştım.",
  },
  {
    from: "other",
    text: "Süper! 500m çapımda ara özelliğini kullanırken fark ettim. Çok hızlı oldu.",
  },
  {
    from: "owner",
    text: "Bulalım Konum Doğrulama ile buluşma noktası belirleyelim. Sistemin uyardığı gibi kamuya açık bir alan seçelim. Örn: İskele önündeki kafeterya?",
  },
]

export function ChatPanel() {
  return (
    <div className="flex h-[640px] flex-col overflow-hidden rounded-2xl border border-[#E8EDEB] bg-white shadow-sm">
      {/* Başlık — ilan sahibi profili */}
      <div className="bg-[#073A30] p-4 text-white">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-[#32E1BE]">
            <AvatarFallback className="bg-[#0F5547] text-sm font-semibold text-white">
              {OWNER.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-semibold">{OWNER.name}</span>
              <BadgeCheck className="h-4 w-4 flex-shrink-0 text-[#32E1BE]" />
            </div>
            <span className="text-xs text-[#5FEACB]">Verified User</span>
          </div>
        </div>
        <p className="mt-3 text-sm font-medium text-white/90">
          Tebrikler Zeynep! Bu eşyanın sahibi sensin 🎉
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {OWNER_BADGES.map((b) => (
            <span
              key={b}
              className="rounded-full bg-[#32E1BE]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#32E1BE]"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* İlan bağlamı */}
      <div className="flex items-center gap-3 border-b border-[#E8EDEB] bg-[#F7F9F8] px-4 py-2.5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#073A30] text-lg">
          📱
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#073A30]">
            Kadıköy — Telefon
            <span className="rounded bg-[#32E1BE]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#1FC4A2]">
              Bulundu
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-[#6B7773]">
            <Clock className="h-3 w-3" /> 12 dk önce
          </div>
        </div>
      </div>

      {/* Mesajlar */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {MESSAGES.map((msg, i) =>
          msg.from === "owner" ? (
            <div key={i} className="flex justify-end">
              <div
                className={`max-w-[80%] rounded-2xl rounded-br-md px-3.5 py-2 text-sm ${
                  msg.highlight
                    ? "bg-[#32E1BE] font-medium text-[#073A30]"
                    : "bg-[#073A30] text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-end gap-2">
              <Avatar className="h-7 w-7 flex-shrink-0">
                <AvatarFallback className="bg-[#E8EDEB] text-[10px] font-semibold text-[#073A30]">
                  {OTHER.initials}
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-[#F0F3F2] px-3.5 py-2 text-sm text-[#073A30]">
                {msg.text}
              </div>
            </div>
          )
        )}
      </div>

      {/* Güvenlik uyarısı */}
      <div className="flex items-start gap-2 border-t border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        <span>
          Güvenliğiniz için buluşma noktasını kamuya açık, kalabalık alanlardan seçiniz.
          Sistem <strong>Konum Doğrulama</strong> aktiftir.
        </span>
      </div>

      {/* Giriş alanı */}
      <div className="flex items-center gap-2 border-t border-[#E8EDEB] p-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#E8EDEB] bg-[#F7F9F8] px-3 py-2">
          <MapPin className="h-4 w-4 flex-shrink-0 text-[#32E1BE]" />
          <input
            type="text"
            placeholder="Konum Doğrulama ile mesaj yaz..."
            className="w-full bg-transparent text-sm text-[#073A30] placeholder:text-[#6B7773] focus:outline-none"
          />
        </div>
        <button
          type="button"
          className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-[#073A30] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0F5547]"
        >
          <Navigation className="h-3.5 w-3.5" />
          Konum Doğrul
        </button>
      </div>

      {/* Güvenli mesajlaşma rozeti */}
      <div className="flex items-center justify-center gap-1.5 border-t border-[#E8EDEB] bg-[#F7F9F8] py-1.5 text-[11px] text-[#6B7773]">
        <ShieldCheck className="h-3 w-3 text-[#32E1BE]" />
        Bulalım Güvenli Mesajlaşma
      </div>
    </div>
  )
}
