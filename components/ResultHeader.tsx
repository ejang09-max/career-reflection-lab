import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAssessment } from "@/lib/assessments";
import { formatDate } from "@/lib/utils";
import type { AssessmentResult } from "@/lib/types";

export function ResultHeader({ result }: { result: AssessmentResult }) {
  const assessment = getAssessment(result.assessmentCode);
  return (
    <Card className="soft-panel overflow-hidden border-0 p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            {assessment && <Badge>{assessment.label}</Badge>}
            <Badge className="bg-slate-100 text-slate-700">{result.primaryType.typeName}</Badge>
          </div>
          {assessment && (
            <div className="mt-4 space-y-2 rounded-md bg-white/80 p-4 text-sm text-slate-700">
              <p className="font-bold text-slate-950">{assessment.order}. {assessment.title}</p>
              <p><span className="font-semibold">라벨:</span> {assessment.label}</p>
              <p>{assessment.perspectiveDescription}</p>
              <p><span className="font-semibold">핵심 질문:</span> {assessment.keyQuestion}</p>
            </div>
          )}
          <h1 className="mt-4 text-3xl font-bold tracking-normal sm:text-4xl">{result.studentName}님의 진로설계 결과</h1>
          <p className="mt-3 max-w-2xl text-slate-600">{result.summary}</p>
        </div>
        <div className="rounded-md bg-white/80 p-4 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-900">진단명</span> {result.assessmentTitle}</p>
          <p><span className="font-semibold text-slate-900">검사일</span> {formatDate(result.createdAt)}</p>
          <p><span className="font-semibold text-slate-900">이메일</span> {result.studentEmail}</p>
        </div>
      </div>
    </Card>
  );
}
