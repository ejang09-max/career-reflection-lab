import { redirect } from "next/navigation";
import { QuestionForm } from "@/components/QuestionForm";
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
      <QuestionForm assessment={assessment} questions={questions} />
    </main>
  );
}
