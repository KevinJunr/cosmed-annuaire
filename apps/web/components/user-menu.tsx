"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import { getProfileAction } from "@/lib/actions/profiles";

interface ProfileData {
  firstName: string | null;
  lastName: string | null;
}

function getInitials(
  profile?: ProfileData | null,
  email?: string,
  phone?: string
): string {
  // First priority: use first and last name from profile
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  }
  if (profile?.firstName) {
    return profile.firstName.substring(0, 2).toUpperCase();
  }
  if (profile?.lastName) {
    return profile.lastName.substring(0, 2).toUpperCase();
  }

  // Fallback: use email or phone
  if (email) {
    const localPart = email.split("@")[0] ?? "";
    if (localPart.length >= 2) {
      return localPart.substring(0, 2).toUpperCase();
    }
    return localPart.charAt(0).toUpperCase() || "U";
  }
  if (phone) {
    return phone.slice(-2);
  }
  return "U";
}

export function UserMenu() {
  const t = useTranslations("auth.userMenu");
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // Fetch profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const result = await getProfileAction();
      if (result.success && result.profile) {
        setProfile({
          firstName: result.profile.firstName,
          lastName: result.profile.lastName,
        });
      }
    }
    fetchProfile();
  }, [user]);

  if (!user) return null;

  const initials = getInitials(profile, user.email, user.phone);
  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : user.email || user.phone || t("user");

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{t("account")}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {displayName}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>{t("profile")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50">
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("settings")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive hover:bg-muted/50 focus:bg-muted/50 focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
