"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { SearchFiltersSheet } from "./search-filters-sheet";
import type { FilterState } from "./types";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const t = useTranslations("search");
  const [query, setQuery] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>({
    categories: {},
    certifications: [],
  });
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Count active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    // Count category filters
    Object.values(filters.categories).forEach((subcategories) => {
      count += subcategories.length;
    });
    // Count certification filters
    count += filters.certifications.length;
    return count;
  }, [filters]);

  const handleClearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    // TODO: Implement actual search
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Main Search Container */}
      <div
        className={cn(
          "relative flex items-center w-full max-w-4xl mx-auto",
          "bg-white rounded-full",
          "border-2 transition-all duration-300 ease-out",
          "shadow-lg hover:shadow-xl",
          isFocused
            ? "border-primary shadow-xl shadow-primary/10"
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        {/* Search Icon */}
        <div className="flex items-center justify-center pl-5 pr-3">
          <Search
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              isFocused ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>

        {/* Input Field */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            className={cn(
              "w-full py-4 pr-4 bg-transparent",
              "text-base md:text-lg text-foreground placeholder:text-muted-foreground",
              "focus:outline-none"
            )}
          />

          {/* AI Badge - visible when focused or has query */}
          <div
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "transition-all duration-300",
              isFocused || query
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2"
            )}
          >
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border-0 gap-1"
            >
              <Sparkles className="h-3 w-3" />
              <span className="text-xs font-medium">IA</span>
            </Badge>
          </div>
        </div>

        {/* Clear button */}
        {query && (
          <button
            onClick={handleClearQuery}
            className="p-2 mr-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t("clear")}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 mx-2" />

        {/* Filters Button */}
        <button
          onClick={() => setIsFiltersOpen(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 mr-2",
            "rounded-full transition-all duration-200",
            "hover:bg-gray-100",
            activeFiltersCount > 0 && "bg-primary-50"
          )}
        >
          <SlidersHorizontal
            className={cn(
              "h-4 w-4",
              activeFiltersCount > 0 ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              "hidden sm:inline text-sm font-medium",
              activeFiltersCount > 0 ? "text-primary" : "text-muted-foreground"
            )}
          >
            {t("filters")}
          </span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="default"
              className="h-5 min-w-5 px-1.5 text-xs font-semibold"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </button>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          size="lg"
          className={cn(
            "rounded-full mr-1.5 px-6",
            "bg-gradient-to-r from-primary to-primary-600",
            "hover:from-primary-600 hover:to-primary-800",
            "shadow-md hover:shadow-lg transition-all duration-200",
            "font-semibold"
          )}
        >
          <Search className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t("search")}</span>
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-4xl mx-auto">
          {/* Category filters */}
          {Object.entries(filters.categories).map(([category, subcategories]) =>
            subcategories.map((sub) => (
              <Badge
                key={`${category}-${sub}`}
                variant="secondary"
                className="pl-3 pr-1.5 py-1.5 gap-1 bg-white border shadow-sm hover:shadow transition-shadow"
              >
                <span className="text-xs text-muted-foreground">{t(`categories.${category}.label`)}:</span>
                <span className="text-sm font-medium">{t(`categories.${category}.subcategories.${sub}`)}</span>
                <button
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      categories: {
                        ...prev.categories,
                        [category]: prev.categories[category]?.filter(
                          (s) => s !== sub
                        ) || [],
                      },
                    }));
                  }}
                  className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}

          {/* Certification filters */}
          {filters.certifications.map((cert) => (
            <Badge
              key={cert}
              variant="secondary"
              className="pl-3 pr-1.5 py-1.5 gap-1 bg-white border shadow-sm hover:shadow transition-shadow"
            >
              <span className="text-sm font-medium">{t(`certifications.${cert}`)}</span>
              <button
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    certifications: prev.certifications.filter((c) => c !== cert),
                  }));
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {/* Clear all button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ categories: {}, certifications: [] })}
            className="text-muted-foreground hover:text-foreground"
          >
            {t("clearAll")}
          </Button>
        </div>
      )}

      {/* Filters Sheet */}
      <SearchFiltersSheet
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
