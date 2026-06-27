"use client";

import { Bar, BarChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssessmentResult } from "@/lib/types";

const colors = {
  values: "#6366f1",
  multiple_intelligences: "#c026d3",
  skills: "#0f766e",
  riasec: "#2563eb",
  career_anchors: "#7c3aed",
  career_adaptability: "#0891b2"
};

export function TypeScoreChart({ result }: { result: AssessmentResult }) {
  const data = result.allTypes.map((type) => ({ name: type.typeName, score: type.percentage, raw: type.rawScore }));
  const isRadar = result.assessmentCode !== "values";
  return (
    <Card>
      <CardHeader>
        <CardTitle>상세 점수 차트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            {isRadar ? (
              <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Radar dataKey="score" stroke={colors[result.assessmentCode]} fill={colors[result.assessmentCode]} fillOpacity={0.28} />
              </RadarChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill={colors[result.assessmentCode]} radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
