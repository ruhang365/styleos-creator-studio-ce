-- StyleOS Alpha index draft.
-- DRAFT ONLY: review manually before running. Do not execute directly in production.

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
