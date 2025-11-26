"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { validatePassword } from "@/lib/validations";
import { PasswordInput, PasswordRulesDisplay } from "@/components/ui";

type Step = "form" | "success" | "error";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const t = useTranslations("auth.resetPassword");
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const canSubmit = passwordValidation.isValid && passwordsMatch && !isLoading;

  // Check if user has a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStep("error");
      }
    };
    checkSession();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setStep("success");

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch {
      setError(t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  // Error state - invalid or expired link
  if (step === "error") {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold">{t("error.title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("error.subtitle")}
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/forgot-password">{t("error.tryAgain")}</Link>
        </Button>
      </div>
    );
  }

  // Success state
  if (step === "success") {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">{t("success.title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("success.subtitle")}
          </p>
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

      <div className="grid gap-5">
        {/* Password */}
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            {t("password")}
          </label>
          <PasswordInput
            id="password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
          />
          <PasswordRulesDisplay
            rules={passwordValidation.rules}
            labels={{
              minLength: t("passwordRules.minLength"),
              uppercase: t("passwordRules.uppercase"),
              specialChar: t("passwordRules.specialChar"),
              number: t("passwordRules.number"),
            }}
            className="mt-1"
          />
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            {t("confirmPassword")}
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder={t("confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
            className={cn(
              confirmPassword &&
                !passwordsMatch &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-destructive">
              {t("errors.passwordMismatch")}
            </p>
          )}
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
    </form>
  );
}
