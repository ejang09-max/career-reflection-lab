import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { AssessmentCode, AssessmentResult, ResultListItem } from "@/lib/types";

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getCurrentSession() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function upsertProfile(name: string, email: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { error: new Error("Supabase 환경변수가 설정되어 있지 않습니다.") };
  const user = await getCurrentUser();
  if (!user) return { error: new Error("로그인이 필요합니다.") };
  return supabase.from("profiles").upsert({
    id: user.id,
    name,
    email,
  });
}

export async function getMyProfile() {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();
  if (!supabase || !user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return data;
}

export async function saveResultToSupabase(result: AssessmentResult) {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();
  if (!supabase || !user) {
    return { result: null, error: new Error("Supabase 로그인이 필요합니다.") };
  }

  const { data, error } = await supabase
    .from("assessment_results")
    .insert({
      user_id: user.id,
      assessment_code: result.assessmentCode,
      assessment_title: result.assessmentTitle,
      primary_type: result.primaryType.typeName,
      secondary_types: result.secondaryTypes,
      scores: result.allTypes,
      summary: result.summary,
      result_json: result,
    })
    .select("id, created_at")
    .single();

  if (error || !data) return { result: null, error };

  const savedResult = {
    ...result,
    id: data.id,
    createdAt: data.created_at ?? result.createdAt,
  };

  await supabase
    .from("assessment_results")
    .update({ result_json: savedResult })
    .eq("id", data.id);

  return { result: savedResult, error: null };
}

export async function getResultFromSupabase(id: string) {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();
  if (!supabase || !user) return { result: null, error: null };

  const { data, error } = await supabase
    .from("assessment_results")
    .select("result_json")
    .eq("id", id)
    .maybeSingle();

  if (error || !data?.result_json) return { result: null, error };
  return { result: data.result_json as AssessmentResult, error: null };
}

export async function getLatestResultIndexFromSupabase(assessmentCode: AssessmentCode) {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();
  if (!supabase || !user) return null;

  const { data } = await supabase
    .from("assessment_results")
    .select("id, assessment_title, primary_type, created_at")
    .eq("assessment_code", assessmentCode)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return {
    latestResultId: data.id,
    completedAt: data.created_at,
    assessmentTitle: data.assessment_title,
    primaryTypeName: data.primary_type ?? "",
  };
}

export async function listMyResults() {
  const supabase = getSupabaseBrowserClient();
  const user = await getCurrentUser();
  if (!supabase || !user) return { results: [] as ResultListItem[], error: null };

  const { data, error } = await supabase
    .from("assessment_results")
    .select("id, assessment_code, assessment_title, primary_type, created_at, result_json")
    .order("created_at", { ascending: false });

  return { results: (data ?? []) as ResultListItem[], error };
}
