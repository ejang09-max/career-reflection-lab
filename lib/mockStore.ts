import type { AssessmentResult } from "@/lib/types";

const globalStore = globalThis as typeof globalThis & {
  careerReflectionResults?: Map<string, AssessmentResult>;
};

function store() {
  if (!globalStore.careerReflectionResults) {
    globalStore.careerReflectionResults = new Map<string, AssessmentResult>();
  }
  return globalStore.careerReflectionResults;
}

export function saveMockResult(result: AssessmentResult) {
  store().set(result.id, result);
  return result;
}

export function getMockResult(id: string) {
  return store().get(id) ?? null;
}

export function listMockResults() {
  return Array.from(store().values());
}
