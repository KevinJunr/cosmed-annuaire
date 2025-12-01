"use client";

import * as React from "react";
import { X, ChevronRight, Check, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
  CATEGORIES_DATA,
  CERTIFICATIONS_DATA,
  type FilterState,
  type CategoryData,
  type SubcategoryData,
} from "./types";

interface SearchFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function SearchFiltersSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: SearchFiltersSheetProps) {
  const t = useTranslations("search");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null);

  // Count active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    Object.values(filters.categories).forEach((subcategories) => {
      count += subcategories.length;
    });
    count += filters.certifications.length;
    return count;
  }, [filters]);

  const handleReset = () => {
    onFiltersChange({ categories: {}, certifications: [] });
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const toggleCategoryFilter = (categoryId: string, subcategoryId: string, childId?: string) => {
    const key = childId ? `${subcategoryId}.${childId}` : subcategoryId;
    const currentFilters = filters.categories[categoryId] || [];
    const isActive = currentFilters.includes(key);

    onFiltersChange({
      ...filters,
      categories: {
        ...filters.categories,
        [categoryId]: isActive
          ? currentFilters.filter((f) => f !== key)
          : [...currentFilters, key],
      },
    });
  };

  const toggleCertification = (certId: string) => {
    const isActive = filters.certifications.includes(certId);
    onFiltersChange({
      ...filters,
      certifications: isActive
        ? filters.certifications.filter((c) => c !== certId)
        : [...filters.certifications, certId],
    });
  };

  const isFilterActive = (categoryId: string, subcategoryId: string, childId?: string) => {
    const key = childId ? `${subcategoryId}.${childId}` : subcategoryId;
    return filters.categories[categoryId]?.includes(key) || false;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] sm:h-[80vh] rounded-t-3xl p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">
              {t("filtersTitle")}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("reset")}
                </Button>
              )}
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("activeFilters", { count: activeFiltersCount })}
            </p>
          )}
        </SheetHeader>

        {/* Tabs */}
        <Tabs defaultValue="categories" className="flex-1 flex flex-col min-h-0">
          <TabsList className="flex-shrink-0 w-full justify-start rounded-none border-b bg-transparent px-6 h-auto py-0">
            <TabsTrigger
              value="categories"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              {t("tabs.categories")}
              {Object.values(filters.categories).flat().length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                  {Object.values(filters.categories).flat().length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              {t("tabs.certifications")}
              {filters.certifications.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                  {filters.certifications.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="flex-1 min-h-0 m-0">
            <div className="h-full flex">
              {/* Desktop: 3-column layout */}
              <div className="hidden md:flex w-full">
                {/* Level 1: Main categories */}
                <div className="w-1/3 border-r">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-1">
                      {CATEGORIES_DATA.map((category) => (
                        <CategoryButton
                          key={category.id}
                          category={category}
                          isSelected={selectedCategory === category.id}
                          hasActiveFilters={(filters.categories[category.id]?.length || 0) > 0}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setSelectedSubcategory(null);
                          }}
                          t={t}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Level 2: Subcategories */}
                <div className="w-1/3 border-r bg-gray-50/50">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-1">
                      {selectedCategory &&
                        CATEGORIES_DATA.find((c) => c.id === selectedCategory)?.subcategories.map(
                          (sub) => (
                            <SubcategoryButton
                              key={sub.id}
                              categoryId={selectedCategory}
                              subcategory={sub}
                              isSelected={selectedSubcategory === sub.id}
                              hasActiveFilters={
                                filters.categories[selectedCategory]?.some((f) =>
                                  f.startsWith(sub.id)
                                ) || false
                              }
                              onClick={() => setSelectedSubcategory(sub.id)}
                              onToggle={() =>
                                !sub.children && toggleCategoryFilter(selectedCategory, sub.id)
                              }
                              isActive={isFilterActive(selectedCategory, sub.id)}
                              t={t}
                            />
                          )
                        )}
                      {!selectedCategory && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          {t("selectCategory")}
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Level 3: Children */}
                <div className="w-1/3 bg-gray-50">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-1">
                      {selectedCategory && selectedSubcategory && (
                        <>
                          {CATEGORIES_DATA.find((c) => c.id === selectedCategory)
                            ?.subcategories.find((s) => s.id === selectedSubcategory)
                            ?.children?.map((child) => (
                              <ChildFilterItem
                                key={child}
                                categoryId={selectedCategory}
                                subcategoryId={selectedSubcategory}
                                childId={child}
                                isActive={isFilterActive(
                                  selectedCategory,
                                  selectedSubcategory,
                                  child
                                )}
                                onToggle={() =>
                                  toggleCategoryFilter(
                                    selectedCategory,
                                    selectedSubcategory,
                                    child
                                  )
                                }
                                t={t}
                              />
                            ))}
                        </>
                      )}
                      {(!selectedCategory || !selectedSubcategory) && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          {t("selectSubcategory")}
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Mobile: Accordion layout */}
              <div className="md:hidden w-full">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <Accordion type="multiple" className="space-y-2">
                      {CATEGORIES_DATA.map((category) => (
                        <AccordionItem
                          key={category.id}
                          value={category.id}
                          className="border rounded-lg px-4"
                        >
                          <AccordionTrigger className="hover:no-underline py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {t(`categories.${category.id}.label`)}
                              </span>
                              {(filters.categories[category.id]?.length || 0) > 0 && (
                                <Badge variant="secondary" className="h-5 min-w-5 px-1.5">
                                  {filters.categories[category.id]?.length}
                                </Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <div className="space-y-2">
                              {category.subcategories.map((sub) => (
                                <MobileSubcategoryAccordion
                                  key={sub.id}
                                  categoryId={category.id}
                                  subcategory={sub}
                                  filters={filters}
                                  onToggle={toggleCategoryFilter}
                                  isFilterActive={isFilterActive}
                                  t={t}
                                />
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="flex-1 min-h-0 m-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {CERTIFICATIONS_DATA.map((cert) => (
                    <CertificationCard
                      key={cert}
                      certId={cert}
                      isActive={filters.certifications.includes(cert)}
                      onToggle={() => toggleCertification(cert)}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t bg-white">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={activeFiltersCount === 0}
              className="flex-1 sm:flex-none"
            >
              {t("clearAll")}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none sm:min-w-32 bg-gradient-to-r from-primary to-primary-600"
            >
              {t("showResults")}
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-white/20 text-white border-0"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper Components
interface CategoryButtonProps {
  category: CategoryData;
  isSelected: boolean;
  hasActiveFilters: boolean;
  onClick: () => void;
  t: ReturnType<typeof useTranslations<"search">>;
}

function CategoryButton({
  category,
  isSelected,
  hasActiveFilters,
  onClick,
  t,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-lg",
        "text-left transition-all duration-150",
        isSelected
          ? "bg-primary text-white shadow-md"
          : hasActiveFilters
            ? "bg-primary-50 text-primary hover:bg-primary-100"
            : "hover:bg-gray-100"
      )}
    >
      <span className="font-medium">{t(`categories.${category.id}.label`)}</span>
      <div className="flex items-center gap-2">
        {hasActiveFilters && !isSelected && (
          <Badge variant="secondary" className="h-5 min-w-5 px-1.5 bg-primary text-white">
            •
          </Badge>
        )}
        <ChevronRight className={cn("h-4 w-4", isSelected && "text-white")} />
      </div>
    </button>
  );
}

interface SubcategoryButtonProps {
  categoryId: string;
  subcategory: SubcategoryData;
  isSelected: boolean;
  hasActiveFilters: boolean;
  onClick: () => void;
  onToggle: () => void;
  isActive: boolean;
  t: ReturnType<typeof useTranslations<"search">>;
}

function SubcategoryButton({
  categoryId,
  subcategory,
  isSelected,
  hasActiveFilters,
  onClick,
  onToggle,
  isActive,
  t,
}: SubcategoryButtonProps) {
  const hasChildren = subcategory.children && subcategory.children.length > 0;

  return (
    <button
      onClick={hasChildren ? onClick : onToggle}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-lg",
        "text-left transition-all duration-150",
        isSelected
          ? "bg-primary-100 text-primary"
          : hasActiveFilters || isActive
            ? "bg-primary-50 text-primary"
            : "hover:bg-gray-100"
      )}
    >
      <div className="flex items-center gap-3">
        {!hasChildren && (
          <div
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              isActive
                ? "bg-primary border-primary"
                : "border-gray-300"
            )}
          >
            {isActive && <Check className="h-3 w-3 text-white" />}
          </div>
        )}
        <span className="font-medium">
          {t(`categories.${categoryId}.subcategories.${subcategory.id}`)}
        </span>
      </div>
      {hasChildren && (
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            isSelected && "rotate-90"
          )}
        />
      )}
    </button>
  );
}

interface ChildFilterItemProps {
  categoryId: string;
  subcategoryId: string;
  childId: string;
  isActive: boolean;
  onToggle: () => void;
  t: ReturnType<typeof useTranslations<"search">>;
}

function ChildFilterItem({
  categoryId,
  subcategoryId,
  childId,
  isActive,
  onToggle,
  t,
}: ChildFilterItemProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
        "text-left transition-all duration-150",
        isActive ? "bg-primary-50" : "hover:bg-gray-100"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
          isActive ? "bg-primary border-primary" : "border-gray-300"
        )}
      >
        {isActive && <Check className="h-3 w-3 text-white" />}
      </div>
      <span className={cn("font-medium", isActive && "text-primary")}>
        {t(`categories.${categoryId}.children.${childId}`)}
      </span>
    </button>
  );
}

interface MobileSubcategoryAccordionProps {
  categoryId: string;
  subcategory: SubcategoryData;
  filters: FilterState;
  onToggle: (categoryId: string, subcategoryId: string, childId?: string) => void;
  isFilterActive: (categoryId: string, subcategoryId: string, childId?: string) => boolean;
  t: ReturnType<typeof useTranslations<"search">>;
}

function MobileSubcategoryAccordion({
  categoryId,
  subcategory,
  filters,
  onToggle,
  isFilterActive,
  t,
}: MobileSubcategoryAccordionProps) {
  const hasChildren = subcategory.children && subcategory.children.length > 0;

  if (!hasChildren) {
    return (
      <button
        onClick={() => onToggle(categoryId, subcategory.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
          "text-left transition-colors",
          isFilterActive(categoryId, subcategory.id)
            ? "bg-primary-50"
            : "hover:bg-gray-50"
        )}
      >
        <Checkbox
          checked={isFilterActive(categoryId, subcategory.id)}
          className="pointer-events-none"
        />
        <span className="text-sm">
          {t(`categories.${categoryId}.subcategories.${subcategory.id}`)}
        </span>
      </button>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={subcategory.id} className="border-0">
        <AccordionTrigger className="hover:no-underline py-2 px-3">
          <span className="text-sm font-medium">
            {t(`categories.${categoryId}.subcategories.${subcategory.id}`)}
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-1">
          <div className="pl-4 space-y-1">
            {subcategory.children?.map((child) => (
              <button
                key={child}
                onClick={() => onToggle(categoryId, subcategory.id, child)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                  "text-left transition-colors",
                  isFilterActive(categoryId, subcategory.id, child)
                    ? "bg-primary-50"
                    : "hover:bg-gray-50"
                )}
              >
                <Checkbox
                  checked={isFilterActive(categoryId, subcategory.id, child)}
                  className="pointer-events-none"
                />
                <span className="text-sm">
                  {t(`categories.${categoryId}.children.${child}`)}
                </span>
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

interface CertificationCardProps {
  certId: string;
  isActive: boolean;
  onToggle: () => void;
  t: ReturnType<typeof useTranslations<"search">>;
}

function CertificationCard({ certId, isActive, onToggle, t }: CertificationCardProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl",
        "border-2 transition-all duration-200",
        "hover:shadow-md",
        isActive
          ? "border-primary bg-primary-50 shadow-sm"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          "text-lg font-bold uppercase",
          isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
        )}
      >
        {certId.slice(0, 2)}
      </div>
      <span
        className={cn(
          "text-sm font-medium text-center",
          isActive ? "text-primary" : "text-foreground"
        )}
      >
        {t(`certifications.${certId}`)}
      </span>
      {isActive && (
        <Badge variant="default" className="mt-1">
          <Check className="h-3 w-3" />
        </Badge>
      )}
    </button>
  );
}
