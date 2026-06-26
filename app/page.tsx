import { StudentEntryForm } from "@/components/StudentEntryForm";
import { Compass, GraduationCap, Route } from "lucide-react";

export default function HomePage() {
  return (
    <main className="campus-grid min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="inline-flex rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
              Career Reflection Lab
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-normal text-slate-950">
              나의 진로 방향을 조금 더 선명하게
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              흥미, 가치, 역량, 준비도를 차분히 살펴보며 대학생활에서 실천할 수 있는 진로 탐색의 단서를 찾습니다.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                { icon: Compass, title: "여러 관점으로 보기", text: "좋아하는 활동과 중요하게 여기는 기준을 함께 살펴봅니다." },
                { icon: GraduationCap, title: "수업과 상담에 활용", text: "결과를 자기소개, 상담, 진로 과제의 언어로 바꿔봅니다." },
                { icon: Route, title: "다음 행동 찾기", text: "결과에서 끝나지 않고 작게 실천할 활동을 추천합니다." }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="glass-panel flex gap-4 rounded-lg border p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <StudentEntryForm />
      </div>
    </main>
  );
}
