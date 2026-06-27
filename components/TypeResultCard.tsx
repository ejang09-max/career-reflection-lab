import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TypeResult } from "@/lib/types";

export function TypeResultCard({ type, rank }: { type: TypeResult; rank: number }) {
  return (
    <Card className="border-sky-100 bg-white/95">
      <CardHeader>
        <p className="inline-flex w-fit rounded-full bg-sky-50 px-3 py-1 text-sm font-bold text-sky-700">TOP {rank}</p>
        <CardTitle className="text-lg">{type.typeName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">{type.description}</p>
        <p className="mt-4 text-sm font-bold text-slate-900">{type.rawScore}/{type.maxScore}점 · {type.percentage}%</p>
      </CardContent>
    </Card>
  );
}
