import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAssessment } from "@/lib/assessments";
import { formatDate } from "@/lib/utils";
import type { AssessmentResult } from "@/lib/types";

export function ResultHeader({ result }: { result: AssessmentResult }) {
  const assessment = getAssessment(result.assessmentCode);
  return (
    <Card className="soft-panel overflow-hidden border-0 p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            {assessment && <Badge>{assessment.label}</Badge>}
            <Badge className="bg-sky-50 text-sky-700">{result.primaryType.typeName}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-normal sm:text-4xl">{result.studentName}님의 {result.assessmentTitle} 결과</h1>
          {assessment && <p className="mt-3 max-w-2xl text-slate-600">{assessment.perspectiveDescription}</p>}
          {assessment && <p className="mt-2 text-sm font-semibold text-sky-700">핵심 질문: {assessment.keyQuestion}</p>}
        </div>
        <div className="rounded-md bg-white/80 p-4 text-sm text-slate-600">
          {assessment && <p><span className="font-semibold text-slate-900">진단 라벨</span> {assessment.label}</p>}
          <p><span className="font-semibold text-slate-900">검사일</span> {formatDate(result.createdAt)}</p>
          {result.studentEmail && <p><span className="font-semibold text-slate-900">이메일</span> {result.studentEmail}</p>}
        </div>
      </div>
    </Card>
  );
}
