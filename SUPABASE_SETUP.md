# Supabase 설정 안내

이 문서는 `진로설계 나침반`에서 회원가입, 로그인, 결과 저장, 내 결과 보기를 사용하기 위한 Supabase 설정 절차입니다.

## 1. Supabase 프로젝트 만들기

1. https://supabase.com 에 접속합니다.
2. 로그인 후 `New project`를 선택합니다.
3. 프로젝트 이름과 비밀번호를 입력하고 생성합니다.
4. Project Settings → API에서 아래 값을 확인합니다.
   - Project URL
   - anon public key
   - service_role key

## 2. 로컬 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase anon public key
SUPABASE_SERVICE_ROLE_KEY=Supabase service_role key
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버 전용 값입니다. 클라이언트 코드에 직접 넣지 마세요.

환경변수를 수정한 뒤에는 개발 서버를 재시작해야 합니다.

## 3. SQL 테이블 생성

Supabase Dashboard → SQL Editor에서 아래 SQL을 실행합니다.

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  assessment_code text not null,
  assessment_title text not null,
  primary_type text,
  secondary_types jsonb,
  scores jsonb,
  summary text,
  result_json jsonb not null,
  created_at timestamp with time zone default now()
);
```

## 4. RLS 활성화

```sql
alter table public.profiles enable row level security;
alter table public.assessment_results enable row level security;
```

## 5. profiles 정책

```sql
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);
```

## 6. assessment_results 정책

```sql
create policy "Users can view own assessment results"
on public.assessment_results
for select
using (auth.uid() = user_id);

create policy "Users can insert own assessment results"
on public.assessment_results
for insert
with check (auth.uid() = user_id);

create policy "Users can update own assessment results"
on public.assessment_results
for update
using (auth.uid() = user_id);
```

## 7. Vercel 환경변수 설정

Vercel Dashboard → Project → Settings → Environment Variables에 아래 값을 추가합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase anon public key
SUPABASE_SERVICE_ROLE_KEY=Supabase service_role key
```

환경변수를 추가하거나 수정한 뒤에는 반드시 Redeploy를 실행해야 합니다.

## 8. 배포 후 테스트

1. 회원가입 페이지가 열리는지 확인합니다.
2. 이메일과 비밀번호로 회원가입합니다.
3. 로그인합니다.
4. 진단을 하나 완료합니다.
5. Supabase Table Editor에서 `assessment_results`에 결과가 저장되었는지 확인합니다.
6. `/mypage`에서 결과 목록이 보이는지 확인합니다.
7. 로그아웃 후 다시 로그인해 기존 결과가 보이는지 확인합니다.
8. 다른 계정으로 로그인했을 때 이전 계정의 결과가 보이지 않는지 확인합니다.

## 9. 자주 발생하는 문제

### 회원가입 후 바로 로그인이 안 되는 경우

Supabase Auth의 이메일 인증 설정이 켜져 있을 수 있습니다. Supabase에서 발송한 인증 메일을 확인하거나, 개발 중에는 Auth 설정에서 이메일 인증 방식을 조정할 수 있습니다.

### 결과 저장이 안 되는 경우

환경변수, 테이블 생성 여부, RLS 정책을 확인하세요. 특히 `assessment_results`의 insert 정책에서 `auth.uid() = user_id` 조건이 필요합니다.

### Vercel에서는 로그인되지만 결과 저장이 안 되는 경우

Vercel Environment Variables에 Supabase 값이 들어갔는지 확인하고, 설정 후 Redeploy했는지 확인하세요.

## 10. 현재 제한사항

Supabase가 설정되지 않은 경우 앱은 체험 모드로 계속 작동합니다. 이때 결과는 브라우저 localStorage에만 저장되므로 다른 PC나 모바일에서는 이전 결과가 보이지 않습니다.
