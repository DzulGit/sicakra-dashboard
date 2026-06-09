import Image from "next/image";

export function LogoMarquee() {
  // Kita jejerin 4 item biar animasinya penuh dari ujung ke ujung layar
  const logos = [
    { src: "/sicakra.png", alt: "PT Sinergi Cakra Buana" },
    { src: "/sicakra.png", alt: "Sinyal Cepat" },
    { src: "/sicakra.png", alt: "PT Sinergi Cakra Buana" },
    { src: "/sicakra.png", alt: "Sinyal Cepat" },
  ];

  return (
    <div className="w-full flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-6">
      <div className="animate-marquee-custom flex min-w-full shrink-0 gap-16 items-center">
        
        {/* Render putaran pertama */}
        {logos.map((logo, idx) => (
          <div key={idx} className="flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
            <Image 
              src={logo.src} 
              alt={logo.alt} 
              width={200}
              height={45}
              className="object-contain h-[45px] w-auto" 
            />
          </div>
        ))}

        {/* Render putaran kedua untuk ilusi scrolling tanpa putus */}
        {logos.map((logo, idx) => (
          <div key={`dup-${idx}`} className="flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
            <Image 
              src={logo.src} 
              alt={logo.alt} 
              width={200}
              height={45}
              className="object-contain h-[45px] w-auto" 
            />
          </div>
        ))}

      </div>
    </div>
  );
}