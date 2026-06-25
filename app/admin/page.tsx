import { createMockResult } from "@/lib/scoring";
import { formatDate } from "@/lib/utils";

const results = [
  createMockResult("riasec"),
  createMockResult("values"),
  createMockResult("career_anchors"),
  createMockResult("skills"),
  createMockResult("multiple_intelligences"),
  createMockResult("career_adaptability")
];

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">관리자 결과 목록</h1>
      <p className="mt-2 text-slate-600">MVP에서는 mock data를 표시하며, 추후 Supabase의 assessment_results 테이블과 연결할 수 있도록 같은 결과 구조를 사용합니다.</p>
      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr><th className="p-4">학생 이름</th><th className="p-4">이메일</th><th className="p-4">진단도구</th><th className="p-4">대표유형</th><th className="p-4">검사일</th></tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.assessmentCode} className="border-t">
                <td className="p-4 font-semibold">{result.studentName}</td>
                <td className="p-4">{result.studentEmail}</td>
                <td className="p-4">{result.assessmentTitle}</td>
                <td className="p-4">{result.primaryType.typeName}</td>
                <td className="p-4">{formatDate(result.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
