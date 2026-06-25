# Career Reflection Lab

한글 서비스명: **진로설계 나침반**

## 1. 프로젝트 소개

“진로설계 나침반”은 대학생이 흥미, 가치, 역량, 준비도를 바탕으로 자신의 진로 방향을 입체적으로 탐색하도록 돕는 교육용 웹앱입니다.

포함 진단:

1. Holland RIASEC 직업흥미진단
2. 가치진단
3. Schein 경력닻 진단
4. 스킬진단
5. 다중지능진단
6. 진로적응성 진단

본 진단은 진로상담 및 자기이해를 돕기 위한 교육용 도구이며, 개인의 능력이나 적성을 확정적으로 판단하는 검사가 아닙니다.

## 2. 로컬 실행 방법

PowerShell에서 프로젝트 폴더로 이동:

```powershell
cd "C:\Users\ejang\OneDrive\바탕 화면\문서\진로탐색툴 만들기"
```

설치:

```powershell
npm.cmd install
```

실행:

```powershell
npm.cmd run dev
```

브라우저에서 접속:

```text
http://localhost:3000
```

일반적으로는 아래 명령도 사용할 수 있습니다.

```powershell
npm install
npm run dev
```

## 3. 빌드 확인

배포 전 아래 명령어로 빌드가 되는지 확인합니다.

```powershell
npm.cmd run build
```

빌드가 성공해야 Vercel 배포도 안정적으로 진행됩니다.

## 4. 환경변수 설정

로컬 개발용 `.env.local` 예시:

```env
RESEND_API_KEY=
FROM_EMAIL=
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

현재 mock 기반으로만 테스트할 경우 필수 환경변수는 없습니다.

실제 이메일 발송을 할 경우:

```env
RESEND_API_KEY=
FROM_EMAIL=
NEXT_PUBLIC_APP_URL=https://배포된주소.vercel.app
```

실제 Supabase 저장까지 할 경우:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

환경변수 수정 후에는 로컬 개발 서버를 재시작해야 합니다. Vercel에서는 Environment Variables를 수정한 뒤 Redeploy가 필요합니다.

## 5. PDF 한글 폰트 설정

PDF에서 한글이 깨지면 `/public/fonts` 폴더에 한글 TTF 폰트를 추가하고, `lib/pdf.tsx`의 `Font.register` 경로를 확인하세요.

권장 파일명:

- `public/fonts/NotoSansKR-Regular.ttf`
- `public/fonts/NotoSansKR-Bold.ttf`

Windows 로컬 개발 환경에서는 폰트 파일이 없을 때 `C:\Windows\Fonts\malgun.ttf`, `C:\Windows\Fonts\malgunbd.ttf`를 fallback으로 사용할 수 있도록 코드가 구성되어 있습니다. 배포 환경에서는 Windows 폰트 경로가 없을 수 있으므로 `public/fonts` 방식이 더 안정적입니다.

## 6. 실제 이메일 발송 설정

실제 이메일 발송을 위해 `.env.local` 또는 Vercel Environment Variables에 다음 값을 넣습니다.

```env
RESEND_API_KEY=
FROM_EMAIL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

주의:

- Resend API Key가 필요합니다.
- 발신 이메일 또는 도메인 인증이 필요합니다.
- 환경변수 수정 후에는 개발 서버를 재시작해야 합니다.
- 환경변수가 없으면 앱은 mock 발송 상태로 작동하며 실제 이메일은 발송되지 않습니다.

## 7. GitHub에 올리는 방법

### GitHub 저장소 만들기

1. https://github.com 접속
2. 로그인
3. 오른쪽 위 `+` 버튼 클릭
4. `New repository` 선택
5. Repository name 입력: `career-reflection-lab`
6. Public 또는 Private 선택
7. `Add a README file`은 체크하지 않음
8. `Create repository` 클릭

### 로컬 프로젝트를 GitHub에 올리기

```powershell
cd "C:\Users\ejang\OneDrive\바탕 화면\문서\진로탐색툴 만들기"
git init
git add .
git commit -m "Initial commit: career reflection assessment app"
git branch -M main
git remote add origin https://github.com/사용자아이디/career-reflection-lab.git
git push -u origin main
```

이미 origin이 있다고 오류가 나면:

```powershell
git remote set-url origin https://github.com/사용자아이디/career-reflection-lab.git
git push -u origin main
```

## 8. Vercel로 배포 링크 만들기

1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. `Add New...` 또는 `New Project` 클릭
4. GitHub 저장소 목록에서 `career-reflection-lab` 선택
5. Framework Preset이 `Next.js`인지 확인
6. Build Command는 기본값 사용
7. 환경변수가 필요하면 Environment Variables에 입력
8. `Deploy` 클릭
9. 배포 완료 후 생성된 주소 복사

예상 주소:

```text
https://career-reflection-lab.vercel.app
```

## 9. 배포 후 확인할 것

1. 첫 화면이 열리는지
2. 이름과 이메일 입력이 되는지
3. `/select`에서 6개 진단 카드가 보이는지
4. 카드가 심플하게 보이는지
5. 문항 수/결과 예시 박스가 제거되었는지
6. 진단 시작이 되는지
7. 5개 단위 문항 응답이 되는지
8. 결과 페이지가 표시되는지
9. 결과보기 버튼이 작동하는지
10. PDF 다운로드가 되는지
11. 이메일 버튼이 mock 또는 실제 상태를 명확히 안내하는지
12. 모바일에서도 화면이 깨지지 않는지

## 10. 남아 있는 제한사항

### PDF 한글 폰트

PDF 한글 표시를 위해 한글 폰트 파일이 필요할 수 있습니다. `public/fonts` 폴더에 `NotoSansKR-Regular.ttf`, `NotoSansKR-Bold.ttf`를 추가하고, 파일명과 `lib/pdf.tsx`의 `Font.register` 경로가 일치하는지 확인하세요.

### 실제 이메일 발송

환경변수가 없으면 mock 발송으로 작동합니다. 실제 발송을 위해 Resend 가입, API Key 생성, 발신 이메일 또는 도메인 인증, 환경변수 입력, 서버 재시작 또는 Vercel Redeploy가 필요합니다.

### 데이터 저장

Supabase가 연결되어 있지 않으면 결과는 브라우저 localStorage에 저장됩니다. 같은 브라우저에서만 결과보기 가능하며, 다른 기기에서는 이전 결과가 보이지 않을 수 있습니다. 브라우저 데이터를 삭제하면 결과도 사라질 수 있습니다.

### GitHub/Vercel 작업

Codex가 직접 GitHub/Vercel에 로그인하거나 버튼을 대신 클릭하지 못할 수 있습니다. 사용자가 GitHub 저장소 생성, git 명령어 실행, Vercel Import, Deploy 버튼 클릭을 직접 진행해야 합니다.

### 진단도구의 성격

현재 문항은 교육용 간이 진단 문항입니다. 표준화된 심리검사나 공식 적성검사가 아니며, 결과는 상담과 자기이해를 위한 참고자료입니다.
