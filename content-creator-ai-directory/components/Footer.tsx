import Link from "next/link";
import MandalaLogo from "@/components/MandalaLogo";
import { CircuitGrid } from "@/components/CircuitGrid";

const NAV_LINKS = [
  { label: "Home",          href: "/" },
  { label: "All Tools",     href: "/#tools" },
  { label: "Submit a Tool", href: "/submit-tool" },
  { label: "About",         href: "/about" },
];

const CATEGORY_LINKS = [
  { label: "Video",        href: "/?category=Video" },
  { label: "Audio",        href: "/?category=Audio" },
  { label: "Copywriting",  href: "/?category=Copywriting" },
  { label: "Image",        href: "/?category=Image" },
  { label: "Podcast",      href: "/?role=podcast" },
  { label: "Analytics",    href: "/?role=analytics" },
  { label: "Social Media", href: "/?role=social+media" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookies",        href: "/cookies" },
  { label: "Terms",          href: "/terms" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3
        className="mb-3 pb-2 text-xs font-semibold uppercase tracking-widest"
        style={{
          color: "rgba(0,245,212,0.8)",
          borderBottom: "1px solid rgba(0,255,200,0.2)",
          display: "inline-block",
        }}
      >
        {title}
      </h3>
      <ul className="mt-1 space-y-2.5">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-white/50 transition-colors duration-200 hover:text-[var(--teal-bright)]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      className="relative mt-auto w-full overflow-hidden bg-black"
      style={{
        borderTop: "1px solid rgba(0,255,200,0.2)",
        boxShadow: "0 -1px 20px rgba(0,255,200,0.08)",
        background:
          "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(0,255,200,0.03) 0%, transparent 70%), #000000",
      }}
    >
      {/* Circuit grid — subtle footer variant */}
      <CircuitGrid
        ellipseRx={0.38}
        fadeZone={120}
        lineOpacity={0.07}
        dotOpacity={0.38}
        dotBlur={4}
        dotGlowOpacity={0.4}
        dotFrequency={4}
        vFadeTop={0.20}
        vFadeBottom={0.65}
      />

      <div className="relative z-10 container mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8">

        {/* Brand header — centered above columns */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90">
            <MandalaLogo size={44} />
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{
                background: "linear-gradient(90deg, #ffffff, var(--teal-bright))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI Tools Directory
            </span>
          </Link>
          <p className="max-w-[320px] text-center text-xs leading-relaxed text-white/50">
            Discover and compare the best AI tools for content creators — updated daily.
          </p>
        </div>

        {/* Divider */}
        <div
          className="mb-10 h-px w-full"
          style={{ background: "rgba(0,245,212,0.12)" }}
        />

        {/* Three columns */}
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3">
          <FooterColumn title="Navigation"  links={NAV_LINKS} />
          <FooterColumn title="Categories"  links={CATEGORY_LINKS} />
          <FooterColumn title="Legal"       links={LEGAL_LINKS} />
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AI Tools Directory. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: "rgba(0,245,212,0.6)" }}
          >
            Built for content creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
