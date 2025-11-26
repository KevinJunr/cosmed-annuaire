"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Building2,
  Plus,
  X,
  Loader2,
  Check,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { cn } from "@workspace/ui/lib/utils";

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import { searchCompanies } from "@/lib/constants/companies";
import { getSectorById } from "@/lib/constants/sectors";
import type { MockCompany } from "@/types";

type CompanyChoice = "existing" | "new" | "none";

export function StepCompanySelect() {
  const t = useTranslations("onboarding.step5.pathA");
  const tCommon = useTranslations("onboarding.common");
  const tSectors = useTranslations("sectors");
  const router = useRouter();
  const { state, updateData, prevStep, setPath, reset } = useOnboarding();

  const [choice, setChoice] = useState<CompanyChoice | null>(
    state.data.companyChoice
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MockCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<MockCompany | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = searchCompanies(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCompany = (company: MockCompany) => {
    setSelectedCompany(company);
    setSearchResults([]);
    setSearchQuery(company.name);
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

    updateData({
      companyChoice: choice,
      selectedCompanyId: choice === "existing" ? selectedCompany?.id ?? null : null,
    });

    // If user wants to create a new company, redirect to company creation path
    if (choice === "new") {
      setPath("register");
      // The wizard will re-render with StepCompanyCreate
      setIsSubmitting(false);
      return;
    }

    // Simulate saving and redirect to dashboard
    await new Promise((resolve) => setTimeout(resolve, 500));
    reset();
    router.push("/");
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
          className="grid gap-3"
        >
          {/* Existing company option */}
          <Label
            htmlFor="existing"
            className={cn(
              "flex items-start gap-4 rounded-lg border p-4 cursor-pointer transition-all",
              "hover:bg-muted/50",
              choice === "existing" && "border-primary bg-primary/5"
            )}
          >
            <RadioGroupItem value="existing" id="existing" className="mt-1" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{t("options.existing.title")}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("options.existing.description")}
              </p>

              {/* Company search */}
              {choice === "existing" && (
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      placeholder={t("searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pr-8"
                    />
                    {selectedCompany && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCompany(null);
                          setSearchQuery("");
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Search results */}
                  {searchResults.length > 0 && !selectedCompany && (
                    <div className="border rounded-md max-h-40 overflow-auto">
                      {searchResults.map((company) => {
                        const sector = getSectorById(company.sectorId);
                        return (
                          <button
                            key={company.id}
                            type="button"
                            onClick={() => handleSelectCompany(company)}
                            className="w-full px-3 py-2 text-left hover:bg-muted/50 flex items-center gap-2"
                          >
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{company.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {sector ? tSectors(sector.nameKey.replace("sectors.", "")) : ""} - {company.country}
                              </p>
                            </div>
                            {company.isPremium && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                                Premium
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Selected company */}
                  {selectedCompany && (
                    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-md">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {selectedCompany.name}
                      </span>
                    </div>
                  )}

                  {/* No results */}
                  {searchQuery.length >= 2 &&
                    searchResults.length === 0 &&
                    !selectedCompany && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        {t("noResults")}
                      </p>
                    )}
                </div>
              )}
            </div>
          </Label>

          {/* Create new company option */}
          <Label
            htmlFor="new"
            className={cn(
              "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all",
              "hover:bg-muted/50",
              choice === "new" && "border-primary bg-primary/5"
            )}
          >
            <RadioGroupItem value="new" id="new" />
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-500" />
              <span className="font-medium">{t("options.new.title")}</span>
            </div>
          </Label>

          {/* No company option */}
          <Label
            htmlFor="none"
            className={cn(
              "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all",
              "hover:bg-muted/50",
              choice === "none" && "border-primary bg-primary/5"
            )}
          >
            <RadioGroupItem value="none" id="none" />
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{t("options.none.title")}</span>
            </div>
          </Label>
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
