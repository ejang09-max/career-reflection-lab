"use client";

import Link from "next/link";
import { Anchor, Brain, BriefcaseBusiness, Clock, Compass, Layers3, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentStudent, getLatestResultForAssessment } from "@/lib/clientStorage";
import type { Assessment, StoredResultIndex } from "@/lib/types";

const icons = {
  values: Sparkles,
  multiple_intelligences: Brain,
  skills: Layers3,
  riasec: BriefcaseBusiness,
  career_anchors: Anchor,
  career_adaptability: Compass
};

export function AssessmentCard({ assessment }: { assessment: Assessment }) {
  const Icon = icons[assessment.code];
  const [latestResult, setLatestResult] = useState<StoredResultIndex[string][string] | null>(null);

  useEffect(() => {
    const student = getCurrentStudent();
    setLatestResult(getLatestResultForAssessment(student?.email, assessment.code));
  }, [assessment.code]);

  return (
    <Card className="group flex h-full flex-col border-white/80 bg-white/90 transition hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm transition group-hover:bg-indigo-600">
              <Icon size={22} />
            </div>
            <Badge>{assessment.label}</Badge>
          </div>
          <span className="inline-flex items-center gap-1 text-sm text-slate-500">
            <Clock size={15} /> {assessment.estimatedTime}
          </span>
        </div>
        <CardTitle className="text-lg leading-7 text-slate-950">{assessment.order}. {assessment.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-5 pt-0">
        <p className="text-sm leading-6 text-slate-600">{assessment.description}</p>
        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <Link className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-indigo-700" href={`/assessment/${assessment.code}`}>
            시작하기
          </Link>
          {latestResult ? (
            <Link className="inline-flex h-11 w-full items-center justify-center rounded-md border bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50" href={`/result/${latestResult.latestResultId}`}>
              결과보기
            </Link>
          ) : (
            <button className="h-11 w-full rounded-md border bg-slate-50 px-4 text-sm font-semibold text-slate-400" disabled title="아직 완료한 진단 결과가 없습니다.">
              결과보기
            </button>
          )}
        </div>
        {!latestResult && <p className="text-xs text-slate-500">아직 완료한 진단 결과가 없습니다.</p>}
      </CardContent>
    </Card>
  );
}
