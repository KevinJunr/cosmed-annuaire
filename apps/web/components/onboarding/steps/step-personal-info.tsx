"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Mail, Phone } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
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
  personalInfoSchema,
  type PersonalInfoFormData,
} from "@/lib/validations/onboarding";
import { DEPARTMENTS } from "@/lib/constants/departments";
import { POSITIONS } from "@/lib/constants/positions";
import { RequiredLabel } from "@/components/ui";

export function StepPersonalInfo() {
  const t = useTranslations("onboarding.step3");
  const tCommon = useTranslations("onboarding.common");
  const tDepartments = useTranslations("departments");
  const tPositions = useTranslations("positions");
  const { state, updateData, nextStep, prevStep } = useOnboarding();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: state.data.firstName,
      lastName: state.data.lastName,
      email: state.data.email,
      phone: state.data.phone,
      departmentId: state.data.departmentId,
      position: state.data.position,
    },
    mode: "onChange",
  });

  const identifierType = state.data.identifierType;
  const watchDepartment = watch("departmentId");
  const watchPosition = watch("position");

  const onSubmit = (data: PersonalInfoFormData) => {
    updateData({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || "",
      phone: data.phone || "",
      departmentId: data.departmentId,
      position: data.position,
    });
    nextStep();
  };

  return (
    <StepContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-4">
          {/* Display identifier from step 1 */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
            {identifierType === "email" ? (
              <Mail className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Phone className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">{state.data.identifier}</span>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <RequiredLabel htmlFor="firstName" required>
                {t("firstName")}
              </RequiredLabel>
              <Input
                id="firstName"
                placeholder={t("firstNamePlaceholder")}
                autoComplete="given-name"
                {...register("firstName")}
                className={cn(
                  errors.firstName &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">
                  {t(`errors.${errors.firstName.message}`)}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <RequiredLabel htmlFor="lastName" required>
                {t("lastName")}
              </RequiredLabel>
              <Input
                id="lastName"
                placeholder={t("lastNamePlaceholder")}
                autoComplete="family-name"
                {...register("lastName")}
                className={cn(
                  errors.lastName &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">
                  {t(`errors.${errors.lastName.message}`)}
                </p>
              )}
            </div>
          </div>

          {/* Email (if identifier was phone) */}
          {identifierType === "phone" && (
            <div className="grid gap-2">
              <RequiredLabel htmlFor="email" optional optionalText={t("optional")}>
                {t("email")}
              </RequiredLabel>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                {...register("email")}
                className={cn(
                  errors.email &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {t(`errors.${errors.email.message}`)}
                </p>
              )}
            </div>
          )}

          {/* Phone (if identifier was email) */}
          {identifierType === "email" && (
            <div className="grid gap-2">
              <RequiredLabel htmlFor="phone" optional optionalText={t("optional")}>
                {t("phone")}
              </RequiredLabel>
              <Input
                id="phone"
                type="tel"
                placeholder={t("phonePlaceholder")}
                autoComplete="tel"
                {...register("phone")}
                className={cn(
                  errors.phone &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {t(`errors.${errors.phone.message}`)}
                </p>
              )}
            </div>
          )}

          {/* Department */}
          <div className="grid gap-2">
            <RequiredLabel htmlFor="department" required>
              {t("department")}
            </RequiredLabel>
            <Select
              value={watchDepartment}
              onValueChange={(value) =>
                setValue("departmentId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  errors.departmentId &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder={t("departmentPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {tDepartments(dept.nameKey.replace("departments.", ""))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.departmentId && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.departmentId.message}`)}
              </p>
            )}
          </div>

          {/* Position */}
          <div className="grid gap-2">
            <RequiredLabel htmlFor="position" required>
              {t("position")}
            </RequiredLabel>
            <Select
              value={watchPosition}
              onValueChange={(value) =>
                setValue("position", value, { shouldValidate: true })
              }
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  errors.position &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              >
                <SelectValue placeholder={t("positionPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((pos) => (
                  <SelectItem key={pos.id} value={pos.id}>
                    {tPositions(pos.nameKey.replace("positions.", ""))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.position && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.position.message}`)}
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
          <Button type="submit" className="flex-1" disabled={!isValid}>
            {tCommon("continue")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </StepContainer>
  );
}
