import type { ContactInput, FinancialResult, SimulationInput, StudentEstimate } from "@/types/simulator";

export type ContactPayload = {
  contact: ContactInput;
  simulationInput: SimulationInput;
  estimatedStudents: StudentEstimate;
  selectedScenario: FinancialResult;
  breakEvenStudents: number | null;
};

export async function submitContact(payload: ContactPayload): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to submit contact request");
  }
}
