"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import {
  companyCreateSchema,
  type CompanyCreateFormData,
} from "@/lib/validations/onboarding";
import { getCountriesAction } from "@/lib/actions/reference-data";
import { checkRcsUniqueAction } from "@/lib/actions/companies";
import type { Country } from "@/types";

export function StepCompanyCreate() {
  const t = useTranslations("onboarding.step3.pathB");
  const tCommon = useTranslations("onboarding.common");
  const locale = useLocale();
  const router = useRouter();
  const { state, prevStep, complete } = useOnboarding();

  // Use Intl.DisplayNames for automatic country name translation
  const countryDisplayNames = useMemo(
    () => new Intl.DisplayNames([locale], { type: "region" }),
    [locale]
  );

  // Countries from Supabase
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [rcsError, setRcsError] = useState<string | null>(null);

  // Load countries
  useEffect(() => {
    async function loadCountries() {
      setIsLoadingData(true);
      try {
        const result = await getCountriesAction();
        if (result.success && result.countries) {
          setCountries(result.countries);
        }
      } catch (error) {
        console.error("Error loading countries:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadCountries();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CompanyCreateFormData>({
    resolver: zodResolver(companyCreateSchema),
    defaultValues: state.data.newCompanyData ?? {
      companyName: "",
      countryId: "",
      address: "",
      rcs: "",
    },
    mode: "onChange",
  });

  const watchCountry = watch("countryId");

  const onSubmit = async (data: CompanyCreateFormData) => {
    // Reset RCS error
    setRcsError(null);

    // Check RCS uniqueness first
    const rcsCheck = await checkRcsUniqueAction(data.rcs);
    if (!rcsCheck.success || !rcsCheck.isUnique) {
      setRcsError("alreadyExists");
      return;
    }

    // Pass all data directly to complete() to avoid async state issues
    // Also pass locale to save preferred_language in profile
    const success = await complete({
      companyChoice: "new",
      newCompanyData: {
        companyName: data.companyName,
        countryId: data.countryId,
        address: data.address,
        rcs: data.rcs,
      },
    }, locale);

    if (success) {
      router.push("/home");
    }
  };

  // Helper to get translated country name using Intl.DisplayNames
  const getCountryName = (country: Country) => {
    // Use the ISO code directly for Intl.DisplayNames
    try {
      return countryDisplayNames.of(country.code) || country.code;
    } catch {
      return country.code;
    }
  };

  return (
    <StepContainer className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-4">
          {/* Company Name */}
          <div className="grid gap-2">
            <Label htmlFor="companyName">{t("companyName")}</Label>
            <Input
              id="companyName"
              placeholder={t("companyNamePlaceholder")}
              {...register("companyName")}
              className={cn(
                errors.companyName &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.companyName.message}`)}
              </p>
            )}
          </div>

          {/* RCS */}
          <div className="grid gap-2">
            <Label htmlFor="rcs">{t("rcs")}</Label>
            <Input
              id="rcs"
              placeholder={t("rcsPlaceholder")}
              {...register("rcs")}
              className={cn(
                (errors.rcs || rcsError) &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              onChange={(e) => {
                register("rcs").onChange(e);
                setRcsError(null);
              }}
            />
            {errors.rcs && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.rcs.message}`)}
              </p>
            )}
            {rcsError && !errors.rcs && (
              <p className="text-xs text-destructive">
                {t(`errors.${rcsError}`)}
              </p>
            )}
          </div>

          {/* Country */}
          <div className="grid gap-2">
            <Label htmlFor="country">{t("country")}</Label>
            <Select
              value={watchCountry}
              onValueChange={(value) =>
                setValue("countryId", value, { shouldValidate: true })
              }
              disabled={isLoadingData}
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  errors.countryId &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              >
                {isLoadingData ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">{tCommon("loading")}</span>
                  </div>
                ) : (
                  <SelectValue placeholder={t("countryPlaceholder")} />
                )}
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {getCountryName(country)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.countryId && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.countryId.message}`)}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="grid gap-2">
            <Label htmlFor="address">
              {t("address")}{" "}
              <span className="text-muted-foreground">({t("optional")})</span>
            </Label>
            <Input
              id="address"
              placeholder={t("addressPlaceholder")}
              {...register("address")}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tCommon("back")}
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!isValid || state.isLoading || isLoadingData}
          >
            {state.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon("finishing")}
              </>
            ) : (
              tCommon("finish")
            )}
          </Button>
        </div>
      </form>
    </StepContainer>
  );
}
