import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TypeResult } from "@/lib/types";

export function ResultSummaryCard({ type }: { type: TypeResult }) {
  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
      <CardHeader>
        <p className="text-sm font-semibold text-indigo-600">대표 결과</p>
        <CardTitle>{type.typeName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-700">{type.description}</p>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${type.percentage}%` }} />
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-700">{type.rawScore}/{type.maxScore}점 · {type.percentage}%</p>
      </CardContent>
    </Card>
  );
}
