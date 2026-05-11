import Link from "next/link"
import { Sparkle } from "@/components/brand/Sparkle"
import { LogoFull } from "@/components/brand/LogoFull"
import { Footer } from "@/components/shared/Footer"
import { Button } from "@/components/ui/button"
import { Search, MapPin, MessageCircle, Shield, Zap, Users, CheckCircle2, X } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <LogoFull variant="light" size="md" />
          <div className="flex gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-white hover:text-[#32E1BE] hover:bg-white/10">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-semibold">
                Hemen Başla
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#073A30] min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Sparkle size={400} className="absolute -right-24 top-1/2 -translate-y-1/2 text-[#32E1BE] opacity-10" />
          <Sparkle size={100} className="absolute right-1/4 top-1/4 text-[#32E1BE] opacity-20" />
          <Sparkle size={60} className="absolute left-1/4 bottom-1/3 text-[#32E1BE] opacity-10" />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#32E1BE]/10 text-[#32E1BE] rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Sparkle size={14} className="text-[#32E1BE]" />
              Türkiye'nin İlk Topluluk Tabanlı Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Kaybettiğin her şey,{" "}
              <span className="text-[#32E1BE]">bir umutla</span>{" "}
              geri dönebilir.
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Bulalım, kayıp eşyaları buluntu ilanlarıyla eşleştiren topluluk destekli platformdur.
              Ücretsiz, kolay ve güvenli.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-bold text-base px-8">
                  Eşyanı Bulalım
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-base px-8 bg-transparent"
                >
                  Nasıl Çalışır?
                </Button>
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#32E1BE]" />
                <span>Tamamen ücretsiz</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#32E1BE]" />
                <span>TC kimlik doğrulamalı</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#32E1BE]" />
                <span>Harita tabanlı</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-4 w-72 rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm">😟</div>
                  <div>
                    <div className="font-semibold text-sm text-[#073A30]">Kayıp iPhone 15</div>
                    <div className="text-xs text-[#6B7773]">Kadıköy, Moda • 2 saat önce</div>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-1 font-medium">Kayıp</span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#F7F9F8] h-24 flex items-center justify-center text-[#6B7773] text-xs">
                  <MapPin className="w-4 h-4 mr-1" /> Harita konumu
                </div>
                <div className="mt-3">
                  <div className="bg-[#32E1BE] text-[#073A30] text-xs font-semibold rounded-lg py-2 text-center">
                    Mesaj Gönder
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#32E1BE] rounded-xl p-3 shadow-lg">
                <div className="text-[#073A30] text-xs font-bold">3 Olası Eşleşme!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-[#F7F9F8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#073A30] mb-4">Nasıl Çalışır?</h2>
            <p className="text-[#6B7773] max-w-xl mx-auto">
              Üç basit adımda eşyanı bul veya bulduğun eşyayı sahibiyle buluştur.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-8 h-8" />,
                step: "01",
                title: "İlan Ver",
                desc: "Kaybettiğin veya bulduğun eşyayı konum bilgisiyle birlikte birkaç saniyede paylaş.",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                step: "02",
                title: "Eşleştir",
                desc: "Sistem konum, kategori ve tarihe göre otomatik eşleşme önerir. Sen de haritadan arayabilirsin.",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                step: "03",
                title: "Bul",
                desc: "Mesajlaş, buluşma sağla ve eşyanı geri al. Her başarılı kavuşturma sana puan kazandırır.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#E8EDEB] hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#073A30] rounded-2xl flex items-center justify-center text-[#32E1BE] mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-[#32E1BE] text-sm font-bold mb-2">{item.step}</div>
                <h3 className="text-xl font-bold text-[#073A30] mb-3">{item.title}</h3>
                <p className="text-[#6B7773] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "%72", label: "Kullanıcı eşya kaybı yaşıyor", sub: "Her 3 kişiden 2'si" },
              { value: "%85", label: "Platform talep ediyor", sub: "Anket katılımcıları" },
              { value: "100+", label: "Topluluk üyesi", sub: "Beta döneminde" },
            ].map((stat) => (
              <div key={stat.label} className="p-8 rounded-2xl bg-[#F7F9F8] border border-[#E8EDEB]">
                <div className="text-4xl font-extrabold text-[#073A30] mb-2">{stat.value}</div>
                <div className="font-semibold text-[#073A30] mb-1">{stat.label}</div>
                <div className="text-sm text-[#6B7773]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-[#F7F9F8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#073A30] mb-4">Neden Bulalım?</h2>
            <p className="text-[#6B7773]">Diğer alternatiflerle karşılaştırma</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-sm border border-[#E8EDEB] overflow-hidden">
              <thead>
                <tr className="bg-[#073A30] text-white">
                  <th className="text-left px-6 py-4 font-semibold">Özellik</th>
                  <th className="px-6 py-4 font-semibold text-[#32E1BE]">Bulalım</th>
                  <th className="px-6 py-4 font-semibold text-white/70">AirTag</th>
                  <th className="px-6 py-4 font-semibold text-white/70">IETT</th>
                  <th className="px-6 py-4 font-semibold text-white/70">Nextdoor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDEB]">
                {[
                  ["Ücretsiz", true, false, true, true],
                  ["Konum tabanlı eşleşme", true, true, false, false],
                  ["Topluluk desteği", true, false, false, true],
                  ["TC kimlik doğrulama", true, false, false, false],
                  ["Otomatik eşleştirme", true, false, false, false],
                  ["Fotoğraf yükleme", true, false, false, true],
                  ["7/24 erişim", true, false, false, true],
                ].map((row) => {
                  const [feature, ...vals] = row
                  return (
                    <tr key={String(feature)} className="hover:bg-[#F7F9F8]">
                      <td className="px-6 py-4 font-medium text-[#073A30]">{feature}</td>
                      {(vals as boolean[]).map((val, i) => (
                        <td key={i} className="px-6 py-4 text-center">
                          {val ? (
                            <CheckCircle2 className="w-5 h-5 text-[#32E1BE] mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6" />, title: "Güvenilir", desc: "TC kimlik doğrulaması ile güvenli topluluk" },
              { icon: <Zap className="w-6 h-6" />, title: "Hızlı", desc: "Saniyeler içinde ilan oluştur ve yayınla" },
              { icon: <MapPin className="w-6 h-6" />, title: "Konum Tabanlı", desc: "Harita üzerinde yakınındaki ilanları gör" },
              { icon: <Users className="w-6 h-6" />, title: "Topluluk", desc: "Binlerce yardımsever kullanıcı" },
              { icon: <MessageCircle className="w-6 h-6" />, title: "Mesajlaşma", desc: "Güvenli ve anlık mesajlaşma" },
              { icon: <Sparkle className="w-6 h-6" />, title: "Gamification", desc: "Puan kazan, rozet topla, toplulukta öne çık" },
            ].map((feat) => (
              <div key={feat.title} className="flex gap-4 p-6 rounded-xl border border-[#E8EDEB] hover:border-[#32E1BE] hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-[#073A30] rounded-xl flex items-center justify-center text-[#32E1BE] flex-shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[#073A30] mb-1">{feat.title}</h3>
                  <p className="text-sm text-[#6B7773]">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#073A30]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Sparkle size={48} className="text-[#32E1BE] mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-white mb-4">Eşyanı birlikte bulalım</h2>
          <p className="text-white/70 mb-8 text-lg">
            Kayıp eşyan için umut, bulundu eşya için sahip. Hemen başla.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-[#32E1BE] hover:bg-[#1FC4A2] text-[#073A30] font-bold text-base px-10">
              Ücretsiz Kaydol
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
