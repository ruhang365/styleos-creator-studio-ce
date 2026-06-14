-- StyleOS Alpha preflight script for the existing ruhang365 Supabase Project.
--
-- This preflight script is intended for syntax/dependency checking only.
-- It rolls back all changes at the end.
-- Do not replace the final migration with this script.
--
-- DRAFT ONLY: run only after review, in Supabase SQL Editor, by a maintainer.
-- This script must not modify existing public tables.

begin;

create schema if not exists styleos;

grant usage on schema styleos to authenticated;
grant usage on schema styleos to service_role;

create or replace function styleos.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists styleos.services (
  id uuid primary key default gen_random_uuid(),
  creator_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  module text not null default 'hairstyle',
  description text,
  price_note text,
  delivery_format text,
  status text not null default 'active',
  intake_token text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_module_check check (module in ('hairstyle')),
  constraint services_status_check check (status in ('active', 'paused', 'archived'))
);

create table if not exists styleos.fan_cases (
  id uuid primary key default gen_random_uuid(),
  creator_user_id uuid not null references auth.users(id) on delete cascade,
  service_id uuid not null references styleos.services(id) on delete cascade,
  fan_alias text,
  target_scenario text,
  status text not null default 'intake_submitted',
  intake jsonb not null default '{}'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  selected_rule_ids text[] not null default '{}',
  share_token text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fan_cases_status_check check (
    status in (
      'intake_submitted',
      'tagging',
      'rule_matching',
      'report_draft',
      'creator_review',
      'delivered',
      'feedback_received',
      'candidate_extracted',
      'archived'
    )
  )
);

create table if not exists styleos.reports (
  id uuid primary key default gen_random_uuid(),
  creator_user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid not null references styleos.fan_cases(id) on delete cascade,
  share_token text not null unique,
  markdown text,
  barber_brief jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reports_status_check check (status in ('draft', 'delivered', 'archived'))
);

create table if not exists styleos.feedback (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references styleos.reports(id) on delete cascade,
  case_id uuid not null references styleos.fan_cases(id) on delete cascade,
  score integer,
  easy_to_understand boolean,
  most_useful text,
  will_use_barber_brief boolean,
  shown_to_hairstylist boolean,
  feedback_text text,
  consent_to_anonymized_learning boolean not null default false,
  created_at timestamptz not null default now(),
  constraint feedback_score_check check (score is null or (score >= 1 and score <= 5))
);

create table if not exists styleos.candidate_knowledge (
  id uuid primary key default gen_random_uuid(),
  creator_user_id uuid not null references auth.users(id) on delete cascade,
  source_case_id uuid references styleos.fan_cases(id) on delete set null,
  feature_tags jsonb not null default '[]'::jsonb,
  scenario_tags jsonb not null default '[]'::jsonb,
  constraints jsonb not null default '[]'::jsonb,
  selected_rule_ids text[] not null default '{}',
  recommendation_summary text,
  execution_card_summary text,
  avoid_list jsonb not null default '[]'::jsonb,
  user_feedback_score integer,
  creator_feedback text,
  execution_status text,
  reuse_potential text,
  anonymization_status text not null default 'pending',
  consent_status text not null default 'unknown',
  review_status text not null default 'pending',
  evidence_level text not null default 'E0',
  pro_candidate boolean not null default false,
  public_rule_candidate boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_knowledge_user_feedback_score_check check (
    user_feedback_score is null or (user_feedback_score >= 1 and user_feedback_score <= 5)
  ),
  constraint candidate_knowledge_anonymization_status_check check (
    anonymization_status in ('pending', 'anonymized', 'rejected')
  ),
  constraint candidate_knowledge_consent_status_check check (
    consent_status in ('unknown', 'granted', 'denied')
  ),
  constraint candidate_knowledge_review_status_check check (
    review_status in (
      'pending',
      'under_review',
      'public_rule_candidate',
      'pro_candidate',
      'rejected',
      'archived'
    )
  ),
  constraint candidate_knowledge_evidence_level_check check (
    evidence_level in ('E0', 'E1', 'E2', 'E3', 'E4', 'E5')
  )
);

create table if not exists styleos.consent_records (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references styleos.fan_cases(id) on delete cascade,
  report_id uuid references styleos.reports(id) on delete cascade,
  consent_type text not null,
  consent_value boolean not null,
  consent_note text,
  created_at timestamptz not null default now(),
  constraint consent_records_subject_check check (case_id is not null or report_id is not null)
);

create trigger set_updated_at
before update on styleos.services
for each row execute function styleos.set_updated_at();

create trigger set_updated_at
before update on styleos.fan_cases
for each row execute function styleos.set_updated_at();

create trigger set_updated_at
before update on styleos.reports
for each row execute function styleos.set_updated_at();

create trigger set_updated_at
before update on styleos.candidate_knowledge
for each row execute function styleos.set_updated_at();

grant select, insert, update, delete on all tables in schema styleos to authenticated;
grant select, insert, update, delete on all tables in schema styleos to service_role;

alter default privileges in schema styleos
grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema styleos
grant select, insert, update, delete on tables to service_role;

create index if not exists services_creator_user_id_idx
on styleos.services (creator_user_id);

create unique index if not exists services_intake_token_idx
on styleos.services (intake_token);

create index if not exists fan_cases_creator_user_id_idx
on styleos.fan_cases (creator_user_id);

create index if not exists fan_cases_service_id_idx
on styleos.fan_cases (service_id);

create index if not exists fan_cases_status_idx
on styleos.fan_cases (status);

create unique index if not exists fan_cases_share_token_idx
on styleos.fan_cases (share_token)
where share_token is not null;

create index if not exists reports_creator_user_id_idx
on styleos.reports (creator_user_id);

create index if not exists reports_case_id_idx
on styleos.reports (case_id);

create unique index if not exists reports_share_token_idx
on styleos.reports (share_token);

create index if not exists feedback_report_id_idx
on styleos.feedback (report_id);

create index if not exists feedback_case_id_idx
on styleos.feedback (case_id);

create index if not exists candidate_knowledge_creator_user_id_idx
on styleos.candidate_knowledge (creator_user_id);

create index if not exists candidate_knowledge_source_case_id_idx
on styleos.candidate_knowledge (source_case_id);

create index if not exists candidate_knowledge_review_status_idx
on styleos.candidate_knowledge (review_status);

create index if not exists candidate_knowledge_pro_candidate_idx
on styleos.candidate_knowledge (pro_candidate);

create index if not exists candidate_knowledge_public_rule_candidate_idx
on styleos.candidate_knowledge (public_rule_candidate);

alter table styleos.services enable row level security;
alter table styleos.fan_cases enable row level security;
alter table styleos.reports enable row level security;
alter table styleos.feedback enable row level security;
alter table styleos.candidate_knowledge enable row level security;
alter table styleos.consent_records enable row level security;

create policy "authenticated creator can select own services"
on styleos.services
for select
to authenticated
using (creator_user_id = (select auth.uid()));

create policy "authenticated creator can insert own services"
on styleos.services
for insert
to authenticated
with check (creator_user_id = (select auth.uid()));

create policy "authenticated creator can update own services"
on styleos.services
for update
to authenticated
using (creator_user_id = (select auth.uid()))
with check (creator_user_id = (select auth.uid()));

create policy "authenticated creator can delete own services"
on styleos.services
for delete
to authenticated
using (creator_user_id = (select auth.uid()));

create policy "creator can select own cases"
on styleos.fan_cases
for select
to authenticated
using (creator_user_id = (select auth.uid()));

create policy "creator can insert own cases"
on styleos.fan_cases
for insert
to authenticated
with check (
  creator_user_id = (select auth.uid())
  and exists (
    select 1
    from styleos.services
    where services.id = fan_cases.service_id
      and services.creator_user_id = (select auth.uid())
  )
);

create policy "creator can update own cases"
on styleos.fan_cases
for update
to authenticated
using (creator_user_id = (select auth.uid()))
with check (creator_user_id = (select auth.uid()));

create policy "creator can delete own cases"
on styleos.fan_cases
for delete
to authenticated
using (creator_user_id = (select auth.uid()));

create policy "creator can select own reports"
on styleos.reports
for select
to authenticated
using (creator_user_id = (select auth.uid()));

create policy "creator can insert own reports"
on styleos.reports
for insert
to authenticated
with check (
  creator_user_id = (select auth.uid())
  and exists (
    select 1
    from styleos.fan_cases
    where fan_cases.id = reports.case_id
      and fan_cases.creator_user_id = (select auth.uid())
  )
);

create policy "creator can update own reports"
on styleos.reports
for update
to authenticated
using (creator_user_id = (select auth.uid()))
with check (creator_user_id = (select auth.uid()));

create policy "creator can delete own reports"
on styleos.reports
for delete
to authenticated
using (creator_user_id = (select auth.uid()));

create policy "creator can select feedback for own cases or reports"
on styleos.feedback
for select
to authenticated
using (
  exists (
    select 1
    from styleos.fan_cases
    where fan_cases.id = feedback.case_id
      and fan_cases.creator_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from styleos.reports
    where reports.id = feedback.report_id
      and reports.creator_user_id = (select auth.uid())
  )
);

create policy "creator can insert feedback for own cases or reports"
on styleos.feedback
for insert
to authenticated
with check (
  exists (
    select 1
    from styleos.fan_cases
    where fan_cases.id = feedback.case_id
      and fan_cases.creator_user_id = (select auth.uid())
  )
  and exists (
    select 1
    from styleos.reports
    where reports.id = feedback.report_id
      and reports.creator_user_id = (select auth.uid())
  )
);

create policy "creator can select own candidate knowledge"
on styleos.candidate_knowledge
for select
to authenticated
using (creator_user_id = (select auth.uid()));

create policy "creator can insert own candidate knowledge"
on styleos.candidate_knowledge
for insert
to authenticated
with check (creator_user_id = (select auth.uid()));

create policy "creator can update own candidate knowledge"
on styleos.candidate_knowledge
for update
to authenticated
using (creator_user_id = (select auth.uid()))
with check (creator_user_id = (select auth.uid()));

create policy "creator can delete own candidate knowledge"
on styleos.candidate_knowledge
for delete
to authenticated
using (creator_user_id = (select auth.uid()));

create policy "creator can select consent records linked to own cases or reports"
on styleos.consent_records
for select
to authenticated
using (
  exists (
    select 1
    from styleos.fan_cases
    where fan_cases.id = consent_records.case_id
      and fan_cases.creator_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from styleos.reports
    where reports.id = consent_records.report_id
      and reports.creator_user_id = (select auth.uid())
  )
);

create policy "creator can insert consent records linked to own cases or reports"
on styleos.consent_records
for insert
to authenticated
with check (
  exists (
    select 1
    from styleos.fan_cases
    where fan_cases.id = consent_records.case_id
      and fan_cases.creator_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from styleos.reports
    where reports.id = consent_records.report_id
      and reports.creator_user_id = (select auth.uid())
  )
);

rollback;
