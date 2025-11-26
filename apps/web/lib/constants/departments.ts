import type { Department } from "@/types";

export const DEPARTMENTS: Department[] = [
  { id: "dept-1", code: "RD", nameKey: "departments.rd" },
  { id: "dept-2", code: "QUALITY", nameKey: "departments.quality" },
  { id: "dept-3", code: "PRODUCTION", nameKey: "departments.production" },
  { id: "dept-4", code: "MARKETING", nameKey: "departments.marketing" },
  { id: "dept-5", code: "SALES", nameKey: "departments.sales" },
  { id: "dept-6", code: "PURCHASING", nameKey: "departments.purchasing" },
  { id: "dept-7", code: "LOGISTICS", nameKey: "departments.logistics" },
  { id: "dept-8", code: "REGULATORY", nameKey: "departments.regulatory" },
  { id: "dept-9", code: "HR", nameKey: "departments.hr" },
  { id: "dept-10", code: "FINANCE", nameKey: "departments.finance" },
  { id: "dept-11", code: "IT", nameKey: "departments.it" },
  { id: "dept-12", code: "MANAGEMENT", nameKey: "departments.management" },
  { id: "dept-13", code: "OTHER", nameKey: "departments.other" },
];

export function getDepartmentById(id: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.id === id);
}

export function getDepartmentByCode(code: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.code === code);
}
