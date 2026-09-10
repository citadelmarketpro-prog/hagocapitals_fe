import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <div className="min-h-screen flex bg-white">
 {/* ── Left — form panel ── */}
 <div className="flex-1 flex flex-col px-6 py-10 sm:px-10 lg:px-16 xl:px-24 overflow-y-auto">
 {/* Logo */}
 <Link href="/" className="flex items-center mb-10 shrink-0">
 <Image
 src="/logos/logo_one.png"
 alt="HagoCapitals"
 width={376}
 height={284}
 priority
 className="h-14 w-auto object-contain"
 />
 </Link>

 {/* Slot for page-specific form */}
 <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto">
 {children}
 </div>
 </div>

 {/* ── Right — decorative image panel (hidden on small screens) ──
 account_creation_green.jpg is a pre-blended duotone of the
 original chart texture, recolored into the site's brand green
 (#06811d) so it matches the rest of the site instead of the old
 lime-tinted original. ── */}
 <div className="hidden lg:block relative w-[48%] xl:w-[46%] shrink-0">
 <Image
 src="/account_creation_green.jpg"
 alt="HagoCapitals trading background"
 fill
 className="object-cover object-center"
 priority
 />
 {/* Dark overlay tint */}
 <div className="absolute inset-0 bg-black/15" />
 </div>
 </div>
 );
}
