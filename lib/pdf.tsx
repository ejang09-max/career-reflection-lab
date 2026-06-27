import { existsSync } from "node:fs";
import path from "node:path";
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { getAssessment } from "@/lib/assessments";
import type { AssessmentResult } from "@/lib/types";
import { EDUCATIONAL_NOTICE } from "@/lib/constants";

let fontRegistered = false;
export const PDF_FONT_MISSING_MESSAGE = "PDF 한글 폰트 파일을 찾을 수 없습니다. public/fonts/NotoSansKR-VF.ttf 또는 NotoSansKR-Regular.ttf 파일을 추가해주세요.";

export function ensureKoreanFontRegistered() {
  if (fontRegistered) return true;

  const variableFont = path.join(process.cwd(), "public", "fonts", "NotoSansKR-VF.ttf");
  const publicRegular = path.join(process.cwd(), "public", "fonts", "NotoSansKR-Regular.ttf");
  const publicBold = path.join(process.cwd(), "public", "fonts", "NotoSansKR-Bold.ttf");

  const regular = existsSync(variableFont) ? variableFont : publicRegular;
  if (!existsSync(regular)) return false;
  const bold = existsSync(publicBold) ? publicBold : regular;

  Font.register({
    family: "NotoSansKR",
    fonts: [
      { src: regular, fontWeight: 400 },
      { src: bold, fontWeight: 700 }
    ]
  });
  fontRegistered = true;
  return true;
}

const baseText = { fontFamily: "NotoSansKR" };

const styles = StyleSheet.create({
  page: { ...baseText, padding: 36, fontSize: 11, lineHeight: 1.6, color: "#0f172a" },
  title: { ...baseText, fontSize: 24, marginBottom: 10, fontWeight: 700 },
  section: { marginTop: 18, paddingTop: 12, borderTop: "1 solid #e2e8f0" },
  heading: { ...baseText, fontSize: 15, marginBottom: 8, fontWeight: 700 },
  row: { flexDirection: "row", justifyContent: "space-between", borderBottom: "1 solid #e2e8f0", paddingVertical: 5 },
  muted: { ...baseText, color: "#475569" },
  pill: { ...baseText, marginTop: 6, padding: 6, backgroundColor: "#eef2ff", color: "#3730a3" },
  scoreBlock: { marginBottom: 8 },
  scoreLabel: { ...baseText, marginBottom: 3, fontSize: 10 },
  scoreTrack: { height: 8, backgroundColor: "#e0f2fe", borderRadius: 4 },
  scoreFill: { height: 8, backgroundColor: "#0ea5e9", borderRadius: 4 }
});

export function ResultPdfDocument({ result }: { result: AssessmentResult }) {
  const topThree = [result.primaryType, ...result.secondaryTypes];
  const assessment = getAssessment(result.assessmentCode);
  const perspectives = [
    "흥미: 내가 관심 있고 좋아하는 활동",
    "가치: 내가 중요하게 여기는 기준",
    "역량: 내가 잘하거나 잘할 수 있는 것",
    "준비도: 변화 속에서 진로를 준비하고 실행하는 힘"
  ];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>진로설계 나침반 결과 리포트</Text>
        <Text>이름: {result.studentName}</Text>
        <Text>이메일: {result.studentEmail}</Text>
        <Text>진단도구명: {result.assessmentTitle}</Text>
        <Text>검사일: {new Date(result.createdAt).toLocaleString("ko-KR")}</Text>
        {assessment && (
          <View style={styles.section}>
            <Text style={styles.heading}>진단 관점</Text>
            <Text>{assessment.order}. {assessment.title}</Text>
            <Text>카드 라벨: {assessment.label}</Text>
            <Text>{assessment.perspectiveDescription}</Text>
            <Text>핵심 질문: {assessment.keyQuestion}</Text>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.heading}>진단 안내</Text>
          <Text style={styles.muted}>{EDUCATIONAL_NOTICE}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>대표 결과</Text>
          <Text>{result.primaryType.typeName} · {result.primaryType.rawScore}/{result.primaryType.maxScore}점 · {result.primaryType.percentage}%</Text>
          <Text style={styles.muted}>{result.summary}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>상위 3개 유형</Text>
          {topThree.map((type, index) => <Text key={type.typeCode}>{index + 1}. {type.typeName} ({type.percentage}%)</Text>)}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>유형별 점수 그래프</Text>
          {result.allTypes.map((type) => (
            <View key={type.typeCode} style={styles.scoreBlock}>
              <Text style={styles.scoreLabel}>{type.typeName} · {type.rawScore}/{type.maxScore}점 · {type.percentage}%</Text>
              <View style={styles.scoreTrack}>
                <View style={{ ...styles.scoreFill, width: `${type.percentage}%` }} />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>진로탐색 4가지 관점</Text>
          {perspectives.map((item) => <Text key={item} style={assessment && item.startsWith(assessment.perspective) ? styles.pill : undefined}>{item}</Text>)}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>유형별 점수표</Text>
          {result.allTypes.map((type) => (
            <View key={type.typeCode} style={styles.row}>
              <Text>{type.typeName}</Text>
              <Text>{type.rawScore}/{type.maxScore} · {type.percentage}%</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>결과 해석</Text>
          <Text>{result.primaryType.description}</Text>
          {result.primaryType.cautions.map((caution) => <Text key={caution}>- {caution}</Text>)}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>추천 활동</Text>
          {result.primaryType.recommendedActivities.map((activity) => <Text key={activity}>- {activity}</Text>)}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>성찰 질문</Text>
          {result.reflectionQuestions.map((question) => <Text key={question}>- {question}</Text>)}
        </View>
        <View style={styles.section}>
          <Text>본 진단은 교육용 자기이해 도구입니다.</Text>
        </View>
      </Page>
    </Document>
  );
}
