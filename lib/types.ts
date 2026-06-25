export type AssessmentCode =
  | "values"
  | "multiple_intelligences"
  | "skills"
  | "riasec"
  | "career_anchors"
  | "career_adaptability";

export type Question = {
  id: string;
  assessmentCode: AssessmentCode;
  typeCode: string;
  text: string;
  order: number;
  reverseScored?: boolean;
};

export type Answer = {
  questionId: string;
  score: 1 | 2 | 3 | 4 | 5;
};

export type TypeResult = {
  typeCode: string;
  typeName: string;
  rawScore: number;
  maxScore: number;
  percentage: number;
  description: string;
  strengths: string[];
  cautions: string[];
  recommendedActivities: string[];
};

export type AssessmentResult = {
  id: string;
  studentName: string;
  studentEmail: string;
  assessmentCode: AssessmentCode;
  assessmentTitle: string;
  createdAt: string;
  primaryType: TypeResult;
  secondaryTypes: TypeResult[];
  allTypes: TypeResult[];
  summary: string;
  reflectionQuestions: string[];
};

export type Assessment = {
  code: AssessmentCode;
  order: number;
  title: string;
  label: string;
  perspective: "흥미" | "가치" | "역량" | "준비도";
  perspectiveDescription: string;
  keyQuestion: string;
  description: string;
  detailDescription?: string;
  estimatedTime: string;
  questionCount: number;
  resultExample: string;
  topLabel: string;
};

export type TypeMeta = {
  typeCode: string;
  typeName: string;
  shortLabel: string;
  description: string;
  strengths: string[];
  cautions: string[];
  recommendedActivities: string[];
};

export type StoredStudent = {
  name: string;
  email: string;
  consentEmail: boolean;
};

export type StoredResultIndex = {
  [email: string]: {
    [assessmentCode: string]: {
      latestResultId: string;
      completedAt: string;
      assessmentTitle: string;
      primaryTypeName: string;
    };
  };
};

export type StoredResults = {
  [resultId: string]: AssessmentResult & { consentEmail?: boolean };
};
