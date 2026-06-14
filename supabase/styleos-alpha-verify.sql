-- StyleOS Alpha post-apply verification SQL.
-- Run after schema, indexes, and RLS scripts are applied.
-- This file is read-only.

select schema_name
from information_schema.schemata
where schema_name = 'styleos';

select table_schema, table_name
from information_schema.tables
where table_schema = 'styleos'
order by table_name;

select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'styleos'
order by tablename;

select schemaname, tablename, policyname, permissive, roles, cmd
from pg_policies
where schemaname = 'styleos'
order by tablename, policyname;

select schemaname, tablename, indexname
from pg_indexes
where schemaname = 'styleos'
order by tablename, indexname;

select table_schema, table_name, column_name
from information_schema.columns
where table_schema = 'styleos'
  and (
    column_name ilike '%phone%'
    or column_name ilike '%wechat%'
    or column_name ilike '%id_card%'
    or column_name ilike '%address%'
    or column_name ilike '%photo%'
    or column_name ilike '%image%'
    or column_name ilike '%email%'
  )
order by table_name, column_name;

select table_name, column_name
from information_schema.columns
where table_schema = 'styleos'
  and column_name in ('intake_token', 'share_token')
order by table_name;

select grantee, table_schema, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'styleos'
  and grantee in ('authenticated', 'service_role', 'anon')
order by table_name, grantee, privilege_type;
