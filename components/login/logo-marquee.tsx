import Image from "next/image";
import { Marquee } from "./marquee";

export function LogoMarquee() {
  // Cukup masukin data asli sekali aja, sisanya di-handle komponen Marquee lu
  const logos = [
    { src: "/sicakra.png", alt: "PT Sinergi Cakra Buana" },
    { src: "/aqrapana.png", alt: "Sinyal Cepat" },
  ];

  return (
    <div className="w-full max-w-xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] py-4">
      
      {/* ⚡ Sekarang `--duration` lu dijamin aktif! Makin kecil angkanya makin ngebut (contoh: 12s atau 8s) */}
      <Marquee pauseOnHover className="[--duration:12s] [--gap:1rem]" repeat={4}>
        {logos.map((logo, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-center shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <Image 
              src={logo.src} 
              alt={logo.alt} 
              width={220}
              height={80} 
              className="object-contain h-25   w-auto" // Ukuran proporsional h-20 (80px)
              priority
            />
          </div>
        ))}
      </Marquee>

    </div>
  );
}