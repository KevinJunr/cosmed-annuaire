import type { Position } from "@/types";

export const POSITIONS: Position[] = [
  { id: "pos-1", code: "CEO", nameKey: "positions.ceo" },
  { id: "pos-2", code: "DIRECTOR", nameKey: "positions.director" },
  { id: "pos-3", code: "MANAGER", nameKey: "positions.manager" },
  { id: "pos-4", code: "TEAM_LEAD", nameKey: "positions.teamLead" },
  { id: "pos-5", code: "ENGINEER", nameKey: "positions.engineer" },
  { id: "pos-6", code: "TECHNICIAN", nameKey: "positions.technician" },
  { id: "pos-7", code: "SCIENTIST", nameKey: "positions.scientist" },
  { id: "pos-8", code: "ANALYST", nameKey: "positions.analyst" },
  { id: "pos-9", code: "COORDINATOR", nameKey: "positions.coordinator" },
  { id: "pos-10", code: "ASSISTANT", nameKey: "positions.assistant" },
  { id: "pos-11", code: "INTERN", nameKey: "positions.intern" },
  { id: "pos-12", code: "CONSULTANT", nameKey: "positions.consultant" },
  { id: "pos-13", code: "OTHER", nameKey: "positions.other" },
];

export function getPositionById(id: string): Position | undefined {
  return POSITIONS.find((p) => p.id === id);
}

export function getPositionByCode(code: string): Position | undefined {
  return POSITIONS.find((p) => p.code === code);
}
