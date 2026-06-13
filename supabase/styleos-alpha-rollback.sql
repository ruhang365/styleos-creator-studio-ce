-- StyleOS Alpha rollback draft.
-- DRAFT ONLY: review manually before running.
--
-- WARNING:
-- Only run rollback in Alpha or after backup.
-- Do not run blindly in production.
--
-- This rollback drops StyleOS Alpha policies, tables, triggers, and helper function.
-- It does not modify existing public tables.
-- `drop schema styleos cascade` is intentionally not used because cascade may delete future objects unexpectedly.

drop policy if exists "creator can insert consent records linked to own cases or reports" on styleos.consent_records;
drop policy if exists "creator can select consent records linked to own cases or reports" on styleos.consent_records;

drop policy if exists "creator can delete own candidate knowledge" on styleos.candidate_knowledge;
drop policy if exists "creator can update own candidate knowledge" on styleos.candidate_knowledge;
drop policy if exists "creator can insert own candidate knowledge" on styleos.candidate_knowledge;
drop policy if exists "creator can select own candidate knowledge" on styleos.candidate_knowledge;

drop policy if exists "creator can insert feedback for own cases or reports" on styleos.feedback;
drop policy if exists "creator can select feedback for own cases or reports" on styleos.feedback;

drop policy if exists "creator can delete own reports" on styleos.reports;
drop policy if exists "creator can update own reports" on styleos.reports;
drop policy if exists "creator can insert own reports" on styleos.reports;
drop policy if exists "creator can select own reports" on styleos.reports;

drop policy if exists "creator can delete own cases" on styleos.fan_cases;
drop policy if exists "creator can update own cases" on styleos.fan_cases;
drop policy if exists "creator can insert own cases" on styleos.fan_cases;
drop policy if exists "creator can select own cases" on styleos.fan_cases;

drop policy if exists "authenticated creator can delete own services" on styleos.services;
drop policy if exists "authenticated creator can update own services" on styleos.services;
drop policy if exists "authenticated creator can insert own services" on styleos.services;
drop policy if exists "authenticated creator can select own services" on styleos.services;

drop trigger if exists set_updated_at on styleos.candidate_knowledge;
drop trigger if exists set_updated_at on styleos.reports;
drop trigger if exists set_updated_at on styleos.fan_cases;
drop trigger if exists set_updated_at on styleos.services;

drop table if exists styleos.consent_records;
drop table if exists styleos.candidate_knowledge;
drop table if exists styleos.feedback;
drop table if exists styleos.reports;
drop table if exists styleos.fan_cases;
drop table if exists styleos.services;

drop function if exists styleos.set_updated_at();

-- Drop the schema only if it is empty.
drop schema if exists styleos;

-- If the schema is not empty, inspect remaining objects before any manual cascade.
-- Do not use `drop schema styleos cascade` without a reviewed backup and object inventory.
