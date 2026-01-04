## 🗄️ Supabase Şeması

Bu doküman FastAPI backend'inde tanımlanan veri modellerini Supabase (PostgreSQL) üzerinde
nasıl saklayacağımızı tanımlar. Tüm tablolar `public` şemasında yer alır ve kullanıcı
kimliği Supabase `auth.users` tablosu üzerinden yönetilir.

### Genel İlkeler
- Her satır `created_at` ve `updated_at` alanlarıyla versiyonlanır (default `now()`).
- Tüm tablolar için **Row Level Security (RLS)** aktif olmalı; varsayılan politika:
  `user_id = auth.uid()`.
- UUID üreten alanlarda `gen_random_uuid()` kullanılır (pgcrypto eklentisi).
- Uzun metinler için `text`, yapılandırılmış içerikler için ayrı tablolar tercih edildi;
  JSON yalnızca denetim/metadata alanlarında kullanılır.

### 1. Kullanıcı Profili
```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  organization text,
  role text check (role in ('student','advisor','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 2. Şablonlar
```sql
create table public.templates (
  id text primary key,
  name text not null,
  description text,
  version text default '1.0',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.template_sections (
  id uuid primary key default gen_random_uuid(),
  template_id text references public.templates(id) on delete cascade,
  title text not null,
  order_index int not null,
  min_words int default 0,
  max_words int default 0,
  placeholder text,
  has_ai boolean default true,
  unique(template_id, order_index)
);
```

### 3. Projeler
```sql
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null references public.templates(id),
  title text not null,
  applicant_name text,
  research_title text,
  advisor_name text,
  institution text,
  keywords text,
  importance_and_quality text,
  aims_and_objectives text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index projects_user_id_idx on public.projects(user_id);
```

### 4. Proje Yönetimi Tabloları
```sql
create table public.project_work_schedule (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  date_range text,
  activities text,
  responsible text,
  success_criteria_contribution text,
  order_index int default 0
);

create table public.project_risk_management (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  risk text,
  countermeasure text,
  severity text,
  likelihood text,
  order_index int default 0
);

create table public.project_research_facilities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  equipment_type_model text,
  project_usage text,
  availability text,
  order_index int default 0
);
```

### 5. Yaygın Etki
```sql
create table public.project_wide_impact (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  category text not null,
  category_description text,
  outputs text,
  order_index int default 0
);
```

### 6. Bölümler ve Revizyonlar
```sql
create table public.sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  order_index int not null,
  draft_content text default '',
  final_content text,
  last_ai_style text,
  last_ai_word_count int,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, order_index)
);

create table public.section_revisions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references public.sections(id) on delete cascade,
  revision_number int not null,
  content text not null,
  created_by uuid references auth.users(id),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(section_id, revision_number)
);
```

### 7. AI Günlükleri
AI çağrılarını izlemede kullanılacak tablo.
```sql
create table public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references public.sections(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id),
  action text check (action in ('generate','revise')),
  prompt text,
  style text,
  result_preview text,
  word_count int,
  created_at timestamptz default now()
);
```

### 8. Export İşlemleri
```sql
create table public.project_exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id),
  format text check (format in ('docx','pdf')),
  file_url text,
  status text default 'pending',
  error_message text,
  expires_at timestamptz,
  created_at timestamptz default now()
);
```

### 9. RLS Politika Örnekleri
```sql
alter table public.projects enable row level security;
create policy "Users see own projects" on public.projects
  for select using (user_id = auth.uid());
create policy "Users modify own projects" on public.projects
  for all using (user_id = auth.uid());
```

Diğer tüm çocuk tablolar için benzer `using (project_id in (select id from public.projects where user_id = auth.uid()))`
kontrolü uygulanabilir.

---

**Not:** Bu şema mevcut mock veri modeliyle birebir örtüşür. Ek alanlar (ör. Supabase Storage
referansları, paylaşım izinleri, davetler) ilerleyen sprintlerde eklenebilir.



