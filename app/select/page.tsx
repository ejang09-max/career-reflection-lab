import Link from "next/link";
import { AssessmentCard } from "@/components/AssessmentCard";
import { EDUCATIONAL_NOTICE } from "@/lib/constants";
import { assessments } from "@/lib/assessments";

const perspectives = [
  { label: "흥미", text: "끌리는 활동" },
  { label: "가치", text: "중요한 기준" },
  { label: "역량", text: "잘할 수 있는 것" },
  { label: "준비도", text: "실행하는 힘" }
];

export default function SelectPage() {
  return (
    <main className="campus-grid min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
      <section className="mb-8">
        <p className="inline-flex rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">Career Reflection Lab</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">진단도구 선택</h1>
          <Link className="inline-flex h-10 items-center justify-center rounded-lg border bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50" href="/mypage">내 결과 보기</Link>
        </div>
        <div className="glass-panel mt-6 rounded-lg border p-5">
          <h2 className="text-xl font-bold">보다 입체적이고 정확한 진로탐색을 시작해보세요</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            진로탐색은 흥미, 가치, 역량, 준비도를 함께 살펴볼 때 더 선명해집니다. 이 진단실은 학생이 자신의 진로 방향을 다양한 관점에서 이해하고, 스스로 설명할 수 있도록 돕습니다. 보다 입체적이고 정확한 진로탐색을 위해 다양한 진단에 참여를 추천드립니다.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {perspectives.map((item) => (
              <div key={item.label} className="rounded-md bg-slate-50 p-3 text-sm">
                <p className="font-bold text-indigo-700">{item.label}</p>
                <p className="mt-1 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[...assessments].sort((a, b) => a.order - b.order).map((assessment) => <AssessmentCard key={assessment.code} assessment={assessment} />)}
      </div>
      <p className="mt-8 rounded-md border bg-white p-4 text-sm leading-6 text-slate-600">{EDUCATIONAL_NOTICE}</p>
      </div>
    </main>
  );
}
