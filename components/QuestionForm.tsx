"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LikertScale } from "@/components/LikertScale";
import { calculateAssessmentResult } from "@/lib/scoring";
import { getCurrentStudent, saveStoredResult } from "@/lib/clientStorage";
import type { Answer, Assessment, Question, StoredStudent } from "@/lib/types";

export function QuestionForm({ assessment, questions }: { assessment: Assessment; questions: Question[] }) {
  const router = useRouter();
  const pageSize = 5;
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 1 | 2 | 3 | 4 | 5>>({});
  const [error, setError] = useState("");
  const pageCount = Math.ceil(questions.length / pageSize);
  const start = pageIndex * pageSize;
  const currentQuestions = questions.slice(start, start + pageSize);
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const unansweredOnPage = currentQuestions.filter((question) => !answers[question.id]).map((question) => question.id);

  function setScore(questionId: string, score: 1 | 2 | 3 | 4 | 5) {
    setAnswers((current) => ({ ...current, [questionId]: score }));
    setError("");
  }

  function goNext() {
    if (unansweredOnPage.length > 0) {
      setError("현재 페이지에 아직 응답하지 않은 문항이 있습니다.");
      return;
    }
    setPageIndex((value) => Math.min(value + 1, pageCount - 1));
  }

  async function submit() {
    if (unansweredOnPage.length > 0 || answeredCount < questions.length) return setError("현재 페이지에 아직 응답하지 않은 문항이 있습니다.");
    const student: StoredStudent = getCurrentStudent() ?? { name: "학생", email: "student@example.com", consentEmail: false };
    const result = calculateAssessmentResult({
      studentName: student.name,
      studentEmail: student.email,
      assessmentCode: assessment.code,
      answers: Object.entries(answers).map(([questionId, score]) => ({ questionId, score })) as Answer[]
    });
    saveStoredResult({ ...result, consentEmail: student.consentEmail });
    try {
      await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result)
      });
    } catch {
      // 로컬 저장 결과만으로도 화면 흐름이 이어지도록 서버 mock 저장 실패는 막지 않습니다.
    }
    router.push(`/result/${result.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="glass-panel space-y-4 rounded-lg border p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{assessment.label}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{assessment.title}</h2>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">{answeredCount} / {questions.length} 문항 완료 · {pageIndex + 1} / {pageCount} 페이지</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <Card className="border-indigo-100 bg-white/90">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles size={18} />
            </div>
            <CardTitle className="text-lg">응답 방법</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-700">
            <p>각 문항을 읽고 현재 자신에게 가장 가깝다고 느끼는 정도를 선택해주세요. 정답은 없으며, 너무 오래 고민하기보다 현재의 나를 기준으로 응답하면 됩니다.</p>
            <div className="grid gap-2 sm:grid-cols-5">
              {["1 = 전혀 그렇지 않다", "2 = 별로 그렇지 않다", "3 = 보통이다", "4 = 대체로 그렇다", "5 = 매우 그렇다"].map((label) => (
                <span key={label} className="rounded-md bg-slate-50 px-3 py-2 text-center font-semibold text-slate-700">{label}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="soft-panel border-white/80">
        <CardHeader className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-indigo-600">{pageIndex + 1} / {pageCount} 페이지</p>
          <CardTitle className="text-2xl leading-9 text-slate-950">문항에 응답해주세요</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-5 pt-0 sm:p-6 sm:pt-0">
          <div className="space-y-4">
            {currentQuestions.map((question) => {
              const isMissing = Boolean(error) && !answers[question.id];
              return (
                <div key={question.id} className={`rounded-lg border p-4 transition ${isMissing ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white/95 hover:border-indigo-200"}`}>
                  <p className="mb-3 text-base font-semibold leading-7 text-slate-900">
                    <span className="mr-2 text-indigo-600">{question.order}</span>{question.text}
                  </p>
                  <LikertScale value={answers[question.id]} onChange={(score) => setScore(question.id, score)} />
                </div>
              );
            })}
          </div>
          {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={() => setPageIndex((value) => Math.max(value - 1, 0))} disabled={pageIndex === 0}>
              <ArrowLeft size={18} /> 이전
            </Button>
            {pageIndex < pageCount - 1 ? (
              <Button onClick={goNext}>
                다음 <ArrowRight size={18} />
              </Button>
            ) : (
              <Button onClick={submit}>
                결과 보기 <Check size={18} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
