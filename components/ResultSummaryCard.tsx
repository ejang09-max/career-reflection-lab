import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAssessment } from "@/lib/assessments";
import { formatDate } from "@/lib/utils";
import type { AssessmentResult, TypeResult } from "@/lib/types";

export function ResultSummaryCard({ type, summary, result }: { type: TypeResult; summary: string; result?: AssessmentResult }) {
  const assessment = result ? getAssessment(result.assessmentCode) : null;
  return (
    <Card className="border-2 border-sky-200 bg-gradient-to-br from-sky-50 via-white to-teal-50 shadow-lg">
      <CardHeader className="space-y-4">
        {result && (
          <div>
            <div className="flex flex-wrap gap-2">
              {assessment && <Badge>{assessment.label}</Badge>}
              <Badge className="bg-sky-50 text-sky-700">{type.typeName}</Badge>
            </div>
            <CardTitle className="mt-4 text-3xl leading-tight sm:text-4xl">{result.studentName}님의 {result.assessmentTitle} 결과</CardTitle>
            {assessment && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{assessment.perspectiveDescription}</p>}
            {assessment && <p className="mt-2 text-sm font-semibold text-sky-700">핵심 질문: {assessment.keyQuestion}</p>}
            <p className="mt-3 text-sm text-slate-500">
              검사일 {formatDate(result.createdAt)}
              {result.studentEmail ? ` · ${result.studentEmail}` : ""}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-sky-700">진단결과 요약</p>
          <CardTitle className="mt-2 text-2xl">{type.typeName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-base font-semibold leading-7 text-slate-900">{summary}</p>
        <p className="text-sm leading-6 text-slate-600">{type.description}</p>
        <div className="flex flex-wrap gap-2">
          {type.strengths.slice(0, 2).map((item) => (
            <Badge key={item} className="bg-white text-sky-700">{item.split(" ").slice(0, 5).join(" ")}</Badge>
          ))}
        </div>
        <p className="rounded-lg bg-white/80 p-3 text-sm font-semibold text-slate-700">{type.rawScore}/{type.maxScore}점 · {type.percentage}%</p>
      </CardContent>
    </Card>
  );
}
