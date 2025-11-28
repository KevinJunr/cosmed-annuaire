"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Mail, Phone, Loader2 } from "lucide-react";

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
import { useAuth } from "@/providers/auth-provider";
import {
  personalInfoSchema,
  type PersonalInfoFormData,
} from "@/lib/validations/onboarding";
import { getDepartmentsAction, getPositionsAction } from "@/lib/actions/reference-data";
import { RequiredLabel } from "@/components/ui";
import type { Department, Position } from "@/types";

export function StepPersonalInfo() {
  const t = useTranslations("onboarding.step2");
  const tCommon = useTranslations("onboarding.common");
  const tDepartments = useTranslations("departments");
  const tPositions = useTranslations("positions");
  const { state, updateData, nextStep, prevStep } = useOnboarding();
  const { user } = useAuth();

  // Reference data from Supabase
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load reference data
  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      try {
        const [deptResult, posResult] = await Promise.all([
          getDepartmentsAction(),
          getPositionsAction(),
        ]);

        if (deptResult.success && deptResult.departments) {
          setDepartments(deptResult.departments);
        }
        if (posResult.success && posResult.positions) {
          setPositions(posResult.positions);
        }
      } catch (error) {
        console.error("Error loading reference data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadData();
  }, []);

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
      departmentId: state.data.departmentId,
      positionId: state.data.positionId,
    },
    mode: "onChange",
  });

  const watchDepartment = watch("departmentId");
  const watchPosition = watch("positionId");

  // Get user identifier from Supabase Auth
  const userEmail = user?.email;
  const userPhone = user?.phone;
  const identifierType = userEmail ? "email" : "phone";
  const identifier = userEmail || userPhone || "";

  const onSubmit = (data: PersonalInfoFormData) => {
    updateData({
      firstName: data.firstName,
      lastName: data.lastName,
      departmentId: data.departmentId,
      positionId: data.positionId,
    });
    nextStep();
  };

  // Helper to get translated name from name_key
  const getDepartmentName = (dept: Department) => {
    // name_key is like "departments.rd" -> we extract "rd"
    const key = dept.name_key.replace("departments.", "");
    return tDepartments(key);
  };

  const getPositionName = (pos: Position) => {
    // name_key is like "positions.ceo" -> we extract "ceo"
    const key = pos.name_key.replace("positions.", "");
    return tPositions(key);
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
          {/* Display user identifier from Supabase Auth */}
          {identifier && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
              {identifierType === "email" ? (
                <Mail className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Phone className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">{identifier}</span>
            </div>
          )}

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
              disabled={isLoadingData}
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  errors.departmentId &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              >
                {isLoadingData ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">{tCommon("loading")}</span>
                  </div>
                ) : (
                  <SelectValue placeholder={t("departmentPlaceholder")} />
                )}
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {getDepartmentName(dept)}
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
                setValue("positionId", value, { shouldValidate: true })
              }
              disabled={isLoadingData}
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  errors.positionId &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              >
                {isLoadingData ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">{tCommon("loading")}</span>
                  </div>
                ) : (
                  <SelectValue placeholder={t("positionPlaceholder")} />
                )}
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos.id} value={pos.id}>
                    {getPositionName(pos)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.positionId && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.positionId.message}`)}
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
          <Button type="submit" className="flex-1" disabled={!isValid || isLoadingData}>
            {tCommon("continue")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </StepContainer>
  );
}
