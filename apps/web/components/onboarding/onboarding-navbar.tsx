"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserMenu } from "@/components/user-menu";

export function OnboardingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <nav className="flex h-14 items-center justify-between">
          <Link href="/onboarding" className="flex items-center">
            <Image
              src="/logo/logo.svg"
              alt="Cosmed Annuaire"
              width={140}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}
