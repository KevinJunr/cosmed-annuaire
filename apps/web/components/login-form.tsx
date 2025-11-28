"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Eye, EyeOff, Loader2, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { CountryCode } from "libphonenumber-js";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { cn } from "@workspace/ui/lib/utils";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail, formatPhoneForAuth, isValidPhone } from "@/lib/validations";
import { getProfileAction } from "@/lib/actions/profiles";
import { PhoneInput } from "@/components/ui";

type AuthMethod = "email" | "phone";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const t = useTranslations("auth.login");
  const tCountry = useTranslations("countrySelector");
  const currentLocale = useLocale();
  const router = useRouter();

  // Auth method state
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");

  // Email state
  const [email, setEmail] = useState("");

  // Phone state
  const [phone, setPhone] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("FR");

  // Password state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Validation
  const isEmailValid = email ? isValidEmail(email) : null;
  const isPhoneValidState = phone ? isValidPhone(phone, countryCode) : null;

  const canSubmit =
    (authMethod === "email" ? isEmailValid : isPhoneValidState) &&
    password.length > 0 &&
    !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (authMethod === "email") {
        if (!isValidEmail(email)) {
          setError(t("errors.invalidEmail"));
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setError(t("errors.invalidCredentials"));
          return;
        }
      } else {
        // Phone login
        if (!phoneE164) {
          setError(t("errors.invalidPhone"));
          return;
        }

        const formattedPhone = phoneE164 || formatPhoneForAuth(phone, countryCode);
        const { error } = await supabase.auth.signInWithPassword({
          phone: formattedPhone,
          password,
        });

        if (error) {
          setError(t("errors.invalidCredentials"));
          return;
        }
      }

      // Check user's preferred language and redirect accordingly
      const profileResult = await getProfileAction();
      const preferredLanguage = profileResult.profile?.preferredLanguage;

      if (preferredLanguage && preferredLanguage !== currentLocale) {
        // Redirect to home in user's preferred language
        window.location.href = `/${preferredLanguage}/home`;
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch {
      setError(t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (
    e164: string,
    national: string,
    country: CountryCode
  ) => {
    setPhone(national);
    setPhoneE164(e164);
    setCountryCode(country);
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Email/Phone Tabs */}
        <Tabs
          defaultValue="email"
          value={authMethod}
          onValueChange={(value: string) => setAuthMethod(value as AuthMethod)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              {t("tabs.email")}
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-2">
              <Phone className="h-4 w-4" />
              {t("tabs.phone")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email")}</Label>
              <InputGroup
                className={cn(
                  isEmailValid === false && "border-destructive"
                )}
              >
                <InputGroupAddon>
                  <Mail className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={authMethod === "email"}
                  autoComplete="email"
                />
              </InputGroup>
              {isEmailValid === false && (
                <p className="text-xs text-destructive">
                  {t("errors.invalidEmail")}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="phone" className="mt-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <PhoneInput
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                defaultCountry="FR"
                error={isPhoneValidState === false}
                countrySelectorLabels={{
                  placeholder: tCountry("placeholder"),
                  searchPlaceholder: tCountry("searchPlaceholder"),
                  noResultsText: tCountry("noResults"),
                }}
              />
              {isPhoneValidState === false && (
                <p className="text-xs text-destructive">
                  {t("errors.invalidPhone")}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Password */}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{t("password")}</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={!canSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </Button>
      </div>

      <div className="text-center text-sm">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="text-primary underline-offset-4 hover:underline font-medium"
        >
          {t("createAccount")}
        </Link>
      </div>
    </form>
  );
}
