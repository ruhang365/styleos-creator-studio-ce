-- StyleOS Alpha schema draft for the existing ruhang365 Supabase Project.
-- DRAFT ONLY: review manually before running. Do not execute directly in production.
-- This file creates only the styleos schema and StyleOS Alpha tables.
-- It does not modify existing public tables.

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

drop trigger if exists set_updated_at on styleos.services;
create trigger set_updated_at
before update on styleos.services
for each row execute function styleos.set_updated_at();

drop trigger if exists set_updated_at on styleos.fan_cases;
create trigger set_updated_at
before update on styleos.fan_cases
for each row execute function styleos.set_updated_at();

drop trigger if exists set_updated_at on styleos.reports;
create trigger set_updated_at
before update on styleos.reports
for each row execute function styleos.set_updated_at();

drop trigger if exists set_updated_at on styleos.candidate_knowledge;
create trigger set_updated_at
before update on styleos.candidate_knowledge
for each row execute function styleos.set_updated_at();

grant select, insert, update, delete on all tables in schema styleos to authenticated;
grant select, insert, update, delete on all tables in schema styleos to service_role;

alter default privileges in schema styleos
grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema styleos
grant select, insert, update, delete on tables to service_role;

-- Do not grant broad anon access.
-- Public intake, report, and feedback should be implemented through server routes and token validation.
