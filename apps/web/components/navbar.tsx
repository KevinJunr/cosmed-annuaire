"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/providers/auth-provider";

interface MenuItem {
  titleKey: string
  url: string
  description?: string
  icon?: React.ReactNode
  items?: MenuItem[]
}

const logoAlt = "Cosmed Annuaire"

const publicMenu: MenuItem[] = [
  { titleKey: "home", url: "/" },
  { titleKey: "directory", url: "/annuaire" },
  { titleKey: "pricing", url: "/tarifs" },
  { titleKey: "contact", url: "/contact" },
]

const authenticatedMenu: MenuItem[] = [
  { titleKey: "home", url: "/home" },
  { titleKey: "dashboard", url: "/dashboard" },
  { titleKey: "company", url: "/entreprise" },
]

const defaultMobileExtraLinks = [
  { nameKey: "legalNotice", url: "/mentions-legales" },
  { nameKey: "terms", url: "/cgu" },
]

export function Navbar() {
  const t = useTranslations("nav");
  const { user, isLoading } = useAuth();

  const logoUrl = user ? "/home" : "/";
  const logoSrc = "/logo/logo.svg";
  const menu = user ? authenticatedMenu : publicMenu;
  const mobileExtraLinks = defaultMobileExtraLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <nav className="hidden h-14 items-center justify-between lg:flex">
          {/* Logo + Navigation */}
          <div className="flex items-center gap-6">
            <Link href={logoUrl} className="flex items-center">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={140}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => (
                    <NavMenuItem key={item.titleKey} item={item} t={t} />
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Language switcher + Auth button */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {isLoading ? (
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <UserMenu />
            ) : (
              <Button asChild size="sm">
                <Link href="/login">{t("login")}</Link>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex h-14 items-center justify-between lg:hidden">
          <Link href={logoUrl} className="flex items-center">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={120}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="compact" />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logoUrl} className="flex items-center">
                      <Image
                        src={logoSrc}
                        alt={logoAlt}
                        width={120}
                        height={28}
                        className="h-7 w-auto"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => (
                      <MobileNavMenuItem key={item.titleKey} item={item} t={t} />
                    ))}
                  </Accordion>
                  <div className="border-t py-4">
                    <div className="grid grid-cols-2 justify-start">
                      {mobileExtraLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={link.url}
                        >
                          {t(link.nameKey)}
                        </Link>
                      ))}
                    </div>
                  </div>
                  {isLoading ? (
                    <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                  ) : user ? (
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <UserMenu />
                    </div>
                  ) : (
                    <Button asChild>
                      <Link href="/login">{t("login")}</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavMenuItem({
  item,
  t,
}: {
  item: MenuItem
  t: (key: string) => string
}) {
  if (item.items) {
    return (
      <NavigationMenuItem className="text-muted-foreground">
        <NavigationMenuTrigger>{t(item.titleKey)}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.titleKey}>
                  <Link
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {t(subItem.titleKey)}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <Link
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {t(item.titleKey)}
    </Link>
  )
}

function MobileNavMenuItem({
  item,
  t,
}: {
  item: MenuItem
  t: (key: string) => string
}) {
  if (item.items) {
    return (
      <AccordionItem value={item.titleKey} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {t(item.titleKey)}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.titleKey}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{t(subItem.titleKey)}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <Link href={item.url} className="font-semibold">
      {t(item.titleKey)}
    </Link>
  )
}
