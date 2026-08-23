SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict oU9UBjbjqc8att1cT6L0sAYZ5BaNrtbeWdncLgmleQZH48wvtbyNvUULeOvaCw3

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") VALUES
	('75235708-69a0-485f-beb7-8b7f723eddd8', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '94ded7df-a94b-4864-acaa-8ebb18003c6e', 's256', 'zAhGcDBozWZyp-YkW_YEQPADYzif_d77TIe2eYXF0bs', 'email', '', '', '2026-07-18 05:53:26.769326+00', '2026-07-18 05:54:18.305986+00', 'email/signup', '2026-07-18 05:54:18.305893+00', NULL, NULL, NULL, NULL, false),
	('0d2507d3-cb3c-4b86-8e4c-bb841d4659ff', '0a808488-af25-49bd-b0ea-405b807aa926', '992827e5-ef18-46a7-aafe-cf61fb6034f8', 's256', 'LGqenQ-pritnFudh7KPmtTU6ErGBCsZIXJN9v9DovZU', 'email', '', '', '2026-07-21 00:55:53.386129+00', '2026-07-21 00:56:19.005966+00', 'email/signup', '2026-07-21 00:56:19.005902+00', NULL, NULL, NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', 'authenticated', 'authenticated', 'kiritokazutobolt@gmail.com', '$2a$10$8rChM6RIuXKSbZ/xCRnfNe2.A0DMjcWMBbpiXfyvEuRmgeVgOVhB.', '2026-07-18 05:54:18.29414+00', NULL, '', '2026-07-18 05:53:26.776693+00', '', NULL, '', '', NULL, '2026-07-22 04:35:49.428721+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "3cca89b0-6e1d-41df-8d65-4818f1380bf6", "email": "kiritokazutobolt@gmail.com", "full_name": "Padang Mahsyar", "email_verified": true, "phone_verified": false}', NULL, '2026-07-18 05:53:26.71204+00', '2026-08-01 10:47:50.104869+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '890f3884-134c-4290-9b84-b0b0dc713bd5', 'authenticated', 'authenticated', 'nucaaeon@gmail.com', '$2a$10$xS7iCTwWD08CKEahXTnw0e2FUTfXEnDySrAxYRmCTGpgrCNTmH28S', '2026-08-01 07:07:07.912825+00', NULL, '', '2026-08-01 07:06:13.011081+00', '', NULL, '', '', NULL, '2026-08-01 07:07:41.762165+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "890f3884-134c-4290-9b84-b0b0dc713bd5", "email": "nucaaeon@gmail.com", "full_name": "Nuca", "email_verified": true, "phone_verified": false}', NULL, '2026-08-01 07:06:12.960738+00', '2026-08-01 07:07:41.783947+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('3cca89b0-6e1d-41df-8d65-4818f1380bf6', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '{"sub": "3cca89b0-6e1d-41df-8d65-4818f1380bf6", "email": "kiritokazutobolt@gmail.com", "full_name": "Padang Mahsyar", "email_verified": true, "phone_verified": false}', 'email', '2026-07-18 05:53:26.759564+00', '2026-07-18 05:53:26.759622+00', '2026-07-18 05:53:26.759622+00', '325c23d4-4c7d-4e44-a5ed-fa36c3679c8c'),
	('890f3884-134c-4290-9b84-b0b0dc713bd5', '890f3884-134c-4290-9b84-b0b0dc713bd5', '{"sub": "890f3884-134c-4290-9b84-b0b0dc713bd5", "email": "nucaaeon@gmail.com", "full_name": "Nuca", "email_verified": true, "phone_verified": false}', 'email', '2026-08-01 07:06:12.998495+00', '2026-08-01 07:06:12.998554+00', '2026-08-01 07:06:12.998554+00', '26f548ea-17c9-4635-b731-ff442a75edf0');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('4e2cefe0-941c-44fb-9338-4aa028f724be', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-18 11:34:34.055924+00', '2026-07-18 22:32:31.29069+00', NULL, 'aal1', NULL, '2026-07-18 22:32:31.290572', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '182.8.162.2', NULL, NULL, NULL, NULL, NULL),
	('8975c217-cbe4-4bf9-a797-e921c6ca5e5d', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-18 22:40:11.644737+00', '2026-07-18 22:40:11.644737+00', NULL, 'aal1', NULL, NULL, 'node', '182.8.162.2', NULL, NULL, NULL, NULL, NULL),
	('0ddde77f-37f0-4118-9d11-b6b3c7f3d175', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-18 22:44:05.510231+00', '2026-07-18 22:44:05.510231+00', NULL, 'aal1', NULL, NULL, 'node', '182.8.162.2', NULL, NULL, NULL, NULL, NULL),
	('58733d75-3659-4c25-a13e-0cc3a73f2b02', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-18 22:46:47.223264+00', '2026-07-18 22:46:47.223264+00', NULL, 'aal1', NULL, NULL, 'node', '182.8.162.2', NULL, NULL, NULL, NULL, NULL),
	('90fe7d95-5f5e-45ac-99d4-73380bda7e7b', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-18 22:51:50.43007+00', '2026-07-18 22:51:50.43007+00', NULL, 'aal1', NULL, NULL, 'node', '182.8.162.2', NULL, NULL, NULL, NULL, NULL),
	('5a317e70-cf7f-4b58-8caa-eef03dc5892f', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-18 22:54:10.801085+00', '2026-07-19 03:08:29.820123+00', NULL, 'aal1', NULL, '2026-07-19 03:08:29.819974', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '182.8.162.2', NULL, NULL, NULL, NULL, NULL),
	('443ede34-f770-4a9d-8b82-795116f060bf', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-19 22:04:24.799753+00', '2026-07-27 11:46:15.132207+00', NULL, 'aal1', NULL, '2026-07-27 11:46:15.132098', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '182.8.162.232', NULL, NULL, NULL, NULL, NULL),
	('45cca4f6-ee34-43c2-b903-8d5f36ee59c9', '890f3884-134c-4290-9b84-b0b0dc713bd5', '2026-08-01 07:07:41.762336+00', '2026-08-01 07:07:41.762336+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '182.8.182.197', NULL, NULL, NULL, NULL, NULL),
	('a7663ae2-62c6-4f5d-92b7-2fb0b5291851', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-18 22:44:44.684165+00', '2026-08-01 07:22:47.37999+00', NULL, 'aal1', NULL, '2026-08-01 07:22:47.379867', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', '182.14.46.218', NULL, NULL, NULL, NULL, NULL),
	('603334a3-f9b6-43ab-b53b-b1b50d293b79', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-20 05:09:21.248853+00', '2026-08-01 07:56:14.237658+00', NULL, 'aal1', NULL, '2026-08-01 07:56:14.237524', 'node', '13.59.199.102', NULL, NULL, NULL, NULL, NULL),
	('c4b84271-ad2a-4971-8805-0743cc21b13a', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-22 04:35:49.429511+00', '2026-08-01 10:47:50.1237+00', NULL, 'aal1', NULL, '2026-08-01 10:47:50.123581', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', '182.8.178.29', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('4e2cefe0-941c-44fb-9338-4aa028f724be', '2026-07-18 11:34:34.077763+00', '2026-07-18 11:34:34.077763+00', 'password', 'cef89955-8fac-49fd-b0b5-3a97da7fa5ac'),
	('8975c217-cbe4-4bf9-a797-e921c6ca5e5d', '2026-07-18 22:40:11.694586+00', '2026-07-18 22:40:11.694586+00', 'password', '62b201ff-9072-42f4-af4c-0f92fdb3d194'),
	('0ddde77f-37f0-4118-9d11-b6b3c7f3d175', '2026-07-18 22:44:05.536872+00', '2026-07-18 22:44:05.536872+00', 'password', '2e086d28-b35a-40a0-a2eb-729f96a6c013'),
	('a7663ae2-62c6-4f5d-92b7-2fb0b5291851', '2026-07-18 22:44:44.711526+00', '2026-07-18 22:44:44.711526+00', 'password', '2abd563a-169d-4681-a7d4-5959712e93f5'),
	('58733d75-3659-4c25-a13e-0cc3a73f2b02', '2026-07-18 22:46:47.234568+00', '2026-07-18 22:46:47.234568+00', 'password', '6303cf47-a3ad-4f7b-b7d8-9e4774b1f0b6'),
	('90fe7d95-5f5e-45ac-99d4-73380bda7e7b', '2026-07-18 22:51:50.456422+00', '2026-07-18 22:51:50.456422+00', 'password', 'ba3b0e78-0579-43fa-97a0-02957d4c86bc'),
	('5a317e70-cf7f-4b58-8caa-eef03dc5892f', '2026-07-18 22:54:10.80988+00', '2026-07-18 22:54:10.80988+00', 'password', '0c51ac67-5d36-4253-9c0e-41bb7d37acc3'),
	('443ede34-f770-4a9d-8b82-795116f060bf', '2026-07-19 22:04:24.872951+00', '2026-07-19 22:04:24.872951+00', 'password', '9d65b6e4-0976-408b-b4f8-e5b94898da34'),
	('603334a3-f9b6-43ab-b53b-b1b50d293b79', '2026-07-20 05:09:21.299746+00', '2026-07-20 05:09:21.299746+00', 'password', '25741429-ff7d-41d8-b857-60f947306193'),
	('c4b84271-ad2a-4971-8805-0743cc21b13a', '2026-07-22 04:35:49.501076+00', '2026-07-22 04:35:49.501076+00', 'password', '778442ca-7d2c-42c2-ace2-1176cfbf4e4e'),
	('45cca4f6-ee34-43c2-b903-8d5f36ee59c9', '2026-08-01 07:07:41.784718+00', '2026-08-01 07:07:41.784718+00', 'email/signup', '4a66aa84-689b-47c8-a017-e7da2e60b537');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 72, 'sipkqiivtuxz', '890f3884-134c-4290-9b84-b0b0dc713bd5', false, '2026-08-01 07:07:41.774831+00', '2026-08-01 07:07:41.774831+00', NULL, '45cca4f6-ee34-43c2-b903-8d5f36ee59c9'),
	('00000000-0000-0000-0000-000000000000', 70, 'ahorgp7d42ob', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-31 03:09:03.078675+00', '2026-08-01 10:47:50.082222+00', 'yr66d7eobxbv', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 9, 'z4ikblzloo2m', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-18 11:34:34.066737+00', '2026-07-18 22:32:19.092509+00', NULL, '4e2cefe0-941c-44fb-9338-4aa028f724be'),
	('00000000-0000-0000-0000-000000000000', 10, 'wcrcofgzy3k5', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-07-18 22:32:19.106736+00', '2026-07-18 22:32:19.106736+00', 'z4ikblzloo2m', '4e2cefe0-941c-44fb-9338-4aa028f724be'),
	('00000000-0000-0000-0000-000000000000', 11, 'tligsweve7we', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-07-18 22:40:11.670446+00', '2026-07-18 22:40:11.670446+00', NULL, '8975c217-cbe4-4bf9-a797-e921c6ca5e5d'),
	('00000000-0000-0000-0000-000000000000', 12, 'n6lnbg7bsolb', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-07-18 22:44:05.530628+00', '2026-07-18 22:44:05.530628+00', NULL, '0ddde77f-37f0-4118-9d11-b6b3c7f3d175'),
	('00000000-0000-0000-0000-000000000000', 14, '5dztwwirg7rs', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-07-18 22:46:47.230984+00', '2026-07-18 22:46:47.230984+00', NULL, '58733d75-3659-4c25-a13e-0cc3a73f2b02'),
	('00000000-0000-0000-0000-000000000000', 15, '2sfncfaqgkhw', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-07-18 22:51:50.449931+00', '2026-07-18 22:51:50.449931+00', NULL, '90fe7d95-5f5e-45ac-99d4-73380bda7e7b'),
	('00000000-0000-0000-0000-000000000000', 16, 'iagelso2zway', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-18 22:54:10.806864+00', '2026-07-19 03:08:28.571455+00', NULL, '5a317e70-cf7f-4b58-8caa-eef03dc5892f'),
	('00000000-0000-0000-0000-000000000000', 17, 'bwfuhrq2xa74', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-07-19 03:08:28.592471+00', '2026-07-19 03:08:28.592471+00', 'iagelso2zway', '5a317e70-cf7f-4b58-8caa-eef03dc5892f'),
	('00000000-0000-0000-0000-000000000000', 18, 'dbralkilxxzz', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-19 22:04:24.838247+00', '2026-07-20 01:30:41.720229+00', NULL, '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 19, 'fdrrpp6npim6', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-20 01:30:41.740447+00', '2026-07-20 03:21:40.66798+00', 'dbralkilxxzz', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 21, 'w5so2dp2hm5k', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-20 05:09:21.279161+00', '2026-07-20 06:18:04.574269+00', NULL, '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 22, 'ghjkyjr7cosq', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-20 06:18:04.593115+00', '2026-07-20 08:24:15.887847+00', 'w5so2dp2hm5k', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 23, 'pryu4pwnbtdv', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-20 08:24:15.906582+00', '2026-07-21 02:31:23.520352+00', 'ghjkyjr7cosq', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 25, 'nx57wrohoado', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-21 02:31:23.53569+00', '2026-07-21 03:31:29.298159+00', 'pryu4pwnbtdv', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 27, 'lxil472lpzlc', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-21 03:31:29.306297+00', '2026-07-21 04:48:58.594863+00', 'nx57wrohoado', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 28, 'uwsbthu35wfg', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-21 04:48:58.616853+00', '2026-07-21 08:03:58.181989+00', 'lxil472lpzlc', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 29, 'falxzign54xw', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-21 08:03:58.196392+00', '2026-07-21 09:23:55.548318+00', 'uwsbthu35wfg', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 20, '3rqn7cihrqim', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-20 03:21:40.684611+00', '2026-07-21 09:41:49.698369+00', 'fdrrpp6npim6', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 30, 'fmayh5hwnick', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-21 09:23:55.564049+00', '2026-07-21 12:41:23.014245+00', 'falxzign54xw', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 31, 'zuhvaofnet24', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-21 09:41:49.712095+00', '2026-07-21 13:23:57.018537+00', '3rqn7cihrqim', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 33, '4iwbgbpgayxk', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-21 13:23:57.034101+00', '2026-07-21 19:14:03.355866+00', 'zuhvaofnet24', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 32, 's5knltbe6whz', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-21 12:41:23.038766+00', '2026-07-22 02:45:47.605496+00', 'fmayh5hwnick', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 34, 'crq5lnajf7bu', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-21 19:14:03.373525+00', '2026-07-22 02:45:55.793996+00', '4iwbgbpgayxk', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 37, 'qvqtitj2hov6', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-22 04:35:49.471316+00', '2026-07-22 06:03:07.571021+00', NULL, 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 35, 'advdcpbnm65x', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-22 02:45:47.622245+00', '2026-07-22 08:15:58.284538+00', 's5knltbe6whz', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 36, 'zwnurernuhat', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-22 02:45:55.795298+00', '2026-07-22 08:16:05.303659+00', 'crq5lnajf7bu', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 38, 'xmjt4ipw6zlo', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-22 06:03:07.594305+00', '2026-07-22 10:01:20.387026+00', 'qvqtitj2hov6', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 40, '7dh2vjhp7f4d', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-22 08:16:05.307071+00', '2026-07-22 23:07:01.039327+00', 'zwnurernuhat', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 42, 'asqpw76mtpfu', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-22 23:07:01.061091+00', '2026-07-23 00:13:10.993741+00', '7dh2vjhp7f4d', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 43, '7n6bkafl3pnh', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-23 00:13:11.012701+00', '2026-07-23 02:27:41.405731+00', 'asqpw76mtpfu', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 44, 'o3hhtjpshkoe', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-23 02:27:41.421058+00', '2026-07-23 04:30:11.464939+00', '7n6bkafl3pnh', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 45, 'ftoupyv7553r', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-23 04:30:11.480553+00', '2026-07-23 09:38:16.266278+00', 'o3hhtjpshkoe', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 46, '5ps7ihnl3t3g', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-23 09:38:16.279699+00', '2026-07-23 17:47:33.948528+00', 'ftoupyv7553r', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 47, '44nen5f4azd5', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-23 17:47:33.974583+00', '2026-07-23 22:00:17.078134+00', '5ps7ihnl3t3g', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 48, 'zrj6oz5zmdhv', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-23 22:00:17.09244+00', '2026-07-23 23:00:48.472143+00', '44nen5f4azd5', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 39, 'apqgunec6ssg', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-22 08:15:58.300994+00', '2026-07-23 23:00:59.175885+00', 'advdcpbnm65x', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 50, 'wsdmt5wppqcy', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-23 23:00:59.176378+00', '2026-07-24 05:52:59.891945+00', 'apqgunec6ssg', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 41, '3kmajbycsyyn', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-22 10:01:20.409371+00', '2026-07-24 09:32:17.454925+00', 'xmjt4ipw6zlo', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 52, 'bavreabziwtx', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-24 09:32:17.479607+00', '2026-07-24 10:36:56.02141+00', '3kmajbycsyyn', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 51, 'op2vo65lyccm', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-24 05:52:59.912724+00', '2026-07-24 10:53:47.673768+00', 'wsdmt5wppqcy', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 49, '4jfx5ogeixfi', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-23 23:00:48.487982+00', '2026-07-24 10:53:51.78452+00', 'zrj6oz5zmdhv', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 54, 'b2stneluehsn', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-24 10:53:47.683985+00', '2026-07-25 02:29:19.913468+00', 'op2vo65lyccm', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 53, 'ffvhw4xh2tgg', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-24 10:36:56.032773+00', '2026-07-25 04:48:47.394318+00', 'bavreabziwtx', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 57, 'ylaouyplieps', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-25 04:48:47.410441+00', '2026-07-25 07:57:34.661116+00', 'ffvhw4xh2tgg', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 58, 'emwl55cib6vc', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-25 07:57:34.679189+00', '2026-07-25 09:37:02.342292+00', 'ylaouyplieps', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 56, 'oe2cp5tuug6b', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-25 02:29:19.941312+00', '2026-07-26 00:07:49.220941+00', 'b2stneluehsn', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 55, 'vt23fwwaanpx', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-24 10:53:51.785102+00', '2026-07-27 11:46:15.088958+00', '4jfx5ogeixfi', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 69, 'yr66d7eobxbv', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-30 21:57:04.602164+00', '2026-07-31 03:09:03.064105+00', 'krhibjkmusub', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 13, 'thgwpthc4adw', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-18 22:44:44.700919+00', '2026-08-01 06:17:23.083143+00', NULL, 'a7663ae2-62c6-4f5d-92b7-2fb0b5291851'),
	('00000000-0000-0000-0000-000000000000', 60, '7cod24xxazjm', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-26 00:07:49.239887+00', '2026-07-26 01:37:54.90475+00', 'oe2cp5tuug6b', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 61, 'w6uubq5hocvr', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-26 01:37:54.916525+00', '2026-07-27 00:46:52.180275+00', '7cod24xxazjm', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 71, '23dh242ryavf', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-08-01 06:17:23.101047+00', '2026-08-01 07:22:47.350836+00', 'thgwpthc4adw', 'a7663ae2-62c6-4f5d-92b7-2fb0b5291851'),
	('00000000-0000-0000-0000-000000000000', 62, 'f3o3jw5zue64', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-27 00:46:52.197946+00', '2026-07-27 03:11:41.699219+00', 'w6uubq5hocvr', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 59, 'rqgwoodmrfok', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-25 09:37:02.356946+00', '2026-07-27 05:52:28.801283+00', 'emwl55cib6vc', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 73, 'hzydjtnkynqy', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-08-01 07:22:47.364621+00', '2026-08-01 07:22:47.364621+00', '23dh242ryavf', 'a7663ae2-62c6-4f5d-92b7-2fb0b5291851'),
	('00000000-0000-0000-0000-000000000000', 65, 'sr6vcbfanqeb', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-07-27 11:46:15.10689+00', '2026-07-27 11:46:15.10689+00', 'vt23fwwaanpx', '443ede34-f770-4a9d-8b82-795116f060bf'),
	('00000000-0000-0000-0000-000000000000', 64, 'wb7atme5qrg7', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-27 05:52:28.816496+00', '2026-07-27 21:11:40.735954+00', 'rqgwoodmrfok', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 63, 'z3pyt7v3ehjs', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-27 03:11:41.711455+00', '2026-08-01 07:56:13.08986+00', 'f3o3jw5zue64', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 66, 'qbywtafxavcg', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-27 21:11:40.758392+00', '2026-07-29 22:07:39.912425+00', 'wb7atme5qrg7', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 74, 'cth2dl2p4eeb', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-08-01 07:56:13.104335+00', '2026-08-01 07:56:13.104335+00', 'z3pyt7v3ehjs', '603334a3-f9b6-43ab-b53b-b1b50d293b79'),
	('00000000-0000-0000-0000-000000000000', 67, 'ciercdtuowkw', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-29 22:07:39.932124+00', '2026-07-30 11:32:12.576621+00', 'qbywtafxavcg', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 75, '3mkr2fqlwzza', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', false, '2026-08-01 10:47:50.098296+00', '2026-08-01 10:47:50.098296+00', 'ahorgp7d42ob', 'c4b84271-ad2a-4971-8805-0743cc21b13a'),
	('00000000-0000-0000-0000-000000000000', 68, 'krhibjkmusub', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', true, '2026-07-30 11:32:12.593541+00', '2026-07-30 21:57:04.584664+00', 'ciercdtuowkw', 'c4b84271-ad2a-4971-8805-0743cc21b13a');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "full_name", "username", "avatar_url", "bio", "home_city", "is_admin", "created_at", "updated_at") VALUES
	('3cca89b0-6e1d-41df-8d65-4818f1380bf6', 'Padang Mahsyar', NULL, NULL, NULL, NULL, true, '2026-07-18 05:53:26.710773+00', '2026-07-18 09:35:54.35523+00'),
	('890f3884-134c-4290-9b84-b0b0dc713bd5', 'Nuca', NULL, NULL, NULL, NULL, true, '2026-08-01 07:06:12.959671+00', '2026-08-01 07:11:26.390967+00');


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: article_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "name", "slug", "icon", "created_at") VALUES
	('6a8ed331-9d52-4c78-a5fa-f6cf22e42127', 'Pantai', 'pantai', 'waves', '2026-07-18 05:52:50.775033+00'),
	('8a888b8d-5abf-4445-9345-2f915c6a6af4', 'Gunung', 'gunung', 'mountain', '2026-07-18 05:52:50.775033+00'),
	('2d6a06fd-57fb-487c-86ad-502e5b93b5d9', 'Air Terjun', 'air-terjun', 'droplets', '2026-07-18 05:52:50.775033+00'),
	('0f899aae-4894-4aa2-a5d8-3ddb5b1f7887', 'Kuliner', 'kuliner', 'utensils', '2026-07-18 05:52:50.775033+00'),
	('be57f13a-8ee9-41f6-a20c-2e94437b615c', 'Budaya & Sejarah', 'budaya-sejarah', 'landmark', '2026-07-18 05:52:50.775033+00'),
	('cf8afde8-c701-4dd9-8705-0dd4bb39fa09', 'Taman & Hutan', 'taman-hutan', 'trees', '2026-07-18 05:52:50.775033+00'),
	('e1967b50-3a83-4e5e-89ee-fc8ba0857331', 'Laut', 'laut', 'laut', '2026-07-21 02:42:16.980139+00'),
	('15b84c3b-f4b3-44e0-b092-d40701f78de3', 'Dermaga', 'dermaga', 'Dermaga', '2026-07-21 03:32:41.333432+00'),
	('f93653a3-585a-4d9b-967c-ef2025e05d9d', 'Penginapan', 'penginapan', 'Penginapan', '2026-07-21 12:41:54.477817+00');


--
-- Data for Name: districts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."districts" ("id", "name", "province", "created_at") VALUES
	('f1a6d994-d14b-471f-bac3-ab5b486ef9a8', 'Samarinda', 'Kalimantan Timur', '2026-07-18 05:52:50.775033+00'),
	('5fd2b89c-908c-4754-9f0b-c4b28b7e9035', 'Balikpapan', 'Kalimantan Timur', '2026-07-18 05:52:50.775033+00'),
	('8639b3c4-8560-4b13-8d2a-7ee145dd7181', 'Kutai Kartanegara', 'Kalimantan Timur', '2026-07-18 05:52:50.775033+00'),
	('9b38db95-e9a2-4813-b03d-38433032338f', 'Yogyakarta', 'Daerah Istimewa Yogyakarta', '2026-07-18 05:52:50.775033+00'),
	('40dc598f-4608-4723-873d-1b82850f8f2d', 'Bandung', 'Jawa Barat', '2026-07-18 05:52:50.775033+00'),
	('b9416b99-f15a-4780-9bb1-13cb8e129b9b', 'Denpasar', 'Bali', '2026-07-18 05:52:50.775033+00'),
	('af74c3cc-fc91-46f7-895c-4ae75f24ffda', 'Kabupaten Aceh Barat', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('9c67fa34-f14b-4230-892a-64be902dcef1', 'Kabupaten Aceh Barat Daya', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('5d28f681-84b5-4fb1-8df1-782d6a1150bc', 'Kabupaten Aceh Besar', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('cd777707-f429-4f19-b72c-468530ab274f', 'Kabupaten Aceh Jaya', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('de001d15-f08e-4f0b-b8e8-d066f9d6d5ab', 'Kabupaten Aceh Selatan', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('eab7d083-b6af-41a4-b573-975a996ca042', 'Kabupaten Aceh Singkil', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('de4e454f-c65b-43f1-b0c1-e247a29911ec', 'Kabupaten Aceh Tamiang', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('2f3a57ad-d4cc-4907-a3f5-8d25c7ce77b0', 'Kabupaten Aceh Tengah', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('4b3ab182-a684-4a8f-a8d9-45c24f408a56', 'Kabupaten Aceh Tenggara', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('8af947fc-9577-4856-99da-ded13fa332ba', 'Kabupaten Aceh Timur', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('9cba08ed-e272-4f49-9a8c-2d7ef03a2646', 'Kabupaten Aceh Utara', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('9830e354-1525-41df-aa62-284597a11aeb', 'Kabupaten Bener Meriah', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('25d247ef-5f36-4e2f-9a32-8455451e053b', 'Kabupaten Bireuen', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('6f7f8af8-8262-4165-b03e-9b9b3dd076c3', 'Kabupaten Gayo Lues', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('586f63b3-55cc-4db6-8d44-d1fed0419900', 'Kabupaten Nagan Raya', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('e7333baa-9f96-47a5-aa52-ca668cd5e5cf', 'Kabupaten Pidie', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('cc1e4360-b9be-4ad2-bb80-8ed354cb87b0', 'Kabupaten Pidie Jaya', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('08da6d1a-32de-495a-9493-b70a35470c8c', 'Kabupaten Simeulue', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('5ccb0984-199d-4b0f-ab58-4e1b16a3ba41', 'Kota Banda Aceh', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('7af30dc6-60ca-450e-ab73-9912fdbdce71', 'Kota Langsa', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('ba4a022a-f409-4e3a-aa7d-db920693bb38', 'Kota Lhokseumawe', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('27c10a51-c953-43b9-9090-5280c8953226', 'Kota Sabang', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('9ab2cbb1-b2bf-4b81-95f1-efc97e5a22b3', 'Kota Subulussalam', 'Aceh', '2026-07-18 10:59:43.438847+00'),
	('fb3e316d-9d8e-45e8-9e9c-ee97a1508eb8', 'Kabupaten Asahan', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('1869f1c2-a82e-4b86-bca2-1f1188e59d98', 'Kabupaten Batubara', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('b9cc50d5-5826-4135-a65a-8a30e01d41f2', 'Kabupaten Dairi', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('c663ca61-40ce-40a6-8b3b-14d4d12b9d3f', 'Kabupaten Deli Serdang', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('9cef8cdd-33ce-4f7e-b005-cda761c4415a', 'Kabupaten Humbang Hasundutan', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('8fbb4e00-fb71-43cf-8a07-e803fead3dc3', 'Kabupaten Karo', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('7ce43656-572c-4655-ba01-6c8fedfbf6c0', 'Kabupaten Labuhanbatu', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('5c184df8-a32c-48ab-907d-ee360dad517c', 'Kabupaten Labuhanbatu Selatan', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('eeb930e0-cd0e-4e63-9607-3c441dbf35f7', 'Kabupaten Labuhanbatu Utara', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('1fe56f85-b688-4163-9bba-9504a900caef', 'Kabupaten Langkat', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('0620a171-1489-43ab-b05b-040d56028405', 'Kabupaten Mandailing Natal', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('b216c02c-3542-4072-9b1c-acde4df787a2', 'Kabupaten Nias', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('d0d73958-e36d-4a2c-a21e-58a5a999b3d6', 'Kabupaten Nias Barat', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('a2d945ce-53cb-4bf9-b83d-9ff21f22b5f9', 'Kabupaten Nias Selatan', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('c178c8cc-ce2e-4412-8a65-a62da50c0373', 'Kabupaten Nias Utara', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('ffd3931e-86fd-4c71-86c7-bf2f3596bb3a', 'Kabupaten Padang Lawas', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('4e61dbe0-de74-4820-87af-85be35acb4c7', 'Kabupaten Padang Lawas Utara', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('bf71fa32-42de-4747-bf6a-8eea1703e08c', 'Kabupaten Pakpak Bharat', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('959804dc-4c4e-472d-b23a-1c9bd28bd317', 'Kabupaten Samosir', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('bc96a9bc-22f0-4dd5-83c6-0cf1fca2d1ac', 'Kabupaten Serdang Bedagai', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('cf500a6f-82ab-47f5-bcf8-e2cc2a70d757', 'Kabupaten Simalungun', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('ee8d0315-4e7d-49ca-8489-d2fcd4ea5ca4', 'Kabupaten Tapanuli Selatan', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('6792e94c-69e9-4538-b135-5228d95e4dfd', 'Kabupaten Tapanuli Tengah', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('f494fb32-0131-4766-9667-f8425943c21c', 'Kabupaten Tapanuli Utara', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('5e7c84a1-5c78-42ba-b627-0e8e484ff9aa', 'Kabupaten Toba Samosir', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('924ac930-d521-435b-a739-9d5973105253', 'Kota Binjai', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('8a449eea-1739-4d46-8b0a-5c539ccb0b8a', 'Kota Gunungsitoli', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('4d6b354d-8f35-4578-8834-eac67636d580', 'Kota Medan', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('e9379dab-8e26-41ea-b09f-6109a49c8264', 'Kota Padangsidempuan', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('726cdd5f-b82c-47a0-93f1-15faba752405', 'Kota Pematangsiantar', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('016bbe38-0a10-44d7-8267-2f8486f2e93d', 'Kota Sibolga', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('649f37d0-41ca-4d84-83ab-0f75d38ecf27', 'Kota Tanjungbalai', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('8e5b118f-f650-4dd5-8653-a6f3ca649bc1', 'Kota Tebing Tinggi', 'Sumatera Utara', '2026-07-18 10:59:43.438847+00'),
	('5baca957-2444-4881-b558-9819e6662abb', 'Kabupaten Agam', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('7f1a32e8-e151-4530-939b-3c8885d7f779', 'Kabupaten Dharmasraya', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('303a6fad-f6be-4bac-bc01-b0a656d9aaee', 'Kabupaten Kepulauan Mentawai', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('2ba1c6f3-a20a-4e29-8564-249da45426ca', 'Kabupaten Lima Puluh Kota', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('789d7e76-5636-4ad6-a212-b9e297de8b60', 'Kabupaten Padang Pariaman', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('1828ccf7-200c-4a55-94c7-0ec619292c56', 'Kabupaten Pasaman', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('8acce370-7efc-4980-b627-855fe8039672', 'Kabupaten Pasaman Barat', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('44fc867c-80fe-4f5f-b647-1b146edab386', 'Kabupaten Pesisir Selatan', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('7148c96e-ea52-418c-bf77-4f48533c027f', 'Kabupaten Sijunjung', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('a85d2c3a-5ec6-4999-9a0f-40736a95eb29', 'Kabupaten Solok', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('2351223a-d394-414e-b462-08665c5321c1', 'Kabupaten Solok Selatan', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('9a9f51cb-2760-4a33-89ca-da359ed625db', 'Kabupaten Tanah Datar', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('be4d8229-240e-4217-a9c6-6b494b3c226a', 'Kota Bukittinggi', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('12afcbf5-6b2e-4dee-820a-50ee93172da9', 'Kota Padang', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('fc09f1ed-453f-4b97-b3b9-b0ea996ad5a6', 'Kota Padangpanjang', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('5bff5a66-e6b6-4772-98ae-562ccdc9f1b5', 'Kota Pariaman', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('1bf599ba-51fa-4dee-9d1c-e584e077becf', 'Kota Payakumbuh', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('13169ace-5805-43c8-9941-7c148c69243d', 'Kota Sawahlunto', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('0bc74fbb-2711-4f6b-955c-3b1f83a00485', 'Kota Solok', 'Sumatera Barat', '2026-07-18 10:59:43.438847+00'),
	('dfdf923d-a85a-479c-8230-c94f99868513', 'Kabupaten Banyuasin', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('e22f6bde-510f-459e-8fe0-ca8e387f8652', 'Kabupaten Empat Lawang', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('e20d2257-2c5e-4fea-ab02-2d0e4d8fde92', 'Kabupaten Lahat', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('edb96982-518b-48dd-8db1-6f973fe1e472', 'Kabupaten Muara Enim', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('67e283d3-c851-493e-818f-2c0404bed6a8', 'Kabupaten Musi Banyuasin', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('5579ad3d-b97b-49a8-b7a5-68bc9d5f6fdc', 'Kabupaten Musi Rawas', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('8c656675-2757-4e2c-8bc2-ab888514f92d', 'Kabupaten Musi Rawas Utara', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('d879387f-0739-40f1-a8ce-e169887a4b4d', 'Kabupaten Ogan Ilir', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('8934032a-f92c-4c98-ae94-39c559ec381b', 'Kabupaten Ogan Komering Ilir', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('40104f0b-fd8a-47d9-9b01-25766c057749', 'Kabupaten Ogan Komering Ulu', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('57762181-0f2d-414a-99ae-8f9e445e75a9', 'Kabupaten Ogan Komering Ulu Selatan', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('aaa36efd-7d7b-4ce9-bee9-e9c951bed5aa', 'Kabupaten Ogan Komering Ulu Timur', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('a7247d10-09a6-42f3-bfb0-e87a291f0de7', 'Kabupaten Penukal Abab Lematang Ilir', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('59326ae8-95bb-4d1e-a12d-a5aefcb23e1c', 'Kota Lubuklinggau', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('688271a6-976f-4d61-b9f1-c2307d9c7b12', 'Kota Pagar Alam', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('24168d33-1079-41d9-92da-88696637b0a2', 'Kota Palembang', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('02f399fc-1f27-46a2-8774-10cb029c060f', 'Kota Prabumulih', 'Sumatera Selatan', '2026-07-18 10:59:43.438847+00'),
	('5fcfdfed-e052-494d-a7dd-d5304ff58c7b', 'Kabupaten Bengkalis', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('7c55d4c7-f4a4-46a2-b5f8-266795f82a91', 'Kabupaten Indragiri Hilir', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('404fee94-0fae-4959-8f58-ed15315f3e9f', 'Kabupaten Indragiri Hulu', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('463192f9-2037-4f1d-a4c5-3355fb733faf', 'Kabupaten Kampar', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('2fa6bf4f-0a77-4a10-8dcc-e2c66df574f2', 'Kabupaten Kepulauan Meranti', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('17b581ea-9f90-456f-9d2b-00ee1f3ee294', 'Kabupaten Kuantan Singingi', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('b257ed18-b21b-4d9b-a1dd-8a5170479d42', 'Kabupaten Pelalawan', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('49b9ee53-636a-4dcf-97eb-6dd56930790f', 'Kabupaten Rokan Hilir', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('94ae6d0e-9e88-479d-81db-8d652b784868', 'Kabupaten Rokan Hulu', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('8e1b1688-9811-43d1-891c-f15940147d81', 'Kabupaten Siak', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('feecfc12-2463-4295-8e3b-5c6cda24d93f', 'Kota Dumai', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('285a08e7-143d-4da9-a963-9962cd987841', 'Kota Pekanbaru', 'Riau', '2026-07-18 10:59:43.438847+00'),
	('aa8df9f5-4ebb-4e2e-81cc-04888ec8d092', 'Kabupaten Bintan', 'Kepulauan Riau', '2026-07-18 10:59:43.438847+00'),
	('7ec38d33-3952-4149-8972-d57f6467cdf9', 'Kabupaten Karimun', 'Kepulauan Riau', '2026-07-18 10:59:43.438847+00'),
	('3d12b1b3-b450-44cd-a37b-9a7088691d0d', 'Kabupaten Kepulauan Anambas', 'Kepulauan Riau', '2026-07-18 10:59:43.438847+00'),
	('7f8e4995-a3c5-41b4-95d2-f78808f7dd27', 'Kabupaten Lingga', 'Kepulauan Riau', '2026-07-18 10:59:43.438847+00'),
	('e5627e06-3699-47fa-a736-e4006b30aac6', 'Kabupaten Natuna', 'Kepulauan Riau', '2026-07-18 10:59:43.438847+00'),
	('b5519d8a-d096-4b71-805d-3d989236f725', 'Kota Batam', 'Kepulauan Riau', '2026-07-18 10:59:43.438847+00'),
	('109c52a3-d9b5-4ca1-82a8-aa3a753d8485', 'Kota Tanjung Pinang', 'Kepulauan Riau', '2026-07-18 10:59:43.438847+00'),
	('ac552dbb-9930-4b79-8ecb-0f03090a7482', 'Kabupaten Batanghari', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('b001007e-bc29-42e7-b1fb-4d89fbb7c6a5', 'Kabupaten Bungo', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('e0596658-5217-4d1f-8d8b-748bd2683731', 'Kabupaten Kerinci', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('1d6c7397-e8a9-4d61-9c7f-71b3ca55110b', 'Kabupaten Merangin', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('576780bc-3863-43e1-a3d4-463f91082073', 'Kabupaten Muaro Jambi', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('6adaccb9-dccf-47fd-b3ef-7c6f8fc39b59', 'Kabupaten Sarolangun', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('5c9ccc39-6621-4cbc-a385-199c0d651a75', 'Kabupaten Tanjung Jabung Barat', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('f97aeebe-e47f-4697-a25f-0057298371d7', 'Kabupaten Tanjung Jabung Timur', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('e72c84e9-bee4-44a6-8f39-724e8005be2c', 'Kabupaten Tebo', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('66903106-0b61-4e15-b96e-feda747169f0', 'Kota Jambi', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('e422b10b-bb80-44d7-8ea4-077a07169bda', 'Kota Sungai Penuh', 'Jambi', '2026-07-18 10:59:43.438847+00'),
	('326ae576-c3cc-4831-964b-221d98a1e173', 'Kabupaten Bengkulu Selatan', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('830dda34-eacb-45ad-a923-1964084b9111', 'Kabupaten Bengkulu Tengah', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('28af6f63-7714-4b2b-87b6-0020a717c2cb', 'Kabupaten Bengkulu Utara', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('7f1bfb9b-d896-4114-8215-ff9e9b80894a', 'Kabupaten Kaur', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('d955d802-1884-4d9a-aebe-bf1f6b9cccc2', 'Kabupaten Kepahiang', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('33c0e27d-d44a-4cb1-85a8-8897e32fddb4', 'Kabupaten Lebong', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('13504e6b-20e2-4261-bff6-d16d33a3f3e2', 'Kabupaten Mukomuko', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('294f7446-fa70-4dcc-8979-a24893ffabc5', 'Kabupaten Rejang Lebong', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('fd6e9356-db12-4e3a-ab71-c16efd96043c', 'Kabupaten Seluma', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('8e3e4c3d-5df5-41fa-b05d-23dd5d740d22', 'Kota Bengkulu', 'Bengkulu', '2026-07-18 10:59:43.438847+00'),
	('722d319c-96a2-4bd4-8bed-a544b42a076e', 'Kabupaten Bangka', 'Kepulauan Bangka Belitung', '2026-07-18 10:59:43.438847+00'),
	('16923190-4d3a-4c61-a80e-bebf40058dc7', 'Kabupaten Bangka Barat', 'Kepulauan Bangka Belitung', '2026-07-18 10:59:43.438847+00'),
	('a10648ca-d598-44b8-a93c-eae1c78609ee', 'Kabupaten Bangka Selatan', 'Kepulauan Bangka Belitung', '2026-07-18 10:59:43.438847+00'),
	('216b0c4f-0034-4750-a11b-931ce2bd115b', 'Kabupaten Bangka Tengah', 'Kepulauan Bangka Belitung', '2026-07-18 10:59:43.438847+00'),
	('83418702-4389-4c98-bf38-d634d18014fb', 'Kabupaten Belitung', 'Kepulauan Bangka Belitung', '2026-07-18 10:59:43.438847+00'),
	('30c080e3-c3ee-46a8-9a73-f9d5d67d729c', 'Kabupaten Belitung Timur', 'Kepulauan Bangka Belitung', '2026-07-18 10:59:43.438847+00'),
	('324de154-7db6-4ff2-a5ed-6d74165fb20d', 'Kota Pangkal Pinang', 'Kepulauan Bangka Belitung', '2026-07-18 10:59:43.438847+00'),
	('d141a15f-67dd-4c25-8103-48aad468c497', 'Kabupaten Lampung Tengah', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('4d3fd648-442a-40ff-9eec-3e4103369b63', 'Kabupaten Lampung Utara', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('2dcccf9a-27f5-403b-9171-193936d08d11', 'Kabupaten Lampung Selatan', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('253c23bb-0416-4ea5-a244-3bf1913df344', 'Kabupaten Lampung Barat', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('d26f1324-0ba5-463b-a025-533069c8a1c3', 'Kabupaten Lampung Timur', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('8d0edf46-057d-4d13-9a0f-7cb519a80431', 'Kabupaten Mesuji', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('39dbb6e8-ca36-46d2-80d0-d7184362648c', 'Kabupaten Pesawaran', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('715e4092-e390-4de9-bf17-bb26f1e505ff', 'Kabupaten Pesisir Barat', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('c578c033-9cc7-41fe-9e6c-288315ed54d3', 'Kabupaten Pringsewu', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('504eaa62-0cf7-4c13-aed1-51e8d11970b0', 'Kabupaten Tulang Bawang', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('a25784e1-9a01-4a45-8582-1de2bc54ff03', 'Kabupaten Tulang Bawang Barat', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('11c3a59a-fba1-43e7-afeb-2cd95015d233', 'Kabupaten Tanggamus', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('c22da53c-6d2f-4fb8-84a4-55b6f69d26ff', 'Kabupaten Way Kanan', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('c0f37269-7ae2-4ae2-bad3-a31c0e73e323', 'Kota Bandar Lampung', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('2e72ac6b-6162-45d2-af2a-7f45f6f3a843', 'Kota Metro', 'Lampung', '2026-07-18 10:59:43.438847+00'),
	('49d31473-954e-4634-af7a-fa14af24ca91', 'Kabupaten Lebak', 'Banten', '2026-07-18 10:59:43.438847+00'),
	('545a0b7a-cb12-4c2d-b62a-43c3e1d54ee3', 'Kabupaten Pandeglang', 'Banten', '2026-07-18 10:59:43.438847+00'),
	('f66e44ec-455a-43f7-823b-0bb60cc8a1ae', 'Kabupaten Serang', 'Banten', '2026-07-18 10:59:43.438847+00'),
	('a61485fb-0694-4e05-86dc-a8a793561525', 'Kabupaten Tangerang', 'Banten', '2026-07-18 10:59:43.438847+00'),
	('f2b26f07-a708-49b5-b83c-fcdc72dd38f9', 'Kota Cilegon', 'Banten', '2026-07-18 10:59:43.438847+00'),
	('49cdc3a5-cf10-420e-b60e-34c44e059018', 'Kota Serang', 'Banten', '2026-07-18 10:59:43.438847+00'),
	('5fba2b2e-d40d-47fe-b926-085c67fbcc21', 'Kota Tangerang', 'Banten', '2026-07-18 10:59:43.438847+00'),
	('6aa4ad34-4610-4323-bd8f-850301211eae', 'Kota Tangerang Selatan', 'Banten', '2026-07-18 10:59:43.438847+00'),
	('8b3d263f-fb1f-49b1-972c-8c7ea721cfdf', 'Kota Administrasi Jakarta Barat', 'DKI Jakarta', '2026-07-18 10:59:43.438847+00'),
	('4e38d1f5-bfb2-462c-951a-27e8a7aa4ee1', 'Kota Administrasi Jakarta Pusat', 'DKI Jakarta', '2026-07-18 10:59:43.438847+00'),
	('297128ee-47b2-4921-890a-48a04c3598f0', 'Kota Administrasi Jakarta Selatan', 'DKI Jakarta', '2026-07-18 10:59:43.438847+00'),
	('04d00c78-6f12-4551-a418-28876413a85f', 'Kota Administrasi Jakarta Timur', 'DKI Jakarta', '2026-07-18 10:59:43.438847+00'),
	('1bd5066b-db11-4b4f-9b22-85a2e72cc37c', 'Kota Administrasi Jakarta Utara', 'DKI Jakarta', '2026-07-18 10:59:43.438847+00'),
	('5f276ef2-e4f4-490e-b7f3-056eaa756f0b', 'Kabupaten Administrasi Kepulauan Seribu', 'DKI Jakarta', '2026-07-18 10:59:43.438847+00'),
	('6f4d1cce-b860-4cbf-8eab-f2a06c380299', 'Kabupaten Bandung', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('ee63e7d0-3fa4-48af-9146-85978e0652b5', 'Kabupaten Bandung Barat', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('b76a3ba2-b555-4007-994a-f635d7eaeb26', 'Kabupaten Bekasi', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('f602278c-3de5-41ab-ac1f-8c70c653b82f', 'Kabupaten Bogor', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('03927657-41ef-4498-9b6d-c1ca7f6bda89', 'Kabupaten Ciamis', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('52b25a6c-e485-4cec-b617-21bbcb95c306', 'Kabupaten Cianjur', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('54870c6f-3d4e-4916-aa6a-155b4def79bf', 'Kabupaten Cirebon', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('ae8f00b3-0827-4ac6-8c54-e83574c8c932', 'Kabupaten Garut', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('7b9e7d4d-a1a2-4fac-8e36-4e0de2b0ee04', 'Kabupaten Indramayu', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('a9c7c9ea-71a7-4cf3-ba18-2cc138febeb8', 'Kabupaten Karawang', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('35dd43dd-d701-4701-bbf3-12d2d647cd70', 'Kabupaten Kuningan', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('3be78232-0f61-445f-8eb1-12a6e6ddbfa2', 'Kabupaten Majalengka', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('32412178-7667-4dde-b019-e109a0b0c995', 'Kabupaten Pangandaran', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('319e37b2-5dd6-444a-8368-144e0d18a9a2', 'Kabupaten Purwakarta', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('824d4529-0cf1-45b1-bcf4-421c0b413aa5', 'Kabupaten Subang', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('6311eaf4-8213-43db-a788-9c747cd95045', 'Kabupaten Sukabumi', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('00d3ef02-824a-4ff4-94c9-d0d087ec447c', 'Kabupaten Sumedang', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('c9f7cf44-ad1b-453f-8d8c-4404c243906d', 'Kabupaten Tasikmalaya', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('e475757e-e1ab-466c-8d77-027ad2a0eb50', 'Kota Bandung', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('0b7bb0cd-f10e-45be-92c8-3a78d214f4cd', 'Kota Banjar', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('9b2c3a46-c7ce-4d87-9f72-6244775c2997', 'Kota Bekasi', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('13e07416-79bd-4531-a48d-a51dbc196358', 'Kota Bogor', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('174cf592-1d31-4eea-bd92-ecacc10346df', 'Kota Cimahi', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('167bdb39-df2b-4ec2-9e79-56aa29bc10b2', 'Kota Cirebon', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('43b941e0-77b0-4363-a7bc-5aa622804407', 'Kota Depok', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('a6bbf0db-e13c-4ef3-9958-c0cf011108f4', 'Kota Sukabumi', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('56bda740-e627-4e23-ab58-55c4dad1626a', 'Kota Tasikmalaya', 'Jawa Barat', '2026-07-18 10:59:43.438847+00'),
	('4698ff53-0b2c-4742-91cc-74d0d0c4f764', 'Kabupaten Banjarnegara', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('87c22cde-81db-43a9-a4c3-f7ed3779dd29', 'Kabupaten Banyumas', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('3fab246e-c0b5-47c8-8483-ce8ab7540d3b', 'Kabupaten Batang', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('818e336b-7475-4cb6-b012-78a37839bfc9', 'Kabupaten Blora', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('9df4fd7f-8a8a-4ebd-a8eb-40355cb56060', 'Kabupaten Boyolali', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('4a7e59c3-9291-46d0-8ea7-ad047792cbd7', 'Kabupaten Brebes', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('30cdd3e8-1db4-4779-9741-e24016c2e411', 'Kabupaten Cilacap', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('d104e1f9-2d49-43ab-bb63-b88c9d5715bd', 'Kabupaten Demak', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('34d77c35-fc3d-42cb-ac62-ce116cb0892a', 'Kabupaten Grobogan', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('bb715bc4-5c6e-4843-a3c8-b6e7d2637dbf', 'Kabupaten Jepara', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('b6a7dedd-bb11-4fef-8128-a04bedbb9f69', 'Kabupaten Karanganyar', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('b05afa96-b1bd-47e5-a4f6-1d784c00948b', 'Kabupaten Kebumen', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('9def4fed-4b4a-4f77-bdf2-02bc7f8e5361', 'Kabupaten Kendal', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('4674a790-b353-49de-83b0-7730e0598b13', 'Kabupaten Klaten', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('6f37e355-569b-430c-be3f-728bb0067e2e', 'Kabupaten Kudus', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('84de332a-9d77-48e9-a7e7-9c5493751a64', 'Kabupaten Magelang', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('90dc1b3d-62d3-4a36-909d-a807d95c4637', 'Kabupaten Pati', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('fe0d9c38-6c05-4f9d-b396-9e13d8131d4a', 'Kabupaten Pekalongan', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('c2a4694f-8f87-4220-8d40-1997771975d1', 'Kabupaten Pemalang', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('84438288-e126-4819-bfbe-a222929d5dd3', 'Kabupaten Purbalingga', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('de528753-60a7-4550-a304-acb3be0b5690', 'Kabupaten Purworejo', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('d9d51721-04a4-40f0-9e9c-2282889b571d', 'Kabupaten Rembang', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('29750cef-b77c-4136-9621-ad1cca3e8df1', 'Kabupaten Semarang', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('1b94835c-d0b8-4780-acc0-f9ffa45dd26a', 'Kabupaten Sragen', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('1e472f9c-0caf-4970-b0da-f914f478e188', 'Kabupaten Sukoharjo', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('fd28ac3a-8c81-4ca5-a4e9-e8f9e177ab02', 'Kabupaten Tegal', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('e4d28955-f303-427b-926b-02d72a2c9f6c', 'Kabupaten Temanggung', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('3138b8c4-b74d-44fd-aba2-7090f0dcd438', 'Kabupaten Wonogiri', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('11519c17-f41b-44d5-99ae-e5ebb450f3b1', 'Kabupaten Wonosobo', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('8132aa07-d79d-4a91-a84b-9dd39fa017d6', 'Kota Magelang', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('bebba4f3-82f1-4d8b-9060-5c2fbcf3b7d4', 'Kota Pekalongan', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('cd28abe2-41e3-48c0-91f2-855a3ed11b37', 'Kota Salatiga', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('77044445-07f7-4e74-b998-833c33f49236', 'Kota Semarang', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('9f2651f7-3420-43f2-8983-e6974bafcb8c', 'Kota Surakarta', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('e99f6864-df4b-49bb-a8ac-22d1627bedfb', 'Kota Tegal', 'Jawa Tengah', '2026-07-18 10:59:43.438847+00'),
	('bfe2a89d-62c9-4670-9901-2c66e2d17a87', 'Kabupaten Bangkalan', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('dd5e6a59-a70a-4029-a312-c7450d66d9e0', 'Kabupaten Banyuwangi', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('2d74c0b4-2413-4e8d-9810-47aae23455a7', 'Kabupaten Blitar', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('861706e4-d410-463f-b58c-4414488bb860', 'Kabupaten Bojonegoro', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('4e3d3d9e-3cbf-4c32-a2d4-bae7206fba52', 'Kabupaten Bondowoso', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('b82ef626-b5d1-471b-be7a-65a393bb3ab9', 'Kabupaten Gresik', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('a0c29c94-6887-4760-b069-0156105f411d', 'Kabupaten Jember', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('056853fb-7fa8-4bac-818f-021309697a79', 'Kabupaten Jombang', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('b2b2ae2f-f1ac-4f7d-a48b-266e0ae5af7e', 'Kabupaten Kediri', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('c5be574d-85fe-43d1-8065-3468856511ac', 'Kabupaten Lamongan', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('b72edcf9-61ad-4edb-b8d4-334d338f9fd8', 'Kabupaten Lumajang', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('9f74877b-7e3c-49da-a4ef-c3e1db5bdde9', 'Kabupaten Madiun', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('6455f5b0-7409-4cb5-b0cd-c59bf5b63032', 'Kabupaten Magetan', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('581f4259-4855-4803-9e5c-ba4a3b6d4965', 'Kabupaten Malang', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('add26921-5525-4a29-a9f5-95b4299a7970', 'Kabupaten Mojokerto', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('155e11f9-f191-4878-902f-c5956dec8139', 'Kabupaten Nganjuk', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('25929436-ac41-43ad-82dc-10f5fb30ad7f', 'Kabupaten Ngawi', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('34f0cc73-366e-4ce3-a18f-8fa6e929e09a', 'Kabupaten Pacitan', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('9cd3312b-6d7e-43cc-b388-af6350016f46', 'Kabupaten Pamekasan', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('c58a7d5d-3c25-4913-b5e8-65a5681aaee7', 'Kabupaten Pasuruan', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('17712fdb-8f87-493f-bc5f-ac67fc6408e5', 'Kabupaten Ponorogo', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('9d07e78b-c52d-4e93-908d-c488cf8af29d', 'Kabupaten Probolinggo', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('79b3fa22-2dbe-4e38-934e-4c1e73e6a49a', 'Kabupaten Sampang', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('5f9bf6e9-96ed-4446-925f-7cfbc02840ef', 'Kabupaten Sidoarjo', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('6f1afb5c-d963-4bbe-8a94-4a2a8b769ff9', 'Kabupaten Situbondo', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('cad8cde0-aaa8-4997-a6e2-10639a7561b6', 'Kabupaten Sumenep', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('69da7631-c275-4e8e-b287-1185d5a81761', 'Kabupaten Trenggalek', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('fb836815-6f11-472d-a216-7a7ca4c4c511', 'Kabupaten Tuban', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('028a6319-8f1c-44fa-a866-ad6e3b5d6e88', 'Kabupaten Tulungagung', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('f35f05df-e504-46ff-ad92-c11b911faf1a', 'Kota Batu', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('71cdbc28-eed4-43bc-b241-fd290c18576d', 'Kota Blitar', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('df19c87c-07b2-4e7e-8b5d-e91ee7e9a0a5', 'Kota Kediri', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('6425fbcd-efa5-4950-8b24-46e90e3aff09', 'Kota Madiun', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('58fd7d54-ad02-4c71-a47a-8a734d8bdb38', 'Kota Malang', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('af1a6900-6a51-461e-b1bb-df56304b0e15', 'Kota Mojokerto', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('d366aa95-0985-4893-b4bc-82642f688979', 'Kota Pasuruan', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('9c4ac594-e232-4ac9-b16f-e1d716a0e944', 'Kota Probolinggo', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('9d597ff0-e872-41dc-a5b0-ac47126eb307', 'Kota Surabaya', 'Jawa Timur', '2026-07-18 10:59:43.438847+00'),
	('3da98f83-ce3d-45a6-a532-db2dc8327c86', 'Kabupaten Bantul', 'Daerah Istimewa Yogyakarta', '2026-07-18 10:59:43.438847+00'),
	('d218b1a0-c615-4294-a0fa-8ff2efe17c7e', 'Kabupaten Gunungkidul', 'Daerah Istimewa Yogyakarta', '2026-07-18 10:59:43.438847+00'),
	('6f39dccc-8dae-44ba-aa03-7c5e801ac97e', 'Kabupaten Kulon Progo', 'Daerah Istimewa Yogyakarta', '2026-07-18 10:59:43.438847+00'),
	('72009ec4-964c-46f4-8e75-99ceade1154e', 'Kabupaten Sleman', 'Daerah Istimewa Yogyakarta', '2026-07-18 10:59:43.438847+00'),
	('60933992-8b41-4c04-846f-b834ebd89dfa', 'Kota Yogyakarta', 'Daerah Istimewa Yogyakarta', '2026-07-18 10:59:43.438847+00'),
	('10cffc3f-4395-468e-b534-e717ed58ccf3', 'Kabupaten Badung', 'Bali', '2026-07-18 10:59:43.438847+00'),
	('6526ab84-4c14-46dd-bcbb-025e3257a339', 'Kabupaten Bangli', 'Bali', '2026-07-18 10:59:43.438847+00'),
	('b3bac768-5f43-4c62-8788-6a4bad51c019', 'Kabupaten Buleleng', 'Bali', '2026-07-18 10:59:43.438847+00'),
	('8ebd9ad4-284d-414b-8a7d-2a09089036e2', 'Kabupaten Gianyar', 'Bali', '2026-07-18 10:59:43.438847+00'),
	('7929e514-55fc-45c3-9c90-ca4ac42b6b9a', 'Kabupaten Jembrana', 'Bali', '2026-07-18 10:59:43.438847+00'),
	('fd7578a1-2895-4502-8dc1-f516f8d6e61d', 'Kabupaten Karangasem', 'Bali', '2026-07-18 10:59:43.438847+00'),
	('0471302c-51cf-4828-9c8a-c7135666618b', 'Kabupaten Klungkung', 'Bali', '2026-07-18 10:59:43.438847+00'),
	('018be03c-8d09-457a-b661-924a2b7c5c3f', 'Kabupaten Tabanan', 'Bali', '2026-07-18 10:59:43.438847+00'),
	('1b9ab74f-c9cf-43be-aa94-cdc84bd83b26', 'Kota Denpasar', 'Bali', '2026-07-18 10:59:43.438847+00'),
	('ea5deb70-5d54-45c4-b643-320940523848', 'Kabupaten Bima', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('04de30b0-c6af-44c5-82cb-49e7087942e0', 'Kabupaten Dompu', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('8237e509-ed11-4f4e-a466-112b1936813f', 'Kabupaten Lombok Barat', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('cccf73f8-4847-4ffd-b780-da59165eeba9', 'Kabupaten Lombok Tengah', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('da20fbb3-ac7f-4b83-a3b2-d71cfed37b53', 'Kabupaten Lombok Timur', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('a6ebb538-aabd-4e77-bc1a-c613b01fb317', 'Kabupaten Lombok Utara', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('39a92344-d06c-417a-bba5-64c6e8158c7c', 'Kabupaten Sumbawa', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('a52564d6-2f1e-48f3-99da-9ad4b68a84fc', 'Kabupaten Sumbawa Barat', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('e26c30a0-37d1-450c-9cb3-5f2c3ba25064', 'Kota Bima', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('65bdb4a4-6549-42cf-8a3b-3794fb37fb38', 'Kota Mataram', 'Nusa Tenggara Barat', '2026-07-18 10:59:43.438847+00'),
	('13b68a88-45c1-4889-aeb7-56d6f2a88bd3', 'Kabupaten Alor', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('e1284142-5380-42d7-aa65-f203d0b45c16', 'Kabupaten Belu', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('63dbcf61-e9d3-44fa-abba-9248ba161f3f', 'Kabupaten Ende', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('0bf139e5-fe72-45f3-adcf-637f4d8b89a4', 'Kabupaten Flores Timur', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('164321a9-562a-4143-a3e2-cccff4d84f03', 'Kabupaten Kupang', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('787538fc-62c8-49f7-8e17-2d81dbd582ed', 'Kabupaten Lembata', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('5271fde7-babc-4c3b-9851-b2a7f8aa89b7', 'Kabupaten Malaka', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('b45aaaf2-197d-49fa-8423-b11ae42eaa48', 'Kabupaten Manggarai', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('33e74c9e-2422-434a-b547-acfa4eca2606', 'Kabupaten Manggarai Barat', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('f52814a3-a020-4a5d-872d-20df864412e0', 'Kabupaten Manggarai Timur', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('9d845f18-f69b-4590-a555-afd6525ba230', 'Kabupaten Ngada', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('ca049a7f-9dd8-4dc5-bc3b-1cd817973437', 'Kabupaten Nagekeo', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('9bf9bae6-2ef0-4192-b182-c3b597251962', 'Kabupaten Rote Ndao', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('81ff99c1-c066-4288-a69a-883ef6f9b10d', 'Kabupaten Sabu Raijua', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('3a7c2beb-cd67-4478-b597-30604feb36ee', 'Kabupaten Sikka', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('70c5290d-0351-4eb6-a221-3fadcf1e5c63', 'Kabupaten Sumba Barat', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('333f6e8c-5177-4423-9f99-4a4bbb269874', 'Kabupaten Sumba Barat Daya', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('96e50304-7f16-46ca-ba9f-de1a3185586d', 'Kabupaten Sumba Tengah', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('9210578b-0eed-4a5c-ae4d-4aa6b1dc8886', 'Kabupaten Sumba Timur', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('37e4fdfc-8f14-43ce-b5c7-c89e3fca918b', 'Kabupaten Timor Tengah Selatan', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('7b2dee32-a8c7-488a-a77c-9a2992b2ced9', 'Kabupaten Timor Tengah Utara', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('4dddba0e-17ac-4742-9d9b-109857ebfca6', 'Kota Kupang', 'Nusa Tenggara Timur', '2026-07-18 10:59:43.438847+00'),
	('28391a7b-a5fa-4d18-880c-1d1b864f8b55', 'Kabupaten Bengkayang', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('acb7d725-b5e6-4101-9186-a3cae9b4dc9a', 'Kabupaten Kapuas Hulu', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('7154e3e9-22d6-42d5-a0f3-3ef76a2ebb72', 'Kabupaten Kayong Utara', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('f5e3f4c3-1a82-4574-8df9-65f2fe3c56c9', 'Kabupaten Ketapang', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('9acdfc48-6ba2-44ab-a0a8-9bfc5277a7cc', 'Kabupaten Kubu Raya', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('f206a16a-7df1-449e-9168-f25e0ad4d866', 'Kabupaten Landak', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('675fd3f1-4bcc-4397-8d33-a19ef475734f', 'Kabupaten Melawi', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('4824f8b6-31f3-41dc-88d3-a1b378a74100', 'Kabupaten Mempawah', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('89e53316-de40-4865-89fc-942266236adb', 'Kabupaten Sambas', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('d8c31a40-3a6f-419b-8360-42471a26b355', 'Kabupaten Sanggau', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('1a24c52d-8f6b-4564-8ad9-a985c032ff47', 'Kabupaten Sekadau', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('000910c5-eda7-450b-8e52-12dc09c465c7', 'Kabupaten Sintang', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('3350ede7-172c-4e0c-80f9-1f096c779412', 'Kota Pontianak', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('3166bd4e-570e-44ca-9cbf-454a23959101', 'Kota Singkawang', 'Kalimantan Barat', '2026-07-18 10:59:43.438847+00'),
	('511a7130-399f-4717-beb4-3509e896ce87', 'Kabupaten Balangan', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('e9563eed-2501-4dd4-ab2c-cb2e355017db', 'Kabupaten Banjar', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('8d153aaf-a639-4ae1-abc1-e68b2d481a0a', 'Kabupaten Barito Kuala', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('caecc90f-4d88-4783-9ec7-4e7a8ee81fb5', 'Kabupaten Hulu Sungai Selatan', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('84c184a1-603d-4153-863f-b7c4f61502ad', 'Kabupaten Hulu Sungai Tengah', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('001b0747-ea1d-4848-b355-25e9d38fa820', 'Kabupaten Hulu Sungai Utara', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('284a4da3-1b29-40ad-bc3c-3e0d8710eb5f', 'Kabupaten Kotabaru', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('00d0f430-1c0c-4568-8f0b-6708d1c0b8aa', 'Kabupaten Tabalong', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('f36ee8ae-87a5-479a-ade6-32d4d20f6341', 'Kabupaten Tanah Bumbu', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('bc569ed2-684c-4ec3-87ec-bcca22b8b8b6', 'Kabupaten Tanah Laut', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('e1fed5d3-7b82-411a-b013-6c2b20426c39', 'Kabupaten Tapin', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('88d10c93-37a5-4d33-bd07-14bf7bc6df57', 'Kota Banjarbaru', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('ff8f9819-f7d6-4805-bd4d-6271bcb4c537', 'Kota Banjarmasin', 'Kalimantan Selatan', '2026-07-18 10:59:43.438847+00'),
	('a0ae916f-a231-4ae6-b7aa-425078bf8cbe', 'Kabupaten Barito Selatan', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('218592cd-9b55-4ef9-a05b-a979f13ab575', 'Kabupaten Barito Timur', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('3dc36b33-7918-4fb5-a579-3a71290e2310', 'Kabupaten Barito Utara', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('7af0f097-375a-4ded-aec2-aa18bf6cecd0', 'Kabupaten Gunung Mas', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('6dab9333-553c-4ee0-a5f8-813d0eebcbe6', 'Kabupaten Kapuas', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('b670d7e1-14c9-4c9a-a3d3-f8a2e8727755', 'Kabupaten Katingan', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('0b180d9e-517e-41e7-a253-4baae2c9c339', 'Kabupaten Kotawaringin Barat', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('9dbfb4ce-587e-4053-bea1-11576ad3af76', 'Kabupaten Kotawaringin Timur', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('73ef3590-0d31-4bf5-af95-334503752e14', 'Kabupaten Lamandau', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('e57580a8-dfdd-49b7-ab50-b28c143cdf43', 'Kabupaten Murung Raya', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('4d2db6ee-f3a5-43eb-874a-0ff9a0ffa4b5', 'Kabupaten Pulang Pisau', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('68f5d28f-3d7d-4006-a35a-22d620ed705f', 'Kabupaten Sukamara', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('5b2a030c-6be5-4706-86ca-880f33786b5c', 'Kabupaten Seruyan', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('b6b03436-9ff5-4c57-af3c-69bf4485e24b', 'Kota Palangka Raya', 'Kalimantan Tengah', '2026-07-18 10:59:43.438847+00'),
	('418ae31c-f18d-4ce7-9809-c4bfed655a40', 'Kabupaten Berau', 'Kalimantan Timur', '2026-07-18 10:59:43.438847+00'),
	('4941c8e6-7465-4250-ac26-f92413c4a35f', 'Kabupaten Kutai Barat', 'Kalimantan Timur', '2026-07-18 10:59:43.438847+00'),
	('4bd85bee-17c5-4e53-a5a1-2352846babd2', 'Kabupaten Kutai Timur', 'Kalimantan Timur', '2026-07-18 10:59:43.438847+00'),
	('53d3146e-66b6-46f0-85d7-0490af6ffe3b', 'Kabupaten Mahakam Ulu', 'Kalimantan Timur', '2026-07-18 10:59:43.438847+00'),
	('842e4d2f-24b2-4b6e-ab07-5d5dc553f4a0', 'Kabupaten Paser', 'Kalimantan Timur', '2026-07-18 10:59:43.438847+00'),
	('1cae8336-8ab7-46c8-ac42-488c5d40d63e', 'Kabupaten Penajam Paser Utara', 'Kalimantan Timur', '2026-07-18 10:59:43.438847+00'),
	('5156879b-ec6b-4a78-87da-e8b09a035d88', 'Kota Bontang', 'Kalimantan Timur', '2026-07-18 10:59:43.438847+00'),
	('f45b5782-cc9d-4501-96e7-d1805a93a5cb', 'Kabupaten Bulungan', 'Kalimantan Utara', '2026-07-18 10:59:43.438847+00'),
	('262db90b-8f98-437a-8b3c-2be5499f9915', 'Kabupaten Malinau', 'Kalimantan Utara', '2026-07-18 10:59:43.438847+00'),
	('13b3cd38-f089-42fc-b5a2-06a34b468ff4', 'Kabupaten Nunukan', 'Kalimantan Utara', '2026-07-18 10:59:43.438847+00'),
	('cb4b4e50-4f97-4678-b7de-f2fd7b5e0f03', 'Kabupaten Tana Tidung', 'Kalimantan Utara', '2026-07-18 10:59:43.438847+00'),
	('5bfb7b52-eecb-492e-94ff-f9f0278bd028', 'Kota Tarakan', 'Kalimantan Utara', '2026-07-18 10:59:43.438847+00'),
	('fe43b296-f6f1-409c-aa24-585c92c50199', 'Kabupaten Boalemo', 'Gorontalo', '2026-07-18 10:59:43.438847+00'),
	('d3619d05-82a4-4fa5-af1b-ab9af862ab56', 'Kabupaten Bone Bolango', 'Gorontalo', '2026-07-18 10:59:43.438847+00'),
	('32a9046b-6032-4ee2-a130-37e538da32ca', 'Kabupaten Gorontalo', 'Gorontalo', '2026-07-18 10:59:43.438847+00'),
	('30669692-46ae-40c0-ac0f-5f7e4f46fa34', 'Kabupaten Gorontalo Utara', 'Gorontalo', '2026-07-18 10:59:43.438847+00'),
	('8b052e06-bf55-42bb-bde5-b64489a6d0b8', 'Kabupaten Pohuwato', 'Gorontalo', '2026-07-18 10:59:43.438847+00'),
	('64d62c5f-db04-4efb-a401-651a9c8a67a3', 'Kota Gorontalo', 'Gorontalo', '2026-07-18 10:59:43.438847+00'),
	('b2e0e3db-928f-462a-a5a3-773a33c9af0a', 'Kabupaten Bantaeng', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('c13cccd7-5774-49d1-ae02-0f6bcbbd8eff', 'Kabupaten Barru', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('6957a261-65c0-42bb-a019-8870b020f408', 'Kabupaten Bone', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('b2b0863a-57dd-4238-82c5-fc7dfb9d38ec', 'Kabupaten Bulukumba', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('88010892-cce1-489c-9a26-82f0b1c20e9e', 'Kabupaten Enrekang', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('8aee84f9-c7a2-4e32-8d21-082d5cdeaaee', 'Kabupaten Gowa', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('e9163d64-5516-4af6-85a6-53763c80ca5f', 'Kabupaten Jeneponto', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('e093d3e2-629c-403d-8dc9-9ae5f967e15c', 'Kabupaten Kepulauan Selayar', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('e6dd032c-6bee-49b5-a265-94493cc8d106', 'Kabupaten Luwu', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('0b52705a-ef4c-424c-9554-6fca74f8d83c', 'Kabupaten Luwu Timur', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('756d898f-253d-44ce-b3c0-8c75512c7eb4', 'Kabupaten Luwu Utara', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('1ca5d423-b63b-4a26-b31a-5bd542436268', 'Kabupaten Maros', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('28137fbc-7354-4cd7-843d-785c709745b9', 'Kabupaten Pangkajene dan Kepulauan', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('c80106d4-9f9a-44ba-8efc-5e55d559f2ef', 'Kabupaten Pinrang', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('414e36e0-0aed-447a-885d-23fe8e49e60f', 'Kabupaten Sidenreng Rappang', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('0fab0b0f-db8d-4a97-b86e-32b3adc58d1a', 'Kabupaten Sinjai', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('be5d256a-f3c5-4932-a2df-c4cf52627751', 'Kabupaten Soppeng', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('11ae5332-00d7-4b70-8507-51d81eb7e119', 'Kabupaten Takalar', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('c0b0c561-309a-45e6-8b0a-13ea45cef1a9', 'Kabupaten Tana Toraja', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('c5a83aa2-d495-4dbd-b893-6246abc16f0a', 'Kabupaten Toraja Utara', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('ab13bd47-e42b-41ba-858e-d9842a62b4a3', 'Kabupaten Wajo', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('f690b400-4395-4e2c-b4b0-e1b0c27e59e5', 'Kota Makassar', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('4c032f8a-d065-463a-ae0e-7ded06af0dda', 'Kota Palopo', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('ef16ebe3-4d05-476e-ae4c-6cfcd10df634', 'Kota Parepare', 'Sulawesi Selatan', '2026-07-18 10:59:43.438847+00'),
	('2bc20033-dab1-4573-a04b-b83c35c070aa', 'Kabupaten Bombana', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('51fa781c-8cb4-4134-9bc1-1f1bbd78ddf8', 'Kabupaten Buton', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('8c17755f-b707-478f-bd2b-a7d230e883ce', 'Kabupaten Buton Selatan', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('72e1b14f-3826-4474-85a8-0163c556458a', 'Kabupaten Buton Tengah', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('0ab24a0f-7b72-4429-bec1-a8a0b0dfd947', 'Kabupaten Buton Utara', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('33198444-4429-43f2-ae88-7ee4474d5cda', 'Kabupaten Kolaka', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('739ef2a5-5303-4975-810e-167ea5c49fb7', 'Kabupaten Kolaka Timur', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('e59bb9a8-c112-4ad4-9bcc-833a8d198344', 'Kabupaten Kolaka Utara', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('a67d9daa-29d7-47a4-a51a-89869d45264e', 'Kabupaten Konawe', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('7ac6b1ce-caf1-4586-ae10-1d6944d12bca', 'Kabupaten Konawe Kepulauan', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('d7be9b3c-2732-4993-bad5-7a3d932eeb17', 'Kabupaten Konawe Selatan', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('d332131e-0eaa-456b-bb5a-4de93a15f6db', 'Kabupaten Konawe Utara', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('69fcf888-225e-4c92-bbe6-5743bb67db09', 'Kabupaten Muna', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('ef97202c-9464-4917-8de2-baef3b992e75', 'Kabupaten Muna Barat', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('acfaa2d4-86cb-4edd-92e6-8aee54f8c6c1', 'Kabupaten Wakatobi', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('19585939-5960-416b-92ae-6d87c33c1448', 'Kota Bau-Bau', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('0c788ab1-3cd8-4ccf-ab7e-e2b0ce5c5923', 'Kota Kendari', 'Sulawesi Tenggara', '2026-07-18 10:59:43.438847+00'),
	('eb2d1c9d-a9a9-41bb-9d5c-1397409b8b90', 'Kabupaten Banggai', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('955b0198-724e-48f9-aeef-a59127b66374', 'Kabupaten Banggai Kepulauan', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('f4ef0dee-b101-4d9c-9a14-e414aba82009', 'Kabupaten Banggai Laut', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('663400d1-44d4-4700-ab9b-3851396fb721', 'Kabupaten Buol', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('e0cd260c-deb4-42de-999a-b913089b88ab', 'Kabupaten Donggala', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('b8897bdb-c248-4b48-ac23-a48b25b7bb8e', 'Kabupaten Morowali', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('5783c88d-e69c-45af-9e8c-364d8d8be028', 'Kabupaten Morowali Utara', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('e0ba1f54-ffe9-4634-8074-aaf54d80a9b5', 'Kabupaten Parigi Moutong', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('af6242fc-dbe9-40b3-8153-e92ccd90472b', 'Kabupaten Poso', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('e6f0575d-6100-48c4-8a4f-d382064c2e6e', 'Kabupaten Sigi', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('ebc6d73c-ebbc-47b1-bf95-c541d97b5d7e', 'Kabupaten Tojo Una-Una', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('18aaf347-f46b-4a56-a617-dd4e30e63617', 'Kabupaten Toli-Toli', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('dcec37cd-6d17-46e3-8c74-a92dd7eb15fc', 'Kota Palu', 'Sulawesi Tengah', '2026-07-18 10:59:43.438847+00'),
	('809d0f9b-31d4-447b-b25b-bffdd1aa316b', 'Kabupaten Bolaang Mongondow', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('2636278d-f59f-4943-b5f8-d3409afeec0e', 'Kabupaten Bolaang Mongondow Selatan', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('64d720b4-ee1f-4123-bafa-f0257945cb26', 'Kabupaten Bolaang Mongondow Timur', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('0cb6da5a-25d0-4c0f-8d2e-229797fdf2df', 'Kabupaten Bolaang Mongondow Utara', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('73ccb85a-f89c-47eb-9c65-fbe72c356344', 'Kabupaten Kepulauan Sangihe', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('d532b244-7a24-4f65-922d-3ea280518c0d', 'Kabupaten Kepulauan Siau Tagulandang Biaro', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('80be9f61-cb46-4adb-ab09-0eca8056579a', 'Kabupaten Kepulauan Talaud', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('703f59fa-a7cf-41e7-81ea-988c4e3bff2a', 'Kabupaten Minahasa', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('9dccd085-d7d0-4e94-8199-57f65dd42498', 'Kabupaten Minahasa Selatan', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('f615e4c3-7da1-46b8-bbaa-1300c5d9a004', 'Kabupaten Minahasa Tenggara', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('f69a45b4-e894-41a8-89df-c42b7ab77db5', 'Kabupaten Minahasa Utara', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('674854f1-b60d-44e9-b5dc-6f586e9180d4', 'Kota Bitung', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('b2d2e044-a972-4a63-b0e9-ab37ec35c106', 'Kota Kotamobagu', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('440e8eda-111b-40c0-b8a8-fb42fc7fb913', 'Kota Manado', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('3694e779-df77-4e63-844d-dd9e5e4fe8fa', 'Kota Tomohon', 'Sulawesi Utara', '2026-07-18 10:59:43.438847+00'),
	('798857d0-31de-475a-99f9-b83200bcf695', 'Kabupaten Majene', 'Sulawesi Barat', '2026-07-18 10:59:43.438847+00'),
	('806e903a-7b82-4957-bd8a-bc46b0a1f716', 'Kabupaten Mamasa', 'Sulawesi Barat', '2026-07-18 10:59:43.438847+00'),
	('c1fcd396-50bf-4cc3-a0f2-6fa3c39930b0', 'Kabupaten Mamuju', 'Sulawesi Barat', '2026-07-18 10:59:43.438847+00'),
	('8cee3800-0b8e-4e86-8b43-925de1dfbba6', 'Kabupaten Mamuju Tengah', 'Sulawesi Barat', '2026-07-18 10:59:43.438847+00'),
	('500e1cc0-12e8-467a-9dad-072999a56ebd', 'Kabupaten Mamuju Utara', 'Sulawesi Barat', '2026-07-18 10:59:43.438847+00'),
	('6aa7d148-9f8f-4b04-b8ae-bd09fbfef75d', 'Kabupaten Polewali Mandar', 'Sulawesi Barat', '2026-07-18 10:59:43.438847+00'),
	('5cf5cdb4-90b6-4b84-aa6f-a44b4e18932c', 'Kota Mamuju', 'Sulawesi Barat', '2026-07-18 10:59:43.438847+00'),
	('c934ad82-67a2-43da-9e35-5b8dc1a9ae77', 'Kabupaten Buru', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('85519b80-0de5-4c83-9aba-d02a2de7814b', 'Kabupaten Buru Selatan', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('7aea32a1-143f-4e87-857e-256c1253af8e', 'Kabupaten Kepulauan Aru', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('d8bfc324-7e1e-4d7b-bc13-7fe9e1ce9c22', 'Kabupaten Maluku Barat Daya', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('d946b9cc-fd43-4edf-8ed9-16e5dffb8477', 'Kabupaten Maluku Tengah', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('5afa0bee-5724-4f4c-b928-e362b6596d54', 'Kabupaten Maluku Tenggara', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('6abb527e-c0f7-4f43-9dfd-b2294642b06a', 'Kabupaten Maluku Tenggara Barat', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('9a572938-7ea4-4f26-b37d-946e9b6ed7fe', 'Kabupaten Seram Bagian Barat', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('96301348-9843-48e6-bb9c-ae02422007f4', 'Kabupaten Seram Bagian Timur', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('48550720-9efb-4492-9f7e-ea7f6c32a8d9', 'Kota Ambon', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('b21fdf62-6280-47ef-be58-002b91e4170b', 'Kota Tual', 'Maluku', '2026-07-18 10:59:43.438847+00'),
	('f281a4cc-b46f-43c8-a58d-b889da04ba84', 'Kabupaten Halmahera Barat', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('6a2e6020-d72a-4936-9ddd-33661050c1ee', 'Kabupaten Halmahera Tengah', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('f83c89b4-4b0f-40a5-9e64-a46c1cc46f0d', 'Kabupaten Halmahera Utara', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('33196020-a36e-41b5-b536-6a328ce97cb1', 'Kabupaten Halmahera Selatan', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('743b9410-7484-4af8-8f2d-a07073478566', 'Kabupaten Kepulauan Sula', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('a7f40efa-3569-4cc1-9fa8-8ff035ece0e0', 'Kabupaten Halmahera Timur', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('da688ce8-9f40-40a3-9ef4-1358889369e5', 'Kabupaten Pulau Morotai', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('13c31f09-ec6b-431b-b8f8-2a73c7170769', 'Kabupaten Pulau Taliabu', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('b77e3a60-9d44-4766-be9a-3b1255635ce0', 'Kota Ternate', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('11883be9-d83c-4050-a699-ce780bc9abd7', 'Kota Tidore Kepulauan', 'Maluku Utara', '2026-07-18 10:59:43.438847+00'),
	('20d022d6-a658-4937-9aba-f8d4e144383c', 'Kabupaten Asmat', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('17f9009f-2490-43ba-aea8-25892cf24304', 'Kabupaten Biak Numfor', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('f15da3a3-f47b-4ded-a28f-c372473fafa0', 'Kabupaten Boven Digoel', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('6d321c2e-cdee-47a4-a7a9-0f94162acf19', 'Kabupaten Deiyai', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('4da72335-b67f-4376-8cd0-d595a83c7350', 'Kabupaten Dogiyai', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('a788d65e-4327-4be5-80c0-b603ae7b1b3a', 'Kabupaten Intan Jaya', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('26cfd874-2d29-49c1-a78e-ceefa3cf5604', 'Kabupaten Jayapura', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('102801e5-fbad-465c-8b94-7ea918a10ff3', 'Kabupaten Jayawijaya', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('900e8513-2017-4335-ad68-aafb12b4aacd', 'Kabupaten Keerom', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('f4fc60c0-f3a6-45fe-8466-898901bd8698', 'Kabupaten Kepulauan Yapen', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('6f3da3ab-aa10-4b8f-903e-d0e621665c39', 'Kabupaten Lanny Jaya', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('0eecea25-1037-47e7-8db5-b674b16c1de4', 'Kabupaten Mamberamo Raya', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('fcf22fa6-ad40-460b-8ca6-633c358cb3b4', 'Kabupaten Mamberamo Tengah', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('7db829ce-1e07-41fb-86ee-5769ed2849a5', 'Kabupaten Mappi', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('42cd2870-ce64-4df8-8a8d-e58c20fb4a9e', 'Kabupaten Merauke', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('d4fd2069-02c1-40ed-9c4b-449974c8873e', 'Kabupaten Mimika', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('2124a5cb-911d-4b89-905e-08faa2e9fce2', 'Kabupaten Nabire', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('efb6e905-4faf-421a-bb71-1fc89f38dada', 'Kabupaten Nduga', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('fe51c7db-0899-45b6-8cba-24d61e99ee3b', 'Kabupaten Paniai', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('1666d36c-7b78-4883-8d9c-500b9e1c125f', 'Kabupaten Pegunungan Bintang', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('aef47464-111c-4820-831e-c77c0a56e5b5', 'Kabupaten Puncak', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('743c18e4-ebfb-4505-a4af-7a733788341b', 'Kabupaten Puncak Jaya', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('bea743e6-a960-457c-a772-871a1d0dcd9c', 'Kabupaten Sarmi', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('c3be13ea-bf04-4276-803c-139a202bae11', 'Kabupaten Supiori', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('55bc1071-0b46-4330-9457-67ae305208b3', 'Kabupaten Tolikara', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('9a442e6c-a327-4d2c-b6d5-66988b9777bc', 'Kabupaten Waropen', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('bd100b81-262b-4f29-9b78-ce28b2b77a4f', 'Kabupaten Yahukimo', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('beabea81-902a-447d-afd7-d06cf6136ca9', 'Kabupaten Yalimo', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('3f77d3a0-e827-4937-bf57-ef06df0d7a21', 'Kota Jayapura', 'Papua', '2026-07-18 10:59:43.438847+00'),
	('0b0cabfd-3fcd-4959-8111-8aa0455020f3', 'Kabupaten Fakfak', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('41b86f94-654a-4ebe-8fb8-71212bd9fe67', 'Kabupaten Kaimana', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('05f6f187-0213-4326-a127-3af3e9de3260', 'Kabupaten Manokwari', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('66da59ad-108a-4acc-9e9d-d6bea35f67da', 'Kabupaten Manokwari Selatan', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('064263b3-255b-4f88-8f6a-5f89f813a84e', 'Kabupaten Maybrat', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('9ef17e0d-6e66-4a61-9006-6890b55a870f', 'Kabupaten Pegunungan Arfak', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('da9792f1-bd08-46d9-b3b9-e91194a450c2', 'Kabupaten Raja Ampat', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('986d3256-4bdd-48ab-95d3-8743b88c1c18', 'Kabupaten Sorong', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('9e085bfa-9475-4bbe-b357-218582982bd7', 'Kabupaten Sorong Selatan', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('cf7a5a86-7af8-42a8-b776-d17ef4f6af62', 'Kabupaten Tambrauw', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('10a86618-6010-44ba-93ff-d99eb6495fd5', 'Kabupaten Teluk Bintuni', 'Papua Barat', '2026-07-18 10:59:43.438847+00'),
	('ac47a914-8b5d-4682-8a4d-9568db8223de', 'Kabupaten Teluk Wondama', 'Papua Barat', '2026-07-18 10:59:43.438847+00');


--
-- Data for Name: destinations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."destinations" ("id", "slug", "name", "description", "category_id", "district_id", "latitude", "longitude", "address", "price_range", "opening_hours", "facilities", "cover_image_url", "gallery_urls", "google_maps_url", "rating", "review_count", "safety_score", "is_featured", "created_by", "created_at", "updated_at", "access_type", "departure_port", "crossing_duration_minutes", "crossing_cost_estimate", "crossing_notes") VALUES
	('8de0a365-3a58-4531-97c1-fa61acf82c49', 'taman-samarendah', 'Taman Samarendah', 'Taman kota tepi Sungai Mahakam, spot favorit untuk kuliner malam dan bersantai.', 'cf8afde8-c701-4dd9-8705-0dd4bb39fa09', 'f1a6d994-d14b-471f-bac3-ab5b486ef9a8', -0.4931, 117.1436, 'Tepian Mahakam, Samarinda', 'Gratis', NULL, '{Parkir,Toilet,"Kuliner Malam","Spot Foto"}', 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d', NULL, NULL, 4.3, 342, 4.6, true, NULL, '2026-07-18 05:52:50.775033+00', '2026-07-18 05:52:50.775033+00', 'darat', NULL, NULL, NULL, NULL),
	('e998b8ca-cc08-4f5f-b3ff-99f75c970af5', 'pulau-miang', 'Pulau Miang', 'Pulau Miang merupakan salah satu destinasi wisata bahari di Kabupaten Kutai Timur, Kalimantan Timur. Pulau ini menawarkan suasana alam yang tenang dengan keindahan pesisir dan panorama laut yang menarik untuk dinikmati. Pengunjung dapat menikmati suasana pulau, bersantai di kawasan pantai, serta menjelajahi keindahan alam sekitar. Pulau Miang cocok menjadi pilihan bagi wisatawan yang ingin menikmati wisata bahari dan suasana alam yang lebih tenang dan jauh dari keramaian.', 'be57f13a-8ee9-41f6-a20c-2e94437b615c', '4bd85bee-17c5-4e53-a5a1-2352846babd2', 0.729494998222254, 118.01268533019, 'Pulau Miang, Kabupaten Kutai Timur, Kalimantan Timur, Indonesia', 'Rp 40.000 - Rp 2.000.000', NULL, '{"Pelampung/Life Jacket","Spot Foto","Penyewaan Alat",Toilet,Warung/Kantin}', 'https://updatenusantara.id/wp-content/uploads/2025/04/IMG_0186.jpeg', '{https://i0.wp.com/viralkaltim.com/wp-content/uploads/2024/06/Kampung-Bahari-Nusantara-Pulau-Miang1.jpg?resize=627%2C375&ssl=1,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHQaD31FtJjfajR9DTgWPlcrwV7nGYwvgcUi1FCciLuhqz2ELdkoTsuSE&s=10,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHEAgwXhUa_IrVT7fNEjbq7Ut6c3B5sKKm3ZxLC9c2Vk8yhRlw8gJTMM0&s=10}', 'https://maps.app.goo.gl/xHfCybBqRhqGsgx36', 0.0, 0, 4.0, true, '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-21 02:50:45.778578+00', '2026-07-22 08:26:49.319762+00', 'kapal', 'Dermaga Pulau Miang', 15, 25000.00, 'Kapal dipesan dulu sebelum ke sana dan biasanya sudah sepaket dengan pemesanan penginapan karena itu fasilitas penginapan'),
	('e02e022f-e179-4b69-8b6b-8e99eee683b1', 'labuan-cermin', 'Labuan Cermin', 'Labuan Cermin merupakan destinasi wisata alam berupa danau dua rasa yang terkenal dengan kejernihan airnya. Berada di Kecamatan Biduk-Biduk, Kabupaten Berau, Kalimantan Timur, tempat ini menawarkan perpaduan air tawar dan air asin dengan pemandangan alam yang masih asri, cocok untuk berenang, snorkeling, dan menikmati keindahan alam.', '6a8ed331-9d52-4c78-a5fa-f6cf22e42127', '418ae31c-f18d-4ce7-9809-c4bfed655a40', 1.2286, 118.7264, 'Desa Labuan Kelambu, Kecamatan Biduk-Biduk, Kabupaten Berau, Kalimantan Timur', 'Rp 400.000 - Rp 800.000 sudah sama kapal', NULL, '{Parkir,Toilet,Warung,Perahu,"Area Snorkeling","Pelampung/Life Jacket","Penyewaan Alat","Spot Foto"}', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaYYCk13g-QEvc0tX4_y2-4QLEv1p8wL0Or90TgtPPxl6sg3zn6NSX4G0&s=10', '{}', 'https://maps.google.com/?q=Labuan+Cermin+Berau', 4.5, 128, 4.2, true, NULL, '2026-07-18 05:52:50.775033+00', '2026-07-23 09:40:38.521546+00', 'darat', NULL, NULL, NULL, NULL),
	('b5fcb23c-6f3d-4eb8-9f2f-c7c8eaa479d2', 'dermaga-penyebrangan-teluk-sulaiman', 'Dermaga Penyebrangan Teluk Sulaiman', 'Penyebrangan dari Teluk Sulaiman ke Pulau Kaniungan', 'e1967b50-3a83-4e5e-89ee-fc8ba0857331', '418ae31c-f18d-4ce7-9809-c4bfed655a40', 1.16095792310965, 118.760932639854, '5Q66+78H, Biduk Biduk, Kabupaten Berau, Kalimantan Timur', 'Rp 40.000 per orang dan Rp 500.000 harga sewa full 1 kapal', NULL, '{Toilet,Parkir}', 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkl7_JesfI2Ev7W3Pee82p0wXD90VPWR1nmHL7FML6GClejgwqFDwPBSS6Lg9HSODW-J8S_w66GZ6K4oAjClCtYq9eGw512RR7lEv9flckEBf_hr9rIxr2RzZ7OoLzee8A4vAIlgw=w408-h544-k-no', '{}', 'https://maps.app.goo.gl/khiix4xXDWp49zJ5A', 0.0, 0, 4.0, false, '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-21 03:35:30.932926+00', '2026-07-23 09:41:35.981029+00', 'darat', NULL, NULL, NULL, NULL),
	('e8562d6a-1fbf-44d1-b329-e8558ea3c8d6', 'dermaga-pulau-miang', 'Dermaga Pulau Miang', 'Tempat penyebrangan ke Pulau Miang', 'e1967b50-3a83-4e5e-89ee-fc8ba0857331', '4bd85bee-17c5-4e53-a5a1-2352846babd2', 0.777215962628164, 117.998056412707, 'QXGX+48V, Unnamed Road, Kerayaan, Sangkulirang, East Kutai Regency, East Kalimantan 75684', 'Rp 25.000/Orang', NULL, '{Parkir}', 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmrKxpCgMozT9CuyY1h5fd4d4uI7E6PrJVIKuRCU6yPzD7CtR4NvAQdVCbXPRCuUv5kndOXJrs4Hl0-rjPgt7uWtKMYpC23uNL-N3lV87pSmMeSV9P_W66O0AOLrjIQZHHuwn2HkMQ8FKu_=w408-h306-k-no', '{}', 'https://maps.app.goo.gl/1qT5NZ5nLV1Wbqa9A', 0.0, 0, 4.0, false, '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-21 03:07:31.330154+00', '2026-07-23 09:41:50.423409+00', 'darat', NULL, NULL, NULL, NULL),
	('44ca2439-e6bd-471f-9b76-2e4db0ad64e6', 'pulau-kaniungan', 'Pulau Kaniungan', 'Nikmati pesona Pulau Kaniungan, surga tropis di Kabupaten Berau dengan pantai berpasir putih, air laut sebening kristal, dan panorama bawah laut yang memukau. Keindahan alamnya yang masih alami menjadikan pulau ini destinasi sempurna bagi pencinta wisata bahari, fotografi, maupun wisatawan yang ingin melepas penat di tengah ketenangan alam.', '6a8ed331-9d52-4c78-a5fa-f6cf22e42127', 'f1a6d994-d14b-471f-bac3-ab5b486ef9a8', 1.11667, 118.83333, 'Pulau Kaniungan Besar, Kampung Teluk Sumbang, Kecamatan Biduk-Biduk, Kabupaten Berau, Kalimantan Timur 77373, Indonesia.', 'Rp 700.000 - Rp 3.000.000', NULL, '{Toilet,Warung,Penginapan,"Wahana air",Snorkling,Kapal}', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQmuzXVTesSlg-3NYqS0aENCL442YKMwlM8EZ-wmJbPLo0pwaVQBlNIEqz&s=10', '{https://blog.perpussmadaberau.sch.id/storage/2024/01/image-3.png}', 'https://maps.app.goo.gl/SwFbYAN83pR4ZnDg6', 0.0, 0, 4.0, true, NULL, '2026-07-18 10:23:25.532231+00', '2026-07-23 09:43:18.317172+00', 'kapal', 'Dermaga Penyebrangan Teluk Sulaiman', 20, 40000.00, 'Kalau pesan di sana booking 1 kapal bisa Rp 500.000 sudah pulang balik'),
	('2e13e754-5df1-4ab2-bc9c-a6c99389408d', 'villa-sungai-kaput', 'Villa Sungai Kaput', 'Villa/penginapan yang menghadap langsung ke pantai dan berada di Kecamatan Biduk-Biduk, Kabupaten Berau, Kalimantan Timur. Cocok sebagai tempat menginap bagi wisatawan yang berkunjung ke kawasan Biduk-Biduk dan Labuan Cermin.', 'f93653a3-585a-4d9b-967c-ef2025e05d9d', '418ae31c-f18d-4ce7-9809-c4bfed655a40', 1.22823823786718, 118.731880584655, 'Jl. Majahaba No.65, Biduk-Biduk, Biduk Biduk, Kabupaten Berau, Kalimantan Timur 77373', 'Rp 400.000 - Rp 600.000 per malam', NULL, '{Parkir,Toilet,Warung/Kantin,"Spot Foto",WiFi}', 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no', '{https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ7pkoCN7cc1dyhqPYky6rXfE0lNIlkN1-apZvUJtCNw&s=10}', 'https://maps.app.goo.gl/7qGqGUutchCVkYFr7', 0.0, 0, 4.0, true, '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '2026-07-21 13:30:46.417321+00', '2026-07-23 09:43:01.689765+00', 'darat', NULL, NULL, NULL, NULL),
	('bca07ce3-ebfd-4855-a310-1eef7444f857', 'pulau-beras-basah', 'Pulau Beras Basah', 'Bla Bla', '6a8ed331-9d52-4c78-a5fa-f6cf22e42127', '5156879b-ec6b-4a78-87da-e8b09a035d88', 0.06415720076008061, 117.55879686113158, '3H75+JG, Bontang Lestari, Kota Bontang, Kalimantan Timur', '50000', NULL, '{Parkir,Toilet,Warung/Kantin,Gazebo,"Kolam Renang"}', 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnOAK4tibbxLoHxuJ67SUwx7QuZvKbo_Paer6H5s_44qMBKCMphp_4VDtBb90dHe367MkPINgc-kjNe-AAzEboHrXXuoEc7u1XyXXwY3UPcoKBuJ3gmaALL9y1kGrmoUfIWn-42VQ=w408-h306-k-no', '{}', 'https://maps.app.goo.gl/veztCFqv6R8hwUFLA', 0.0, 0, 4.0, true, '890f3884-134c-4290-9b84-b0b0dc713bd5', '2026-08-01 07:19:25.192225+00', '2026-08-01 07:19:25.192225+00', 'darat', NULL, NULL, NULL, NULL);


--
-- Data for Name: community_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: post_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: post_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subscriptions" ("id", "user_id", "tier", "status", "current_period_end", "ai_generation_count_today", "ai_generation_reset_at", "trips_saved_count", "created_at", "updated_at") VALUES
	('3ae453ee-7620-44ef-84ac-6a20e43a3cbe', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', 'demo', 'active', NULL, 0, '2026-07-18', 0, '2026-07-18 05:53:26.710773+00', '2026-07-18 05:53:26.710773+00'),
	('4206a5b5-956d-4c1d-be28-d24e5c2c4846', '890f3884-134c-4290-9b84-b0b0dc713bd5', 'demo', 'active', NULL, 0, '2026-08-01', 0, '2026-08-01 07:06:12.959671+00', '2026-08-01 07:06:12.959671+00');


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."trips" ("id", "user_id", "title", "start_date", "end_date", "status", "budget_estimate", "preferences", "itinerary", "cover_image_url", "is_public", "created_at", "updated_at") VALUES
	('3a6af72a-77b3-4709-a4dd-cb7f251000e1', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', '3‑hari perjalanan santai ke Biduk‑Biduk berfokus pada Labuan Cermin untuk snorke', '2026-07-19', '2026-07-21', 'completed', 950000.00, NULL, '[{"day": 1, "date": "2026-07-18", "items": [{"time": "07:00", "notes": "Biaya transport 2 orang", "activity": "Perjalanan menuju Labuan Cermin (transport umum/sewa ojek)", "estimated_cost": 20000, "destination_name": ""}, {"time": "08:30", "notes": "Tiket masuk 2 orang (harga lower bound Rp 400.000/orang)", "activity": "Snorkeling, berenang, dan fotografi air jernih di Labuan Cermin", "destination_id": "e02e022f-e179-4b69-8b6b-8e99eee683b1", "estimated_cost": 800000, "destination_name": "Labuan Cermin", "destination_slug": "labuan-cermin", "destination_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaYYCk13g-QEvc0tX4_y2-4QLEv1p8wL0Or90TgtPPxl6sg3zn6NSX4G0&s=10"}, {"time": "12:00", "notes": "Nasi ikan + sayur untuk 2 orang", "activity": "Makan siang di warung lokal di sekitar Labuan Cermin", "estimated_cost": 20000, "destination_name": ""}], "subtotal": 840000}, {"day": 2, "date": "2026-07-19", "items": [{"time": "08:00", "notes": "Nasi + lauk sederhana", "activity": "Sarapan pagi di homestay/kost", "estimated_cost": 20000, "destination_name": ""}, {"time": "09:30", "notes": "Tidak ada biaya tiket", "activity": "Jelajahi Kampung Teluk Sumbang – interaksi budaya, foto rumah adat & nelayan", "estimated_cost": 0, "destination_name": ""}, {"time": "12:30", "notes": "Menu seafood segar", "activity": "Makan siang di warung kampung", "estimated_cost": 20000, "destination_name": ""}, {"time": "14:30", "notes": "Golden hour photography", "activity": "Fotografi mangrove & pantai pasir putih di sekitar Biduk‑Biduk", "estimated_cost": 0, "destination_name": ""}, {"time": "18:30", "notes": "Sup ikan + nasi", "activity": "Makan malam santai di homestay", "estimated_cost": 20000, "destination_name": ""}], "subtotal": 60000}, {"day": 3, "date": "2026-07-20", "items": [{"time": "05:30", "notes": "Bawa kamera/tripod", "activity": "Fotografi matahari terbit di pantai Biduk‑Biduk", "estimated_cost": 0, "destination_name": ""}, {"time": "08:00", "notes": "Roti + kopi", "activity": "Sarapan terakhir & packing", "estimated_cost": 20000, "destination_name": ""}, {"time": "10:00", "notes": "Sewa mobil/angkot 2 orang", "activity": "Perjalanan pulang (transport ke bandara/pelabuhan)", "estimated_cost": 30000, "destination_name": ""}], "subtotal": 50000}]', NULL, false, '2026-07-18 11:24:09.57414+00', '2026-07-21 13:46:03.874893+00'),
	('b99935d2-8680-4f9c-ae34-b22e72505682', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', 'Perjalanan 2 hari 1 malam di Kutai Timur mengunjungi Pulau Miang untuk alam, fot', NULL, NULL, 'completed', 840000.00, NULL, '[{"day": 1, "date": "2026-07-22", "items": [{"time": "07:30", "notes": "Biaya untuk 2 orang perjalanan bolak-balik nanti dihitung di item pulang", "activity": "Berangkat dari penginapan menuju Dermaga Pulau Miang menggunakan transportasi umum (angkot/ojek)", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmrKxpCgMozT9CuyY1h5fd4d4uI7E6PrJVIKuRCU6yPzD7CtR4NvAQdVCbXPRCuUv5kndOXJrs4Hl0-rjPgt7uWtKMYpC23uNL-N3lV87pSmMeSV9P_W66O0AOLrjIQZHHuwn2HkMQ8FKu_=w408-h306-k-no", "destination_id": "e8562d6a-1fbf-44d1-b329-e8558ea3c8d6", "estimated_cost": 100000, "destination_name": "Dermaga Pulau Miang"}, {"time": "08:30", "notes": "Perhatikan jadwal kapal terakhir pulang sekitar pukul 15:00; cuaca cerah di musim kemarau", "activity": "Naik kapal penyeberangan dari Dermaga Pulau Miang ke Pulau Miang (perjalanan ±15 menit, tiket bolak-balik)", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmrKxpCgMozT9CuyY1h5fd4d4uI7E6PrJVIKuRCU6yPzD7CtR4NvAQdVCbXPRCuUv5kndOXJrs4Hl0-rjPgt7uWtKMYpC23uNL-N3lV87pSmMeSV9P_W66O0AOLrjIQZHHuwn2HkMQ8FKu_=w408-h306-k-no", "destination_id": "e8562d6a-1fbf-44d1-b329-e8558ea3c8d6", "estimated_cost": 60000, "destination_name": "Pulau Miang"}, {"time": "09:00", "notes": "Sewa gear snorkel 50.000/orang; bawa kamera tahan air", "activity": "Wisata alam, snorkeling ringan, dan fotografi pantai serta terumbu karang", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmrKxpCgMozT9CuyY1h5fd4d4uI7E6PrJVIKuRCU6yPzD7CtR4NvAQdVCbXPRCuUv5kndOXJrs4Hl0-rjPgt7uWtKMYpC23uNL-N3lV87pSmMeSV9P_W66O0AOLrjIQZHHuwn2HkMQ8FKu_=w408-h306-k-no", "destination_id": "e8562d6a-1fbf-44d1-b329-e8558ea3c8d6", "estimated_cost": 100000, "destination_name": "Pulau Miang"}, {"time": "12:00", "notes": "Makan siang 80.000/orang + transport pulang 100.000 untuk 2 orang", "activity": "Makan siang di warung pulau lalu pulang ke Dermaga Pulau Miang dan kembali ke penginapan", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmrKxpCgMozT9CuyY1h5fd4d4uI7E6PrJVIKuRCU6yPzD7CtR4NvAQdVCbXPRCuUv5kndOXJrs4Hl0-rjPgt7uWtKMYpC23uNL-N3lV87pSmMeSV9P_W66O0AOLrjIQZHHuwn2HkMQ8FKu_=w408-h306-k-no", "destination_id": "e8562d6a-1fbf-44d1-b329-e8558ea3c8d6", "estimated_cost": 260000, "destination_name": "Pulau Miang"}], "subtotal": 520000}, {"day": 2, "date": "2026-07-23", "items": [{"time": "08:00", "notes": "Perkiraan 30 menit perjalanan; bawa minum dan snack", "activity": "Berangkat ke Danau Semayang menggunakan angkot/ojek dari penginapan", "estimated_cost": 50000, "destination_name": "Danau Semayang"}, {"time": "09:00", "notes": "Sewa perahu 100.000 untuk 2 orang selama 1 jam", "activity": "Wisata danau: naik perahu tradisional, fotografi pemandau dan burung, santai di tepi danau", "estimated_cost": 100000, "destination_name": "Danau Semayang"}, {"time": "12:00", "notes": "Makan 60.000/orang + transport pulang 50.000 untuk 2 orang", "activity": "Makan siang di warung tepi danau lalu pulang ke penginapan", "estimated_cost": 170000, "destination_name": "Danau Semayang"}], "subtotal": 320000}]', NULL, false, '2026-07-21 09:48:44.365916+00', '2026-07-22 23:08:53.812468+00'),
	('ef16de5c-13e7-4639-9f98-ff76697ef580', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', 'Perjalanan 4 hari 3 malam dari Kaubun ke Biduk-Biduk mengunjungi Labuan Cermin d', NULL, NULL, 'upcoming', 5180000.00, NULL, '[{"day": 1, "date": "2026-07-23", "items": [{"time": "05:30", "notes": "Jarak ±250 km, pastikan kendaraan dalam kondisi prima dan bawa bekal makanan/minum untuk perjalanan jauh.", "activity": "Berangkat dari Kaubun menuju Biduk-Biduk menggunakan mobil pribadi (estimasi perjalanan 7 jam, biaya bensin ±Rp 300.000)", "estimated_cost": 300000, "destination_name": "Kaubun - Biduk-Biduk"}, {"time": "12:30", "notes": "Tarif per malam Rp 400.000 (harga terendah dari daftar). Total 3 malam dibayar di muka.", "activity": "Check-in Villa Sungai Kaput (3 malam), biaya sewa Rp 400.000/malam x 3 malam = Rp 1.200.000", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 1200000, "destination_name": "Villa Sungai Kaput"}, {"time": "13:30", "notes": "Estimasi untuk 2 orang.", "activity": "Makan siang di warung lokal", "estimated_cost": 100000, "destination_name": "Warung Lokal Biduk-Biduk"}, {"time": "14:30", "notes": "Harga tiket Rp 400.000 - Rp 800.000 sudah termasuk kapal. Gunakan harga terendah. Cocok untuk fotografi dan snorkling santai.", "activity": "Berkunjung ke Labuan Cermin (tiket masuk sudah termasuk kapal, harga terendah Rp 400.000/orang x2 = Rp 800.000)", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaYYCk13g-QEvc0tX4_y2-4QLEv1p8wL0Or90TgtPPxl6sg3zn6NSX4G0&s=10", "destination_id": "e02e022f-e179-4b69-8b6b-8e99eee683b1", "estimated_cost": 800000, "destination_name": "Labuan Cermin"}, {"time": "18:00", "notes": "Estimasi makan malam 2 orang.", "activity": "Kembali ke villa, istirahat dan makan malam", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 100000, "destination_name": "Villa Sungai Kaput"}], "subtotal": 2500000}, {"day": 2, "date": "2026-07-24", "items": [{"time": "07:00", "notes": "Estimasi sarapan 2 orang.", "activity": "Sarapan", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 50000, "destination_name": "Villa Sungai Kaput"}, {"time": "08:00", "notes": "Biaya parkir/bensin kecil sekitar dermaga.", "activity": "Menuju Dermaga Penyebrangan Teluk Sulaiman menggunakan mobil pribadi", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkl7_JesfI2Ev7W3Pee82p0wXD90VPWR1nmHL7FML6GClejgwqFDwPBSS6Lg9HSODW-J8S_w66GZ6K4oAjClCtYq9eGw512RR7lEv9flckEBf_hr9rIxr2RzZ7OoLzee8A4vAIlgw=w408-h544-k-no", "destination_id": "b5fcb23c-6f3d-4eb8-9f2f-c7c8eaa479d2", "estimated_cost": 50000, "destination_name": "Dermaga Penyebrangan Teluk Sulaiman"}, {"time": "08:30", "notes": "Biaya kapal ±Rp 40.000/orang (harga terendah). Perhatikan jadwal kapal terakhir pulang dan cuaca.", "activity": "Naik kapal penyeberangan ke Pulau Kaniungan (biaya kapal Rp 40.000/orang x2 = Rp 80.000, durasi ±20 menit)", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQmuzXVTesSlg-3NYqS0aENCL442YKMwlM8EZ-wmJbPLo0pwaVQBlNIEqz&s=10", "destination_id": "44ca2439-e6bd-471f-9b76-2e4db0ad64e6", "estimated_cost": 80000, "destination_name": "Kapal Penyeberangan ke Pulau Kaniungan"}, {"time": "09:00", "notes": "Harga tiket Rp 700.000 - Rp 3.000.000. Gunakan harga terendah. Cocok untuk snorkling dan wahana air.", "activity": "Snorkling & wahana air di Pulau Kaniungan (tiket masuk harga terendah Rp 700.000/orang x2 = Rp 1.400.000)", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQmuzXVTesSlg-3NYqS0aENCL442YKMwlM8EZ-wmJbPLo0pwaVQBlNIEqz&s=10", "destination_id": "44ca2439-e6bd-471f-9b76-2e4db0ad64e6", "estimated_cost": 1400000, "destination_name": "Pulau Kaniungan"}, {"time": "12:00", "notes": "Estimasi makanan di pulau untuk 2 orang.", "activity": "Makan siang di pulau", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQmuzXVTesSlg-3NYqS0aENCL442YKMwlM8EZ-wmJbPLo0pwaVQBlNIEqz&s=10", "destination_id": "44ca2439-e6bd-471f-9b76-2e4db0ad64e6", "estimated_cost": 150000, "destination_name": "Pulau Kaniungan"}, {"time": "15:00", "notes": "Biaya kapal pulang sudah termasuk dalam tiket pulang pergi (asumsi tiket dua arah).", "activity": "Pulang ke Dermaga, kembali ke villa", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkl7_JesfI2Ev7W3Pee82p0wXD90VPWR1nmHL7FML6GClejgwqFDwPBSS6Lg9HSODW-J8S_w66GZ6K4oAjClCtYq9eGw512RR7lEv9flckEBf_hr9rIxr2RzZ7OoLzee8A4vAIlgw=w408-h544-k-no", "destination_id": "b5fcb23c-6f3d-4eb8-9f2f-c7c8eaa479d2", "estimated_cost": 0, "destination_name": "Dermaga Penyebrangan Teluk Sulaiman"}, {"time": "19:00", "notes": "Estimasi makan malam 2 orang.", "activity": "Makan malam", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 100000, "destination_name": "Villa Sungai Kaput"}], "subtotal": 1830000}, {"day": 3, "date": "2026-07-25", "items": [{"time": "07:00", "notes": "Estimasi sarapan 2 orang.", "activity": "Sarapan", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 50000, "destination_name": "Villa Sungai Kaput"}, {"time": "08:30", "notes": "Tidak ada transport umum, gunakan ojek carteran/sewa motor untuk menjelajahi desa dan spot fotografi.", "activity": "Wisata budaya & fotografi di desa Biduk-Biduk (sewa ojek carteran seharian Rp 150.000)", "estimated_cost": 150000, "destination_name": "Desa Biduk-Biduk"}, {"time": "12:00", "notes": "Estimasi 2 orang.", "activity": "Makan siang", "estimated_cost": 100000, "destination_name": "Warung Lokal"}, {"time": "13:30", "notes": "Aktivitas bebas biaya.", "activity": "Santai di villa / pemandangan pantai, fotografi sunset", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 0, "destination_name": "Villa Sungai Kaput / Pantai Biduk-Biduk"}, {"time": "19:00", "notes": "Estimasi 2 orang.", "activity": "Makan malam", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 100000, "destination_name": "Villa Sungai Kaput"}], "subtotal": 400000}, {"day": 4, "date": "2026-07-26", "items": [{"time": "07:00", "notes": "Estimasi sarapan 2 orang.", "activity": "Sarapan & check-out", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 50000, "destination_name": "Villa Sungai Kaput"}, {"time": "08:00", "notes": "Perjalanan ±7 jam, istirahat cukup sebelum mengemudi jauh.", "activity": "Berangkat kembali ke Kaubun menggunakan mobil pribadi (biaya bensin ±Rp 300.000)", "estimated_cost": 300000, "destination_name": "Biduk-Biduk - Kaubun"}, {"time": "14:00", "notes": "Estimasi makan siang 2 orang.", "activity": "Tiba di Kaubun, makan siang di jalan", "estimated_cost": 100000, "destination_name": "Kaubun"}], "subtotal": 450000}]', NULL, false, '2026-07-23 09:55:20.08477+00', '2026-07-23 09:55:20.08477+00'),
	('3a47e67f-49b9-449f-b61e-f4061cbf1a94', '3cca89b0-6e1d-41df-8d65-4818f1380bf6', 'Perjalanan 4 hari 3 malam dari Samarinda ke Biduk-Biduk mengunjungi Labuan Cermi', NULL, NULL, 'completed', 6960000.00, NULL, '[{"day": 1, "date": "2026-08-04", "items": [{"time": "06:00", "notes": "Sewa mobil one-way, biaya sudah termasuk bensin dan supir", "activity": "Berangkat dari Samarinda menuju Biduk-Biduk dengan sewa mobil termasuk bensin dan supir (perjalanan ±12 jam)", "estimated_cost": 1250000, "destination_name": "Samarinda → Biduk-Biduk"}, {"time": "18:00", "notes": "Tarif per malam Rp 400.000, total 3 malam = Rp 1.200.000", "activity": "Check-in & Sewa Villa Sungai Kaput (3 malam @ Rp 400.000/malam)", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 1200000, "destination_name": "Villa Sungai Kaput"}, {"time": "19:30", "notes": "Estimasi makan malam untuk 2 orang", "activity": "Makan malam di warung lokal", "estimated_cost": 100000, "destination_name": "Warung Lokal Biduk-Biduk"}], "subtotal": 2550000}, {"day": 2, "date": "2026-08-05", "items": [{"time": "07:00", "notes": "Estimasi sarapan untuk 2 orang", "activity": "Sarapan pagi", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 50000, "destination_name": "Villa Sungai Kaput"}, {"time": "08:00", "notes": "Sewa ojek carteran bolak-balik ke dermaga", "activity": "Menuju Dermaga Penyebrangan Teluk Sulaiman dengan ojek carteran", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkl7_JesfI2Ev7W3Pee82p0wXD90VPWR1nmHL7FML6GClejgwqFDwPBSS6Lg9HSODW-J8S_w66GZ6K4oAjClCtYq9eGw512RR7lEv9flckEBf_hr9rIxr2RzZ7OoLzee8A4vAIlgw=w408-h544-k-no", "destination_id": "b5fcb23c-6f3d-4eb8-9f2f-c7c8eaa479d2", "estimated_cost": 100000, "destination_name": "Dermaga Penyebrangan Teluk Sulaiman"}, {"time": "08:30", "notes": "Tiket Labuan Cermin sudah mencakup biaya penyeberangan kapal", "activity": "Naik kapal menuju Labuan Cermin (biaya kapal sudah termasuk dalam tiket masuk)", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaYYCk13g-QEvc0tX4_y2-4QLEv1p8wL0Or90TgtPPxl6sg3zn6NSX4G0&s=10", "destination_id": "e02e022f-e179-4b69-8b6b-8e99eee683b1", "estimated_cost": 0, "destination_name": "Labuan Cermin"}, {"time": "09:00", "notes": "Tiket masuk Rp 400.000/orang termasuk kapal, total 2 orang = Rp 800.000", "activity": "Wisata Labuan Cermin: snorkeling, fotografi air jernih, dan menikmati pemandangan karst", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaYYCk13g-QEvc0tX4_y2-4QLEv1p8wL0Or90TgtPPxl6sg3zn6NSX4G0&s=10", "destination_id": "e02e022f-e179-4b69-8b6b-8e99eee683b1", "estimated_cost": 800000, "destination_name": "Labuan Cermin"}, {"time": "12:00", "notes": "Bawa bekal dari homestay untuk hemat biaya", "activity": "Makan siang (bekal sendiri)", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaYYCk13g-QEvc0tX4_y2-4QLEv1p8wL0Or90TgtPPxl6sg3zn6NSX4G0&s=10", "destination_id": "e02e022f-e179-4b69-8b6b-8e99eee683b1", "estimated_cost": 50000, "destination_name": "Labuan Cermin"}, {"time": "14:00", "notes": "Ojek carteran kembali ke villa", "activity": "Kembali ke dermaga dan pulang ke villa dengan ojek carteran", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkl7_JesfI2Ev7W3Pee82p0wXD90VPWR1nmHL7FML6GClejgwqFDwPBSS6Lg9HSODW-J8S_w66GZ6K4oAjClCtYq9eGw512RR7lEv9flckEBf_hr9rIxr2RzZ7OoLzee8A4vAIlgw=w408-h544-k-no", "destination_id": "b5fcb23c-6f3d-4eb8-9f2f-c7c8eaa479d2", "estimated_cost": 100000, "destination_name": "Dermaga Penyebrangan Teluk Sulaiman"}, {"time": "19:00", "notes": "Estimasi makan malam untuk 2 orang", "activity": "Makan malam di warung lokal", "estimated_cost": 100000, "destination_name": "Warung Lokal Biduk-Biduk"}], "subtotal": 1200000}, {"day": 3, "date": "2026-08-06", "items": [{"time": "07:00", "notes": "Estimasi sarapan untuk 2 orang", "activity": "Sarapan pagi", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 50000, "destination_name": "Villa Sungai Kaput"}, {"time": "08:00", "notes": "Sewa ojek carteran bolak-balik ke dermaga", "activity": "Menuju Dermaga Penyebrangan Teluk Sulaiman dengan ojek carteran", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkl7_JesfI2Ev7W3Pee82p0wXD90VPWR1nmHL7FML6GClejgwqFDwPBSS6Lg9HSODW-J8S_w66GZ6K4oAjClCtYq9eGw512RR7lEv9flckEBf_hr9rIxr2RzZ7OoLzee8A4vAIlgw=w408-h544-k-no", "destination_id": "b5fcb23c-6f3d-4eb8-9f2f-c7c8eaa479d2", "estimated_cost": 100000, "destination_name": "Dermaga Penyebrangan Teluk Sulaiman"}, {"time": "08:30", "notes": "Total 2 orang: tiket dermaga Rp 80.000 + kapal Rp 80.000", "activity": "Tiket Dermaga & Naik kapal ke Pulau Kaniungan (biaya tiket dermaga Rp 40.000/orang + kapal Rp 40.000/orang)", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQmuzXVTesSlg-3NYqS0aENCL442YKMwlM8EZ-wmJbPLo0pwaVQBlNIEqz&s=10", "destination_id": "44ca2439-e6bd-471f-9b76-2e4db0ad64e6", "estimated_cost": 160000, "destination_name": "Pulau Kaniungan"}, {"time": "09:00", "notes": "Tiket masuk Rp 700.000/orang, total 2 orang = Rp 1.400.000", "activity": "Wisata Pulau Kaniungan: snorkeling, pulau pasir putih, fotografi bawah laut", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQmuzXVTesSlg-3NYqS0aENCL442YKMwlM8EZ-wmJbPLo0pwaVQBlNIEqz&s=10", "destination_id": "44ca2439-e6bd-471f-9b76-2e4db0ad64e6", "estimated_cost": 1400000, "destination_name": "Pulau Kaniungan"}, {"time": "12:00", "notes": "Estimasi makan siang sederhana untuk 2 orang", "activity": "Makan siang di pulau", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQmuzXVTesSlg-3NYqS0aENCL442YKMwlM8EZ-wmJbPLo0pwaVQBlNIEqz&s=10", "destination_id": "44ca2439-e6bd-471f-9b76-2e4db0ad64e6", "estimated_cost": 100000, "destination_name": "Pulau Kaniungan"}, {"time": "15:00", "notes": "Ojek carteran kembali ke villa", "activity": "Pulang ke dermaga dan kembali ke villa dengan ojek carteran", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkl7_JesfI2Ev7W3Pee82p0wXD90VPWR1nmHL7FML6GClejgwqFDwPBSS6Lg9HSODW-J8S_w66GZ6K4oAjClCtYq9eGw512RR7lEv9flckEBf_hr9rIxr2RzZ7OoLzee8A4vAIlgw=w408-h544-k-no", "destination_id": "b5fcb23c-6f3d-4eb8-9f2f-c7c8eaa479d2", "estimated_cost": 100000, "destination_name": "Dermaga Penyebrangan Teluk Sulaiman"}, {"time": "19:00", "notes": "Estimasi makan malam untuk 2 orang", "activity": "Makan malam di warung lokal", "estimated_cost": 100000, "destination_name": "Warung Lokal Biduk-Biduk"}], "subtotal": 1910000}, {"day": 4, "date": "2026-08-07", "items": [{"time": "07:00", "notes": "Estimasi sarapan untuk 2 orang", "activity": "Sarapan pagi dan check-out", "image_url": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkd7RgXKz7CmKYIM44OhF1dLF671jMqvCsT3vvv6p862Aw5EjyIywd5UVUVO7qWJY1_P4gCZTgxXnbo5vl96OTFdBQANE4MYnfJi3eNK9xFV4vE5ObRnVjoZZT83Bp8pwYLcGI=w408-h306-k-no", "destination_id": "2e13e754-5df1-4ab2-bc9c-a6c99389408d", "estimated_cost": 50000, "destination_name": "Villa Sungai Kaput"}, {"time": "08:00", "notes": "Sewa mobil one-way kembali, biaya sudah termasuk bensin dan supir", "activity": "Berangkat dari Biduk-Biduk menuju Samarinda dengan sewa mobil termasuk bensin dan supir (perjalanan ±12 jam)", "estimated_cost": 1250000, "destination_name": "Biduk-Biduk → Samarinda"}, {"time": "20:00", "notes": "", "activity": "Tiba di Samarinda, perjalanan selesai", "estimated_cost": 0, "destination_name": "Samarinda"}], "subtotal": 1300000}]', NULL, false, '2026-08-01 06:28:12.748155+00', '2026-08-01 06:29:11.032029+00');


--
-- Data for Name: trip_destinations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 75, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict oU9UBjbjqc8att1cT6L0sAYZ5BaNrtbeWdncLgmleQZH48wvtbyNvUULeOvaCw3

RESET ALL;
