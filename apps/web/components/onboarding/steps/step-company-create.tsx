"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Info, Check, ChevronsUpDown, Building2 } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@workspace/ui/components/item";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import { RequiredLabel, FlagIcon } from "@/components/ui";

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import {
  companyCreateSchema,
  type CompanyCreateFormData,
  type LegalIdType,
} from "@/lib/validations/onboarding";
import { getCountriesAction } from "@/lib/actions/reference-data";
import { checkLegalIdUniqueAction } from "@/lib/actions/companies";
import type { Country } from "@/types";
import type { CompanyWithCountry } from "@/lib/repositories";

// France country code
const FRANCE_CODE = "FR";

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
  const [legalIdError, setLegalIdError] = useState<string | null>(null);
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

  // Dialog state for existing company
  const [existingCompany, setExistingCompany] = useState<CompanyWithCountry | null>(null);
  const [showExistingCompanyDialog, setShowExistingCompanyDialog] = useState(false);
  const [isJoiningCompany, setIsJoiningCompany] = useState(false);

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
      countryId: "",
      companyName: "",
      legalIdType: "DUNS",
      legalId: "",
      address: "",
    },
    mode: "onChange",
  });

  const watchCountry = watch("countryId");
  const watchLegalIdType = watch("legalIdType");
  const watchLegalId = watch("legalId");

  // Check if selected country is France
  const selectedCountry = countries.find((c) => c.id === watchCountry);
  const isFrance = selectedCountry?.code === FRANCE_CODE;

  // Reset legal ID type to DUNS when country changes (if not France)
  useEffect(() => {
    if (!isFrance && watchLegalIdType === "SIREN") {
      setValue("legalIdType", "DUNS", { shouldValidate: true });
    }
  }, [isFrance, watchLegalIdType, setValue]);

  const onSubmit = async (data: CompanyCreateFormData) => {
    // Reset error
    setLegalIdError(null);

    // Check legal ID uniqueness
    const legalIdCheck = await checkLegalIdUniqueAction(data.legalId);

    if (!legalIdCheck.success) {
      setLegalIdError("alreadyExists");
      return;
    }

    // If not unique, show the existing company in a dialog
    if (!legalIdCheck.isUnique && legalIdCheck.existingCompany) {
      setExistingCompany(legalIdCheck.existingCompany);
      setShowExistingCompanyDialog(true);
      return;
    }

    // Pass all data directly to complete()
    const success = await complete({
      companyChoice: "new",
      newCompanyData: {
        countryId: data.countryId,
        companyName: data.companyName,
        legalIdType: data.legalIdType,
        legalId: data.legalId,
        address: data.address,
      },
    }, locale);

    if (success) {
      router.push("/home");
    }
  };

  // Handle joining the existing company
  const handleJoinExistingCompany = async () => {
    if (!existingCompany) return;

    setIsJoiningCompany(true);

    const success = await complete({
      companyChoice: "existing",
      selectedCompanyId: existingCompany.id,
    }, locale);

    if (success) {
      router.push("/home");
    } else {
      setIsJoiningCompany(false);
    }
  };

  // Helper to get translated country name using Intl.DisplayNames
  const getCountryName = (country: Country) => {
    try {
      return countryDisplayNames.of(country.code) || country.code;
    } catch {
      return country.code;
    }
  };

  // Helper to get country name from code
  const getCountryNameFromCode = (code: string) => {
    try {
      return countryDisplayNames.of(code) || code;
    } catch {
      return code;
    }
  };

  // Handle legal ID type change
  const handleLegalIdTypeChange = (value: string) => {
    setValue("legalIdType", value as LegalIdType, { shouldValidate: true });
    // Clear legal ID when switching type
    setValue("legalId", "", { shouldValidate: false });
    setLegalIdError(null);
  };

  return (
    <>
      <StepContainer className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-balance text-sm text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid gap-4">
            {/* Country with searchable selector - FIRST */}
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
                          countryCode={selectedCountry?.code || ""}
                          className="h-4 w-5 rounded-sm object-cover"
                        />
                        <span>
                          {selectedCountry ? getCountryName(selectedCountry) : ""}
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

            {/* Legal ID (DUNS / SIREN) */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <RequiredLabel htmlFor="legalId" required>
                  {t("legalId")}
                </RequiredLabel>
                {/* Show tabs only for France */}
                {isFrance && (
                  <Tabs
                    value={watchLegalIdType}
                    onValueChange={handleLegalIdTypeChange}
                    className="h-7"
                  >
                    <TabsList className="h-7 p-0.5">
                      <TabsTrigger value="DUNS" className="h-6 px-2 text-xs">
                        DUNS
                      </TabsTrigger>
                      <TabsTrigger value="SIREN" className="h-6 px-2 text-xs">
                        SIREN
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
              <TooltipProvider>
                <InputGroup
                  className={cn(
                    (errors.legalId || legalIdError) &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                >
                  <InputGroupInput
                    id="legalId"
                    placeholder={t(`legalIdPlaceholder.${watchLegalIdType}`)}
                    maxLength={9}
                    {...register("legalId")}
                    onChange={(e) => {
                      // Only allow digits
                      const value = e.target.value.replace(/\D/g, "");
                      e.target.value = value;
                      register("legalId").onChange(e);
                      setLegalIdError(null);
                    }}
                  />
                  <InputGroupAddon align="inline-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          className="rounded-full"
                          size="icon-xs"
                          aria-label={t("legalIdTooltipLabel")}
                        >
                          <Info className="h-3.5 w-3.5" />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">
                          {t.rich(`legalIdTooltip.${watchLegalIdType}`, {
                            link: (chunks) => (
                              <a
                                href="https://www.dnb.com/duns-number.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline font-medium hover:text-primary-foreground/80"
                              >
                                {chunks}
                              </a>
                            ),
                          })}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroup>
              </TooltipProvider>
              {/* Character count */}
              <div className="flex justify-between items-center">
                {errors.legalId ? (
                  <p className="text-xs text-destructive">
                    {t(`errors.${errors.legalId.message}`)}
                  </p>
                ) : legalIdError ? (
                  <p className="text-xs text-destructive">
                    {t(`errors.${legalIdError}`)}
                  </p>
                ) : (
                  <span />
                )}
                <span className={cn(
                  "text-xs",
                  watchLegalId?.length === 9 ? "text-green-600" : "text-muted-foreground"
                )}>
                  {watchLegalId?.length || 0}/9
                </span>
              </div>
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

      {/* Dialog for existing company */}
      <Dialog open={showExistingCompanyDialog} onOpenChange={setShowExistingCompanyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("existingCompanyDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("existingCompanyDialog.description")}
            </DialogDescription>
          </DialogHeader>

          {existingCompany && (
            <Item variant="outline" className="my-2">
              <ItemMedia className="size-10 rounded-full bg-primary/10">
                <Building2 className="size-5 text-primary" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{existingCompany.name}</ItemTitle>
                <ItemDescription className="flex flex-col gap-0.5">
                  {existingCompany.legal_id && (
                    <span>
                      {existingCompany.legal_id_type || "ID"}: {existingCompany.legal_id}
                    </span>
                  )}
                  {existingCompany.country && (
                    <span className="flex items-center gap-1.5">
                      <FlagIcon
                        countryCode={existingCompany.country.code}
                        className="h-3 w-4 rounded-sm object-cover"
                      />
                      {getCountryNameFromCode(existingCompany.country.code)}
                    </span>
                  )}
                  {existingCompany.address && (
                    <span>{existingCompany.address}</span>
                  )}
                </ItemDescription>
              </ItemContent>
            </Item>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExistingCompanyDialog(false)}
              className="flex-1"
            >
              {t("existingCompanyDialog.cancel")}
            </Button>
            <Button
              onClick={handleJoinExistingCompany}
              disabled={isJoiningCompany}
              className="flex-1"
            >
              {isJoiningCompany ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("existingCompanyDialog.joining")}
                </>
              ) : (
                t("existingCompanyDialog.join")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
