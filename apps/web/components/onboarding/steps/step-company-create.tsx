"use client";

import { useTranslations } from "next-intl";
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
import { SECTORS } from "@/lib/constants/sectors";
import { COUNTRIES } from "@/lib/constants/countries";

export function StepCompanyCreate() {
  const t = useTranslations("onboarding.step5.pathB");
  const tCommon = useTranslations("onboarding.common");
  const tSectors = useTranslations("sectors");
  const tCountries = useTranslations("countries");
  const router = useRouter();
  const { state, setCompanyData, prevStep, setLoading, reset } = useOnboarding();

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
      sectorId: "",
      country: "",
      address: "",
      rcs: "",
      primaryPhone: "",
      primaryEmail: "",
      linkedinUrl: "",
    },
    mode: "onChange",
  });

  const watchSector = watch("sectorId");
  const watchCountry = watch("country");

  const onSubmit = async (data: CompanyCreateFormData) => {
    setLoading(true);
    setCompanyData(data);

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLoading(false);
    reset();
    router.push("/");
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

          {/* Sector */}
          <div className="grid gap-2">
            <Label htmlFor="sector">{t("sector")}</Label>
            <Select
              value={watchSector}
              onValueChange={(value) =>
                setValue("sectorId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  errors.sectorId &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder={t("sectorPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {tSectors(sector.nameKey.replace("sectors.", ""))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sectorId && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.sectorId.message}`)}
              </p>
            )}
          </div>

          {/* Country */}
          <div className="grid gap-2">
            <Label htmlFor="country">{t("country")}</Label>
            <Select
              value={watchCountry}
              onValueChange={(value) =>
                setValue("country", value, { shouldValidate: true })
              }
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  errors.country &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder={t("countryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {tCountries(country.nameKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.country.message}`)}
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

          {/* RCS */}
          <div className="grid gap-2">
            <Label htmlFor="rcs">
              {t("rcs")}{" "}
              <span className="text-muted-foreground">({t("optional")})</span>
            </Label>
            <Input
              id="rcs"
              placeholder={t("rcsPlaceholder")}
              {...register("rcs")}
            />
          </div>

          {/* Contact Info - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Phone */}
            <div className="grid gap-2">
              <Label htmlFor="primaryPhone">
                {t("primaryPhone")}{" "}
                <span className="text-muted-foreground">({t("optional")})</span>
              </Label>
              <Input
                id="primaryPhone"
                type="tel"
                placeholder={t("primaryPhonePlaceholder")}
                {...register("primaryPhone")}
                className={cn(
                  errors.primaryPhone &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.primaryPhone && (
                <p className="text-xs text-destructive">
                  {t(`errors.${errors.primaryPhone.message}`)}
                </p>
              )}
            </div>

            {/* Primary Email */}
            <div className="grid gap-2">
              <Label htmlFor="primaryEmail">
                {t("primaryEmail")}{" "}
                <span className="text-muted-foreground">({t("optional")})</span>
              </Label>
              <Input
                id="primaryEmail"
                type="email"
                placeholder={t("primaryEmailPlaceholder")}
                {...register("primaryEmail")}
                className={cn(
                  errors.primaryEmail &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.primaryEmail && (
                <p className="text-xs text-destructive">
                  {t(`errors.${errors.primaryEmail.message}`)}
                </p>
              )}
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="grid gap-2">
            <Label htmlFor="linkedinUrl">
              {t("linkedinUrl")}{" "}
              <span className="text-muted-foreground">({t("optional")})</span>
            </Label>
            <Input
              id="linkedinUrl"
              type="url"
              placeholder={t("linkedinUrlPlaceholder")}
              {...register("linkedinUrl")}
              className={cn(
                errors.linkedinUrl &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.linkedinUrl && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.linkedinUrl.message}`)}
              </p>
            )}
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
            disabled={!isValid || state.isLoading}
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
