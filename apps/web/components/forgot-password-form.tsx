"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail } from "@/lib/validations";

type Step = "form" | "sent";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const t = useTranslations("auth.forgotPassword");
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const isValidInput = email && isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidInput) return;

    setIsLoading(true);

    try {
      // Always show success to prevent email enumeration
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setStep("sent");
    } catch {
      // Even on error, show success to prevent enumeration
      setStep("sent");
    } finally {
      setIsLoading(false);
    }
  };

  // Email sent confirmation
  if (step === "sent") {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t("sent.title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("sent.subtitle")}
          </p>
        </div>

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("sent.backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  // Main form
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

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            className={cn(
              email &&
                !isValidEmail(email) &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {email && !isValidEmail(email) && (
            <p className="text-xs text-destructive">{t("errors.invalidEmail")}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={!isValidInput || isLoading}>
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
        <Link
          href="/login"
          className="flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToLogin")}
        </Link>
      </div>
    </form>
  );
}
