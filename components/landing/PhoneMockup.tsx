import Image from "next/image"

interface PhoneMockupProps {
  className?: string
}

/**
 * Hero'nun sağ tarafında duran dekoratif telefon çerçevesi.
 * Ekranında şehir/eşya illüstrasyonu gösterir — uygulamanın "haritada eşya"
 * deneyimini temsil eder. Tamamen CSS ile çizilir (ek görsel dosyası gerekmez).
 */
export function PhoneMockup({ className = "" }: PhoneMockupProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative w-[250px] rounded-[2.6rem] border-[10px] border-[#0c2f28] bg-[#0c2f28] shadow-2xl">
        {/* Çentik */}
        <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#0c2f28]" aria-hidden="true" />

        {/* Ekran */}
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] bg-[#e3f3ee]">
          <Image
            src="/hero-city-soft.png"
            alt="Bulalım uygulamasında haritada işaretlenmiş kayıp eşyalar"
            fill
            sizes="250px"
            className="object-cover object-center"
            priority
          />
          {/* Üstte ince durum çubuğu hissi */}
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/10 to-transparent" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
