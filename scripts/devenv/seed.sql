-- Synthetic local data for the platform. Not a copy of production: the production
-- Supabase project is INACTIVE and there is no snapshot to restore from.
--
-- The owner's row keeps the real GitHub id, so a local device sign-in lands on this
-- profile. The other two accounts use negative ids, which GitHub never issues, so they
-- can never sign in.
begin;

insert into platform_user (id, github_id, github_login, email, name, plan) values
  ('00000000-0000-4000-8000-000000000001', 190067321, 'SunflowersLwtech', null, 'Local dev (synthetic)', 'free'),
  ('00000000-0000-4000-8000-000000000002', -1001, 'devenv-alice', null, 'Synthetic user A', 'free'),
  ('00000000-0000-4000-8000-000000000003', -1002, 'devenv-bob', null, 'Synthetic user B', 'free');

insert into learning_session (id, user_id, client_id, project, change_summary, question_count, correct_count, started_at, completed_at) values
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'devenv-s101', 'covate', 'Make JSON writes atomic in session storage', 3, 2, now() - interval '3 days', now() - interval '3 days' + interval '6 minutes'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'devenv-s102', 'covate', 'Handle Promise.all failures in the ingest route', 3, 1, now() - interval '2 days', now() - interval '2 days' + interval '8 minutes'),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'devenv-s103', 'covate', 'Narrow the device-flow poll result', 3, 3, now() - interval '1 days', now() - interval '1 days' + interval '5 minutes'),
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000002', 'devenv-s201', 'demo-shop', 'Fix NOT IN over a nullable column', 2, 1, now() - interval '4 days', now() - interval '4 days' + interval '4 minutes'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000002', 'devenv-s202', 'demo-shop', 'Replace any with unknown in the parser', 2, 2, now() - interval '1 days', now() - interval '1 days' + interval '4 minutes'),
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000003', 'devenv-s301', 'demo-api', 'Add a rejection handler to the worker', 2, 0, now() - interval '2 days', now() - interval '2 days' + interval '3 minutes');

insert into quiz_answer (session_id, user_id, question, options, correct_answer, user_answer, is_correct, explanation, topic, concept) values
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'Why write to a temp file and rename it?', '["A","B","C"]', 'B', 'B', true, 'rename is atomic on one filesystem', 'io', 'write-then-rename'),
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'What must run before the rename?', '["A","B","C"]', 'C', 'A', false, 'the data has to reach disk before the name changes', 'io', 'fsync before rename'),
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'Two writers update one file. What breaks?', '["A","B","C"]', 'A', 'A', true, 'the last writer silently wins', 'concurrency', 'lost update'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'What does Promise.all do on the first rejection?', '["A","B","C"]', 'A', 'C', false, 'it rejects immediately, other results are dropped', 'async', 'Promise.all error handling'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'When is a discriminated union narrowed?', '["A","B","C"]', 'B', 'B', true, 'on the literal tag field', 'types', 'discriminated unions'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'Which index helps a partial filter?', '["A","B","C"]', 'C', 'A', false, 'a partial index with the same predicate', 'sql', 'partial index'),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'Why await inside a loop can be slow?', '["A","B","C"]', 'A', 'A', true, 'each iteration waits for the previous one', 'async', 'await in loops'),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'What narrows a union in a switch?', '["A","B","C"]', 'C', 'C', true, 'the case on the tag', 'types', 'narrowing in switch'),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'How to test code that reads the clock?', '["A","B","C"]', 'B', 'B', true, 'inject the clock', 'testing', 'mocking time'),
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000002', 'What does NOT IN return when the list has a NULL?', '["A","B","C"]', 'B', 'B', true, 'no row matches', 'sql', 'NULL in NOT IN'),
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000002', 'Promise.all with one rejection?', '["A","B","C"]', 'A', 'C', false, 'the whole call rejects', 'async', 'Promise.all error handling'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000002', 'Which type forces a check before use?', '["A","B","C"]', 'C', 'C', true, 'unknown', 'types', 'unknown vs any'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000002', 'NULL in NOT IN again', '["A","B","C"]', 'B', 'B', true, 'no row matches', 'sql', 'NULL in NOT IN'),
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000003', 'What happens to an unhandled rejection?', '["A","B","C"]', 'B', 'A', false, 'it is reported and can end the process', 'async', 'unhandled rejection'),
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000003', 'What does a?.b return when a is null?', '["A","B","C"]', 'A', 'C', false, 'undefined', 'types', 'optional chaining');

insert into topic_progress (user_id, topic, total_answered, total_correct, last_seen)
select user_id, topic, count(*), count(*) filter (where is_correct), max(created_at)
from quiz_answer
group by user_id, topic;

commit;
