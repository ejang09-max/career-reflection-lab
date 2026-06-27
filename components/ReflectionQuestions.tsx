import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReflectionQuestions({ questions }: { questions: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>생각해볼 질문</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {questions.map((question, index) => (
          <p key={question} className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <span className="mr-2 font-bold text-indigo-600">Q{index + 1}</span>{question}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
