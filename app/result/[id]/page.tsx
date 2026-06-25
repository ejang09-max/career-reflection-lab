import { ResultReport } from "@/components/ResultReport";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResultReport id={id} />;
}
