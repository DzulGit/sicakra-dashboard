"use client"

import { BoltLogo } from "./bolt-logo"
import { LeapLogo } from "./leap-logo"
import { LovableLogo } from "./lovable-logo"
import { OrchidsLogo } from "./orchids-logo"
import { ReplitLogo } from "./replit-logo"
import { StripeLogo } from "./stripe-logo"
import { V0Logo } from "./v0-logo"

interface Logo {
  alt: string
  href: string
  component: React.ComponentType<{ className?: string }>
  height: string
}

const logos: Logo[] = [
  { alt: "Leap", href: "https://leap.new", component: LeapLogo, height: "h-5" },
  { alt: "Orchids", href: "https://orchids.app", component: OrchidsLogo, height: "h-10" },
  { alt: "v0", href: "https://v0.app", component: V0Logo, height: "h-6" },
  { alt: "Replit", href: "https://replit.com", component: ReplitLogo, height: "h-24" },
  { alt: "Bolt", href: "https://bolt.new", component: BoltLogo, height: "h-24" },
  { alt: "Stripe", href: "https://stripe.com", component: StripeLogo, height: "h-8" },
  { alt: "Lovable", href: "https://lovable.dev", component: LovableLogo, height: "h-6" },
]

export function LogoMarquee() {
  return (
    <div className="relative w-full">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="overflow-hidden">
        <div className="animate-scroll-left flex items-center gap-6">
          {logos.concat(logos).map((logo, index) => (
            <a
              key={index}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity opacity-60 flex items-center"
            >
              <logo.component className={`${logo.height} w-auto text-foreground`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
