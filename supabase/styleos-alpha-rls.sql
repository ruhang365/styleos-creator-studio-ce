-- StyleOS Alpha RLS draft.
-- DRAFT ONLY: review manually before running. Do not execute directly in production.
-- Public intake/report/feedback should be handled through server routes and share_token.
-- Do not grant anon broad access to fan_cases, reports, feedback, or candidate_knowledge.

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
