"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Building2,
  Plus,
  X,
  Loader2,
  Check,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemFooter,
  ItemGroup,
} from "@workspace/ui/components/item";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
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

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import { searchCompaniesWithCountryAction } from "@/lib/actions/companies";
import { FlagIcon } from "@/components/ui";
import type { CompanyWithCountry } from "@/lib/repositories";

type CompanyChoice = "existing" | "new" | "none";

const CHOICE_OPTIONS = [
  { value: "existing" as const, icon: Search, colorClass: "text-blue-500", bgClass: "bg-blue-500/10", hasDescription: true },
  { value: "new" as const, icon: Plus, colorClass: "text-green-500", bgClass: "bg-green-500/10", hasDescription: false },
  { value: "none" as const, icon: X, colorClass: "text-muted-foreground", bgClass: "bg-muted", hasDescription: false },
];

export function StepCompanySelect() {
  const t = useTranslations("onboarding.step3.pathA");
  const tCommon = useTranslations("onboarding.common");
  const locale = useLocale();
  const router = useRouter();
  const { state, updateData, nextStep, prevStep, setPath, complete } = useOnboarding();

  // Use Intl.DisplayNames for automatic country name translation
  const countryDisplayNames = useMemo(
    () => new Intl.DisplayNames([locale], { type: "region" }),
    [locale]
  );

  const [choice, setChoice] = useState<CompanyChoice | null>(
    state.data.companyChoice
  );
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompanyWithCountry[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithCountry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setIsSearching(true);
      try {
        const result = await searchCompaniesWithCountryAction(query);
        if (result.success && result.companies) {
          setSearchResults(result.companies);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  }, []);

  const handleSelectCompany = (company: CompanyWithCountry) => {
    setSelectedCompany(company);
    setComboboxOpen(false);
  };

  // Helper to get translated country name using Intl.DisplayNames
  const getCountryName = (countryCode: string) => {
    try {
      return countryDisplayNames.of(countryCode) || countryCode;
    } catch {
      return countryCode;
    }
  };

  const handleChoiceChange = (value: CompanyChoice) => {
    setChoice(value);
    if (value !== "existing") {
      setSelectedCompany(null);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSubmit = async () => {
    if (!choice) return;

    setIsSubmitting(true);

    // If user wants to create a new company, go to step 4 (company creation)
    if (choice === "new") {
      updateData({ companyChoice: choice });
      setPath("register");
      nextStep(); // Go to step 4 for company creation
      setIsSubmitting(false);
      return;
    }

    // Complete onboarding with data passed directly
    // Also pass locale to save preferred_language in profile
    const success = await complete({
      companyChoice: choice,
      selectedCompanyId: choice === "existing" ? selectedCompany?.id ?? null : null,
    }, locale);

    if (success) {
      router.push("/home");
    } else {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    choice === "none" ||
    choice === "new" ||
    (choice === "existing" && selectedCompany !== null);

  return (
    <StepContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <RadioGroup
          value={choice ?? undefined}
          onValueChange={(v) => handleChoiceChange(v as CompanyChoice)}
          className="contents"
        >
          <ItemGroup className="gap-3">
            {CHOICE_OPTIONS.map(({ value, icon: Icon, colorClass, bgClass, hasDescription }) => {
              const isSelected = choice === value;
              return (
                <label key={value} htmlFor={value} className="cursor-pointer">
                  <RadioGroupItem value={value} id={value} className="sr-only" />
                  <Item
                    variant="outline"
                    className={cn(
                      "transition-all hover:bg-muted/50",
                      isSelected && "border-primary bg-primary/5 ring-1 ring-primary/20"
                    )}
                  >
                    <ItemMedia
                      className={cn(
                        "size-10 rounded-full",
                        isSelected ? bgClass : "bg-muted"
                      )}
                    >
                      <Icon className={cn("size-5", colorClass)} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{t(`options.${value}.title`)}</ItemTitle>
                      {hasDescription && (
                        <ItemDescription>
                          {t(`options.${value}.description`)}
                        </ItemDescription>
                      )}
                    </ItemContent>
                    <div
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border-2 transition-colors shrink-0",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </div>

                    {/* Company search combobox - only for "existing" option */}
                    {value === "existing" && isSelected && (
                      <ItemFooter className="pt-3">
                        <div className="w-full space-y-2">
                          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={comboboxOpen}
                                className={cn(
                                  "w-full justify-between font-normal h-auto min-h-9 py-2",
                                  !selectedCompany && "text-muted-foreground"
                                )}
                              >
                                {selectedCompany ? (
                                  <div className="flex items-center gap-2 text-left">
                                    <Building2 className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{selectedCompany.name}</span>
                                  </div>
                                ) : (
                                  <span>{t("searchPlaceholder")}</span>
                                )}
                                {isSearching ? (
                                  <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
                                ) : (
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                              <Command shouldFilter={false}>
                                <CommandInput
                                  placeholder={t("searchPlaceholder")}
                                  value={searchQuery}
                                  onValueChange={handleSearch}
                                />
                                <CommandList>
                                  {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                                    <CommandEmpty>{t("noResults")}</CommandEmpty>
                                  )}
                                  {searchQuery.length < 2 && (
                                    <CommandEmpty>{t("searchHint")}</CommandEmpty>
                                  )}
                                  {searchResults.length > 0 && (
                                    <CommandGroup>
                                      {searchResults.map((company) => (
                                        <CommandItem
                                          key={company.id}
                                          value={company.id}
                                          onSelect={() => handleSelectCompany(company)}
                                          className="flex items-start gap-3 py-3"
                                        >
                                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                          <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium truncate">{company.name}</span>
                                              {company.is_premium && (
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded shrink-0">
                                                  Premium
                                                </span>
                                              )}
                                            </div>
                                            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                              {company.legal_id && (
                                                <span className="truncate">
                                                  {company.legal_id_type || "ID"}: {company.legal_id}
                                                </span>
                                              )}
                                              {company.country && (
                                                <div className="flex items-center gap-1.5">
                                                  <FlagIcon
                                                    countryCode={company.country.code}
                                                    className="h-3 w-4 rounded-sm object-cover shrink-0"
                                                  />
                                                  <span>{getCountryName(company.country.code)}</span>
                                                </div>
                                              )}
                                              {company.address && (
                                                <span className="truncate">{company.address}</span>
                                              )}
                                            </div>
                                          </div>
                                          <Check
                                            className={cn(
                                              "h-4 w-4 shrink-0 mt-0.5",
                                              selectedCompany?.id === company.id ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {/* Selected company details */}
                          {selectedCompany && (
                            <Item variant="muted" size="sm" className="bg-primary/5 border-primary/20">
                              <ItemMedia className="size-6">
                                <Check className="size-4 text-primary" />
                              </ItemMedia>
                              <ItemContent>
                                <ItemTitle className="text-sm">{selectedCompany.name}</ItemTitle>
                                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                  {selectedCompany.legal_id && (
                                    <span>
                                      {selectedCompany.legal_id_type || "ID"}: {selectedCompany.legal_id}
                                    </span>
                                  )}
                                  {selectedCompany.country && (
                                    <div className="flex items-center gap-1.5">
                                      <FlagIcon
                                        countryCode={selectedCompany.country.code}
                                        className="h-3 w-4 rounded-sm object-cover shrink-0"
                                      />
                                      <span>{getCountryName(selectedCompany.country.code)}</span>
                                    </div>
                                  )}
                                  {selectedCompany.address && (
                                    <span>{selectedCompany.address}</span>
                                  )}
                                </div>
                              </ItemContent>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedCompany(null);
                                  setSearchQuery("");
                                }}
                                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </Item>
                          )}
                        </div>
                      </ItemFooter>
                    )}
                  </Item>
                </label>
              );
            })}
          </ItemGroup>
        </RadioGroup>

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
            type="button"
            onClick={handleSubmit}
            className="flex-1"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon("finishing")}
              </>
            ) : (
              tCommon("finish")
            )}
          </Button>
        </div>
      </div>
    </StepContainer>
  );
}
