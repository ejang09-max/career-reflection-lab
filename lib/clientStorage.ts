import type { AssessmentResult, StoredResultIndex, StoredResults, StoredStudent } from "@/lib/types";

export const CURRENT_STUDENT_KEY = "career_reflection_current_student";
export const LEGACY_STUDENT_KEY = "career-reflection-student";
export const RESULTS_KEY = "career_reflection_results";
export const RESULT_INDEX_KEY = "career_reflection_result_index";
export const GUEST_RESULT_KEY = "__guest__";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function saveCurrentStudent(student: StoredStudent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(student));
  window.localStorage.setItem(LEGACY_STUDENT_KEY, JSON.stringify(student));
}

export function getCurrentStudent() {
  return readJson<StoredStudent | null>(CURRENT_STUDENT_KEY, null) ?? readJson<StoredStudent | null>(LEGACY_STUDENT_KEY, null);
}

export function clearCurrentStudent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_STUDENT_KEY);
  window.localStorage.removeItem(LEGACY_STUDENT_KEY);
}

function resultIndexKey(email: string | undefined | null) {
  return email?.trim() || GUEST_RESULT_KEY;
}

export function saveStoredResult(result: AssessmentResult & { consentEmail?: boolean }) {
  if (typeof window === "undefined") return;
  const results = readJson<StoredResults>(RESULTS_KEY, {});
  results[result.id] = result;
  window.localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  window.localStorage.setItem(`career-reflection-result-${result.id}`, JSON.stringify(result));
  window.localStorage.setItem("career-reflection-latest-result-id", result.id);

  const index = readJson<StoredResultIndex>(RESULT_INDEX_KEY, {});
  const email = resultIndexKey(result.studentEmail);
  index[email] = {
    ...(index[email] ?? {}),
    [result.assessmentCode]: {
      latestResultId: result.id,
      completedAt: result.createdAt,
      assessmentTitle: result.assessmentTitle,
      primaryTypeName: result.primaryType.typeName
    }
  };
  window.localStorage.setItem(RESULT_INDEX_KEY, JSON.stringify(index));
}

export function getStoredResult(resultId: string) {
  const results = readJson<StoredResults>(RESULTS_KEY, {});
  return results[resultId] ?? readJson<(AssessmentResult & { consentEmail?: boolean }) | null>(`career-reflection-result-${resultId}`, null);
}

export function getLatestResultForAssessment(email: string | undefined, assessmentCode: string) {
  const index = readJson<StoredResultIndex>(RESULT_INDEX_KEY, {});
  return index[resultIndexKey(email)]?.[assessmentCode] ?? null;
}
