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
      {/* Arka parıltı */}
      <div className="absolute -inset-6 rounded-[3rem] bg-[#32E1BE]/25 blur-3xl" aria-hidden="true" />

      <div className="relative w-[250px] rounded-[2.6rem] border-[10px] border-[#0c2f28] bg-[#0c2f28] shadow-2xl">
        {/* Çentik */}
        <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#0c2f28]" aria-hidden="true" />

        {/* Ekran */}
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] bg-[#cfeee6]">
          <Image
            src="/hero-city.png"
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
