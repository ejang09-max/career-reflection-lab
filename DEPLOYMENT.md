# Deployment Guide

이 문서는 “진로설계 나침반”을 GitHub에 올리고 Vercel에서 배포 링크를 만드는 절차를 설명합니다.

## 1. 배포 전체 흐름

```text
로컬에서 build 확인
→ GitHub 저장소 생성
→ 로컬 프로젝트를 GitHub에 push
→ Vercel에서 GitHub 저장소 Import
→ 환경변수 설정
→ Deploy
→ 배포 링크 확인
```

## 2. 배포 전 확인

PowerShell에서 프로젝트 폴더로 이동합니다.

```powershell
cd "C:\Users\ejang\OneDrive\바탕 화면\문서\진로탐색툴 만들기"
```

패키지 설치:

```powershell
npm.cmd install
```

로컬 실행:

```powershell
npm.cmd run dev
```

브라우저에서 확인:

```text
http://localhost:3000
```

배포 전 빌드 확인:

```powershell
npm.cmd run build
```

빌드가 성공해야 Vercel 배포도 안정적으로 진행됩니다.

## 3. GitHub 저장소 만들기

1. https://github.com 접속
2. 로그인
3. 오른쪽 위 `+` 버튼 클릭
4. `New repository` 선택
5. Repository name 입력: `career-reflection-lab`
6. Public 또는 Private 선택
7. `Add a README file`은 체크하지 않음
8. `Create repository` 클릭

## 4. GitHub에 코드 올리기

PowerShell에서 프로젝트 폴더로 이동합니다.

```powershell
cd "C:\Users\ejang\OneDrive\바탕 화면\문서\진로탐색툴 만들기"
```

Git 초기화:

```powershell
git init
```

파일 추가:

```powershell
git add .
```

커밋:

```powershell
git commit -m "Initial commit: career reflection assessment app"
```

브랜치 이름 변경:

```powershell
git branch -M main
```

GitHub 원격 저장소 연결:

```powershell
git remote add origin https://github.com/사용자아이디/career-reflection-lab.git
```

GitHub로 push:

```powershell
git push -u origin main
```

이미 origin이 있다고 오류가 나면:

```powershell
git remote set-url origin https://github.com/사용자아이디/career-reflection-lab.git
git push -u origin main
```

## 5. Vercel에 GitHub 저장소 연결하기

1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. `Add New...` 또는 `New Project` 클릭
4. GitHub 저장소 목록에서 `career-reflection-lab` 선택
5. Framework Preset이 `Next.js`인지 확인
6. Build Command는 기본값 사용
7. 필요한 경우 Environment Variables 입력
8. `Deploy` 클릭
9. 배포 완료 후 생성된 주소 복사

예상 주소:

```text
https://career-reflection-lab.vercel.app
```

## 6. 환경변수 설정하기

### mock 기반으로만 테스트할 경우

필수 환경변수는 없습니다.

### 실제 이메일 발송을 할 경우

Vercel Project Settings → Environment Variables에 아래 값을 입력합니다.

```env
RESEND_API_KEY=
FROM_EMAIL=
NEXT_PUBLIC_APP_URL=https://배포된주소.vercel.app
```

### 실제 Supabase 저장까지 할 경우

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

환경변수 설정 후에는 Vercel에서 Redeploy가 필요합니다. 로컬에서는 `.env.local` 수정 후 개발 서버를 재시작해야 합니다.

## 7. 배포 후 테스트하기

1. 첫 화면이 열리는지
2. 이름과 이메일 입력이 되는지
3. `/select`에서 6개 진단 카드가 보이는지
4. 카드 제목 앞에 1~6 번호가 붙는지
5. 카드 라벨 badge가 보이는지
6. 문항 수/결과 예시 박스가 제거되었는지
7. 시작하기 버튼이 작동하는지
8. 완료 이력이 없는 진단의 결과보기 버튼이 비활성화되는지
9. 진단 완료 후 결과보기 버튼이 활성화되는지
10. 5개 단위 문항 응답이 되는지
11. 결과 페이지가 표시되는지
12. PDF 다운로드가 되는지
13. 이메일 버튼이 mock 또는 실제 상태를 명확히 안내하는지
14. 모바일에서도 화면이 깨지지 않는지

## 8. 자주 발생하는 오류와 해결 방법

### 오류: npm이 인식되지 않음

해결: Node.js 설치 후 PowerShell을 새로 엽니다.

### 오류: PowerShell에서 npm.ps1 실행이 막힘

해결:

```powershell
npm.cmd install
npm.cmd run dev
```

또는:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### 오류: git 명령어가 인식되지 않음

해결: Git for Windows 설치 후 PowerShell을 새로 엽니다.

### 오류: npm.cmd run build 실패

해결: 터미널 오류 메시지를 확인하고 TypeScript 또는 import 오류를 수정합니다.

### 오류: Vercel 배포 후 PDF 한글 깨짐

해결: `public/fonts` 폴더에 한글 TTF 폰트를 추가하고 `lib/pdf.tsx`의 `Font.register` 설정을 확인합니다.

### 오류: 이메일이 오지 않음

해결:

- mock 발송인지 확인
- `RESEND_API_KEY` 확인
- `FROM_EMAIL` 확인
- Resend 발신 이메일 또는 도메인 인증 확인
- Vercel 환경변수 설정 후 Redeploy

## 9. 현재 남아 있는 제한사항

### PDF 한글 폰트

PDF 한글 표시를 위해 한글 폰트 파일이 필요할 수 있습니다.

사용자가 해야 할 일:

- `public/fonts` 폴더에 한글 TTF 폰트 파일 추가
- 예: `NotoSansKR-Regular.ttf`, `NotoSansKR-Bold.ttf`
- 폰트 파일명과 코드의 `Font.register` 경로가 일치하는지 확인
- 배포 후 PDF 다운로드 테스트

### 실제 이메일 발송

현재 환경변수가 없으면 mock 발송으로 작동합니다.

사용자가 해야 할 일:

- Resend 가입
- API Key 생성
- 발신 이메일 또는 도메인 인증
- `.env.local` 또는 Vercel Environment Variables에 값 입력
- 서버 재시작 또는 Vercel Redeploy
- 실제 메일 수신 테스트

### 데이터 저장

현재 Supabase가 연결되어 있지 않으면 결과는 브라우저 localStorage에 저장됩니다.

제한:

- 같은 브라우저에서만 결과보기 가능
- 다른 PC나 스마트폰에서는 이전 결과가 보이지 않을 수 있음
- 브라우저 데이터를 삭제하면 결과도 사라질 수 있음

사용자가 해야 할 일:

- 실제 학생 결과를 장기 저장하려면 Supabase 연결 필요
- Supabase 프로젝트 생성
- 테이블 생성
- 환경변수 입력
- 저장/조회 로직을 Supabase 기반으로 전환

### GitHub/Vercel 작업

Codex가 직접 GitHub/Vercel에 로그인하거나 버튼을 대신 클릭하지 못할 수 있습니다.

사용자가 해야 할 일:

- GitHub 저장소 직접 생성
- PowerShell에서 git 명령어 실행
- Vercel에서 프로젝트 직접 Import
- Deploy 버튼 클릭
- 배포 URL 확인

### 진단도구의 성격

현재 문항은 교육용 간이 진단 문항입니다.

제한:

- 표준화된 심리검사나 공식 적성검사가 아님
- 결과는 상담과 자기이해를 위한 참고자료
- 능력이나 적성을 확정적으로 판단하면 안 됨

사용자가 해야 할 일:

- 수업이나 상담에서 교육용 도구임을 안내
- 필요 시 문항 타당도 검토
- 학생 피드백을 바탕으로 문항 수정

## 10. 사용자가 직접 해야 할 작업

1. Node.js 설치 여부 확인
2. Git for Windows 설치 여부 확인
3. `npm.cmd run build`로 로컬 빌드 확인
4. GitHub 저장소 생성
5. git 명령어로 코드 push
6. Vercel에서 GitHub 저장소 Import
7. 필요한 환경변수 입력
8. Deploy 클릭
9. 배포 URL에서 주요 화면 테스트
