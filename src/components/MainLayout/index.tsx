"use client";
import { Footer } from "@/components/MainLayout/Footer";
import { RecruitmentBanner } from "@/components/RecruitmentBanner";
import BuildCanadaBanner from "@/components/BuildCanadaBanner";
import { useLingui } from "@lingui/react/macro";
import Image from "next/image";
import Link from "next/link";
import logoFull from "./logo-full.svg";
import { useState } from "react";
import { usePathname } from "next/navigation";

import DesktopNav from "./_components/DesktopNav";
import { MobileMenu, MobileMenuButton } from "./_components/MobileMenu";

export const MainLayout = ({
  children,
  provinces,
  municipalitiesByProvince,
}: {
  children: React.ReactNode;
  provinces: string[];
  municipalitiesByProvince: Array<{
    province: string;
    municipalities: Array<{ slug: string; name: string }>;
  }>;
}) => {
  const { i18n } = useLingui();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <RecruitmentBanner />
      <div className="sticky z-100 border-b-border border-b-2 w-full border-solid px-4 sm:px-12 py-0">
        <div className="w-full max-w-6xl mx-auto">
          <div className="items-stretch auto-cols-fr justify-between flex min-h-16 gap-2 sm:gap-8 m-auto">
            <Link
              className="items-center justify-start flex pl-0"
              href={`/${i18n.locale}`}
            >
              <Image
                className="cursor-pointer align-middle w-40 h-12 max-w-full"
                alt="Canada Spends Logo"
                src={logoFull}
              />
            </Link>
            {/* Desktop Navigation */}
            <DesktopNav
              pathname={pathname}
              provinces={provinces}
              municipalitiesByProvince={municipalitiesByProvince}
            />
            {/* Mobile menu button */}
            <MobileMenuButton
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          </div>
        </div>
      </div>
      <BuildCanadaBanner />
      {/* Mobile menu */}
      {isMenuOpen && (
        <MobileMenu
          pathname={pathname}
          setIsMenuOpen={setIsMenuOpen}
          provinces={provinces}
          municipalitiesByProvince={municipalitiesByProvince}
        />
      )}
      <div>
        <div className="min-h-full items-center flex-col justify-between overflow-clip bg-background text-foreground">
          <div className="w-full max-w-480 m-auto">
            <main>{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// interface NavLinkProps {
//   href: string;
//   children: React.ReactNode;
//   active?: boolean;
//   onClick?: () => void;
// }

// // Memoize MobileNavLink
// const MobileNavLink = memo(
//   ({ href, children, active = false, onClick }: NavLinkProps) => {
//     return (
//       <Link
//         href={href}
//         className={`block px-3 py-2 text-base font-medium ${active ? "text-black" : "text-gray-600 hover:text-black"}`}
//         onClick={onClick}
//       >
//         {children}
//       </Link>
//     );
//   },
// );
// MobileNavLink.displayName = "MobileNavLink"; // Add display name

// // Memoize NavLink
// const NavLink = memo(
//   ({
//     href,
//     children,
//     active = false,
//   }: {
//     href: string;
//     children: React.ReactNode;
//     active?: boolean;
//   }) => {
//     return (
//       <Link
//         href={href}
//         className={`relative py-2 text-sm font-medium ${
//           active
//             ? "text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-foreground"
//             : "text-muted-foreground hover:text-foreground"
//         }`}
//       >
//         {children}
//       </Link>
//     );
//   },
// );
// NavLink.displayName = "NavLink"; // Add display name for better debugging
