import { AssessmentCard } from "@/components/AssessmentCard";
import { EDUCATIONAL_NOTICE } from "@/lib/constants";
import { assessments } from "@/lib/assessments";

const perspectives = [
  { label: "흥미", text: "내가 관심 있고 좋아하는 활동" },
  { label: "가치", text: "내가 중요하게 여기는 기준" },
  { label: "역량", text: "내가 잘하거나 잘할 수 있는 것" },
  { label: "준비도", text: "변화 속에서 진로를 준비하고 실행하는 힘" }
];

export default function SelectPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="font-semibold text-indigo-600">Career Reflection Lab</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">진단도구 선택</h1>
        <div className="mt-6 rounded-lg border bg-white p-5 shadow-sm">
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
        {assessments.map((assessment) => <AssessmentCard key={assessment.code} assessment={assessment} />)}
      </div>
      <p className="mt-8 rounded-md border bg-white p-4 text-sm leading-6 text-slate-600">{EDUCATIONAL_NOTICE}</p>
    </main>
  );
}
