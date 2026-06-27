"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/supabaseResults";
import type { AssessmentResult } from "@/lib/types";

function safeFilePart(value: string | undefined, fallback: string) {
  return (value || fallback).replace(/[\\/:*?"<>|\s]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

function buildPdfFilename(resultId: string, result?: AssessmentResult) {
  const date = result?.createdAt ? new Date(result.createdAt) : new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const assessment = safeFilePart(result?.assessmentTitle, "진로설계나침반");
  const name = safeFilePart(result?.studentName, "학생");
  return `${assessment}_${name}_${y}${m}${d}_v1.pdf`;
}

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
    const session = await getCurrentSession();
    const response = await fetch(`/api/pdf/${resultId}`, {
      headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      window.alert(data?.message ?? "PDF 다운로드 중 문제가 발생했습니다.");
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = buildPdfFilename(resultId, result);
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <Button className="h-11 bg-sky-500 px-5 text-base font-bold shadow-sm hover:bg-sky-600" onClick={download}>
      <Download size={18} /> PDF 다운로드
    </Button>
  );
}
