import { redirect } from "next/navigation";
import { QuestionForm } from "@/components/QuestionForm";
import { EDUCATIONAL_NOTICE } from "@/lib/constants";
import { assessments, getAssessment, getQuestionsByAssessment } from "@/lib/assessments";
import type { AssessmentCode } from "@/lib/types";

const codes: string[] = assessments.map((assessment) => assessment.code);

export default async function AssessmentPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!codes.includes(code)) redirect("/select");
  const assessment = getAssessment(code as AssessmentCode);
  if (!assessment) redirect("/select");
  const questions = getQuestionsByAssessment(code as AssessmentCode);
  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold">{assessment.title}</h1>
        <p className="mt-2 text-slate-600">{assessment.detailDescription ?? assessment.description}</p>
        <p className="mt-4 rounded-md border bg-white p-4 text-sm leading-6 text-slate-600">{EDUCATIONAL_NOTICE}</p>
      </div>
      <QuestionForm assessment={assessment} questions={questions} />
    </main>
  );
}
