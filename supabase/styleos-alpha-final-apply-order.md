# StyleOS Alpha Final Apply Order

This guide defines the intended manual execution order for the StyleOS Alpha SQL draft. Do not execute any step until the SQL has been reviewed and the maintainer understands the blast radius.

## Before Execution

1. Confirm the Supabase Project is the existing ruhang365 Project.
2. Confirm a current backup exists.
3. Confirm there is currently no `styleos` schema.
4. Confirm the SQL will not modify existing `public` tables.
5. Confirm only an authorized maintainer is executing the SQL.
6. Confirm the service role key will not enter frontend code.

## Execution Order

1. Run [styleos-alpha-preflight.sql](styleos-alpha-preflight.sql), then confirm the final `rollback` leaves no `styleos` schema or objects behind.
2. Run [styleos-alpha-schema.sql](styleos-alpha-schema.sql).
3. Run [styleos-alpha-indexes.sql](styleos-alpha-indexes.sql).
4. Run [styleos-alpha-rls.sql](styleos-alpha-rls.sql).
5. Run [styleos-alpha-verify.sql](styleos-alpha-verify.sql).
6. In Supabase API settings, confirm whether the `styleos` schema must be exposed for the intended access path.
7. Configure frontend and server environment variables without committing secrets.
8. Proceed to Creator Studio CE cloud persistence work only after verification passes.

If any step fails, stop immediately. Do not continue to the next step until the failure is understood, reviewed, and resolved.

## Success Criteria

- `styleos` schema exists after final apply.
- Six expected `styleos` tables exist.
- RLS is enabled on every `styleos` table.
- Policies exist for authenticated creator-owned access.
- `anon` does not have broad table privileges.
- No sensitive personal fields are present.
- `intake_token` and `share_token` columns exist where expected.

## Stop Conditions

- The project is not the ruhang365 Supabase Project.
- Backup status is unknown.
- `styleos` schema already exists and has not been reviewed.
- Any query attempts to modify `public` tables.
- Any grant gives `anon` broad table access.
- Any service role key is planned for frontend use.
