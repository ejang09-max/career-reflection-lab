"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AssessmentResult } from "@/lib/types";

export function PdfDownloadButton({ resultId, result }: { resultId: string; result?: AssessmentResult }) {
  async function download() {
    if (result) {
      try {
        await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result)
        });
      } catch {
        // PDF API에 fallback이 있으므로 캐시 실패만으로 다운로드를 막지 않습니다.
      }
    }
    window.open(`/api/pdf/${resultId}`, "_blank");
  }

  return (
    <Button onClick={download}>
      <Download size={18} /> PDF 다운로드
    </Button>
  );
}
