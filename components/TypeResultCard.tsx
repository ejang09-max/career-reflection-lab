import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TypeResult } from "@/lib/types";

export function TypeResultCard({ type, rank }: { type: TypeResult; rank: number }) {
  return (
    <Card className="bg-white/95">
      <CardHeader>
        <p className="text-sm font-semibold text-slate-500">TOP {rank}</p>
        <CardTitle className="text-lg">{type.typeName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">{type.description}</p>
        <p className="mt-4 text-sm font-bold text-slate-900">{type.percentage}%</p>
      </CardContent>
    </Card>
  );
}
