import { getAssessment, getQuestionsByAssessment } from "@/lib/assessments";
import { getSummary, reflectionQuestions, typeMetas } from "@/lib/resultText";
import type { Answer, AssessmentCode, AssessmentResult, TypeResult } from "@/lib/types";

export function calculateAssessmentResult({
  studentName,
  studentEmail,
  assessmentCode,
  answers
}: {
  studentName: string;
  studentEmail: string;
  assessmentCode: AssessmentCode;
  answers: Answer[];
}): AssessmentResult {
  const assessment = getAssessment(assessmentCode);
  if (!assessment) throw new Error("알 수 없는 진단 코드입니다.");

  const questions = getQuestionsByAssessment(assessmentCode);
  const scoreByQuestion = new Map(answers.map((answer) => [answer.questionId, answer.score]));
  const totals = new Map<string, number>();
  const counts = new Map<string, number>();

  // 역채점 문항이 생겨도 같은 함수에서 처리할 수 있도록 구조를 열어둡니다.
  questions.forEach((question) => {
    const originalScore = scoreByQuestion.get(question.id) ?? 0;
    const score = question.reverseScored ? 6 - originalScore : originalScore;
    totals.set(question.typeCode, (totals.get(question.typeCode) ?? 0) + score);
    counts.set(question.typeCode, (counts.get(question.typeCode) ?? 0) + 1);
  });

  const allTypes: TypeResult[] = Array.from(totals.entries()).map(([typeCode, rawScore]) => {
    const meta = typeMetas[assessmentCode][typeCode];
    const maxScore = (counts.get(typeCode) ?? 0) * 5;
    return {
      typeCode,
      typeName: meta.typeName,
      rawScore,
      maxScore,
      percentage: Math.round((rawScore / maxScore) * 100),
      description: meta.description,
      strengths: meta.strengths,
      cautions: meta.cautions,
      recommendedActivities: meta.recommendedActivities
    };
  });

  const sortedTypes = [...allTypes].sort((a, b) => b.rawScore - a.rawScore || a.typeName.localeCompare(b.typeName, "ko"));
  const primaryType = sortedTypes[0];

  return {
    id: `result-${Date.now()}`,
    studentName,
    studentEmail,
    assessmentCode,
    assessmentTitle: assessment.title,
    createdAt: new Date().toISOString(),
    primaryType,
    secondaryTypes: sortedTypes.slice(1, 3),
    allTypes: sortedTypes,
    summary: getSummary(assessmentCode, primaryType.typeName),
    reflectionQuestions: reflectionQuestions[assessmentCode]
  };
}

export function getImprovementType(result: AssessmentResult) {
  if (result.assessmentCode !== "skills" && result.assessmentCode !== "career_adaptability") return null;
  return [...result.allTypes].sort((a, b) => a.rawScore - b.rawScore || a.typeName.localeCompare(b.typeName, "ko"))[0];
}

export function createMockResult(assessmentCode: AssessmentCode = "values"): AssessmentResult {
  const questions = getQuestionsByAssessment(assessmentCode);
  const answers = questions.map((question, index) => ({
    questionId: question.id,
    score: ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5
  }));
  return calculateAssessmentResult({
    studentName: "홍길동",
    studentEmail: "student@example.com",
    assessmentCode,
    answers
  });
}
