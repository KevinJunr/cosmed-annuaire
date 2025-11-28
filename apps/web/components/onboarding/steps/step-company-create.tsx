"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Info, Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { cn } from "@workspace/ui/lib/utils";
import { RequiredLabel, FlagIcon } from "@/components/ui";

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
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

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
            <RequiredLabel htmlFor="companyName" required>
              {t("companyName")}
            </RequiredLabel>
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

          {/* RCS with tooltip */}
          <div className="grid gap-2">
            <RequiredLabel htmlFor="rcs" required>
              {t("rcs")}
            </RequiredLabel>
            <TooltipProvider>
              <InputGroup
                className={cn(
                  (errors.rcs || rcsError) &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              >
                <InputGroupInput
                  id="rcs"
                  placeholder={t("rcsPlaceholder")}
                  {...register("rcs")}
                  onChange={(e) => {
                    register("rcs").onChange(e);
                    setRcsError(null);
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        className="rounded-full"
                        size="icon-xs"
                        aria-label={t("rcsTooltipLabel")}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-sm">{t("rcsTooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
            </TooltipProvider>
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

          {/* Country with searchable selector */}
          <div className="grid gap-2">
            <RequiredLabel htmlFor="country" required>
              {t("country")}
            </RequiredLabel>
            <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryPopoverOpen}
                  className={cn(
                    "w-full justify-between font-normal",
                    !watchCountry && "text-muted-foreground",
                    errors.countryId && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isLoadingData}
                >
                  {isLoadingData ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{tCommon("loading")}</span>
                    </div>
                  ) : watchCountry ? (
                    <div className="flex items-center gap-2">
                      <FlagIcon
                        countryCode={countries.find((c) => c.id === watchCountry)?.code || ""}
                        className="h-4 w-5 rounded-sm object-cover"
                      />
                      <span>
                        {getCountryName(
                          countries.find((c) => c.id === watchCountry) as Country
                        )}
                      </span>
                    </div>
                  ) : (
                    t("countryPlaceholder")
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder={t("countrySearchPlaceholder")} />
                  <CommandList>
                    <CommandEmpty>{t("countryNotFound")}</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.id}
                          value={getCountryName(country)}
                          onSelect={() => {
                            setValue("countryId", country.id, { shouldValidate: true });
                            setCountryPopoverOpen(false);
                          }}
                        >
                          <FlagIcon
                            countryCode={country.code}
                            className="mr-2 h-4 w-5 rounded-sm object-cover"
                          />
                          {getCountryName(country)}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              watchCountry === country.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.countryId && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.countryId.message}`)}
              </p>
            )}
          </div>

          {/* Address (optional) */}
          <div className="grid gap-2">
            <RequiredLabel htmlFor="address" optional optionalText={t("optional")}>
              {t("address")}
            </RequiredLabel>
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
