CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"post_id" uuid,
	"parent_id" uuid,
	"user_id" uuid NOT NULL,
	"body_md" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comments_status_check" CHECK (status in ('active','hidden','deleted'))
);
--> statement-breakpoint
CREATE TABLE "link_health_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"status" text DEFAULT 'unknown' NOT NULL,
	"http_status" integer,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"note" text,
	CONSTRAINT "link_health_checks_status_check" CHECK (status in ('unknown','healthy','degraded','broken'))
);
--> statement-breakpoint
CREATE TABLE "magic_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token_hash" text NOT NULL,
	"purpose" text NOT NULL,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moderation_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid,
	"target_type" text NOT NULL,
	"target_id" uuid NOT NULL,
	"action" text NOT NULL,
	"reason" text,
	"metadata_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"github_username" text,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_role_check" CHECK (role in ('member','admin'))
);
--> statement-breakpoint
CREATE TABLE "project_click_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"source" text NOT NULL,
	"session_hash" text NOT NULL,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_owners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid,
	"verification_method" text NOT NULL,
	"email_hash" text,
	"claim_token_hash" text,
	"claim_token_expires_at" timestamp with time zone,
	"is_primary" boolean DEFAULT false NOT NULL,
	"claimed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_owners_project_user_unique" UNIQUE("project_id","user_id"),
	CONSTRAINT "project_owners_verification_check" CHECK (verification_method in ('email','github'))
);
--> statement-breakpoint
CREATE TABLE "project_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"body_md" text NOT NULL,
	"requested_feedback_md" text,
	"media_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "project_posts_type_check" CHECK (type in ('launch','update','feedback')),
	CONSTRAINT "project_posts_status_check" CHECK (status in ('pending','published','hidden'))
);
--> statement-breakpoint
CREATE TABLE "project_rank_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"unique_clicks" integer DEFAULT 0 NOT NULL,
	"save_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_saves" (
	"user_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_saves_pk" PRIMARY KEY("user_id","project_id")
);
--> statement-breakpoint
CREATE TABLE "project_tags" (
	"project_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_tags_pk" PRIMARY KEY("project_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"tagline" text NOT NULL,
	"short_description" text NOT NULL,
	"overview_md" text NOT NULL,
	"problem_md" text NOT NULL,
	"target_users_md" text NOT NULL,
	"why_made_md" text,
	"stage" text NOT NULL,
	"category" text NOT NULL,
	"platform" text NOT NULL,
	"pricing_model" text NOT NULL,
	"pricing_note" text,
	"live_url" text NOT NULL,
	"live_url_normalized" text NOT NULL,
	"github_url" text,
	"github_url_normalized" text,
	"demo_url" text,
	"docs_url" text,
	"maker_alias" text NOT NULL,
	"cover_image_url" text NOT NULL,
	"gallery_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_open_source" boolean DEFAULT false NOT NULL,
	"no_signup_required" boolean DEFAULT false NOT NULL,
	"is_solo_maker" boolean DEFAULT false NOT NULL,
	"ai_tools_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"verification_state" text DEFAULT 'unverified' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"featured_order" integer,
	"published_at" timestamp with time zone,
	"last_activity_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_stage_check" CHECK (stage in ('alpha','beta','live')),
	CONSTRAINT "projects_platform_check" CHECK (platform in ('web','mobile','desktop')),
	CONSTRAINT "projects_pricing_check" CHECK (pricing_model in ('free','freemium','paid','custom')),
	CONSTRAINT "projects_verification_check" CHECK (verification_state in ('unverified','github_verified','domain_verified')),
	CONSTRAINT "projects_status_check" CHECK (status in ('pending','published','limited','hidden','rejected','archived'))
);
--> statement-breakpoint
CREATE TABLE "rate_limit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bucket" text NOT NULL,
	"identifier" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ttl_seconds" integer DEFAULT 60 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_user_id" uuid,
	"target_type" text NOT NULL,
	"target_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"note" text,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reports_target_type_check" CHECK (target_type in ('project','post','comment')),
	CONSTRAINT "reports_status_check" CHECK (status in ('open','reviewed','resolved','rejected'))
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "view_impression_counters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"source" text NOT NULL,
	"session_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_project_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."project_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_health_checks" ADD CONSTRAINT "link_health_checks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_admin_user_id_profiles_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_click_events" ADD CONSTRAINT "project_click_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_click_events" ADD CONSTRAINT "project_click_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_owners" ADD CONSTRAINT "project_owners_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_owners" ADD CONSTRAINT "project_owners_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_posts" ADD CONSTRAINT "project_posts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_rank_snapshots" ADD CONSTRAINT "project_rank_snapshots_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_saves" ADD CONSTRAINT "project_saves_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_saves" ADD CONSTRAINT "project_saves_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_user_id_profiles_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "view_impression_counters" ADD CONSTRAINT "view_impression_counters_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_project_created_idx" ON "comments" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "comments_post_created_idx" ON "comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "link_health_checks_project_checked_idx" ON "link_health_checks" USING btree ("project_id","checked_at");--> statement-breakpoint
CREATE INDEX "magic_links_email_purpose_idx" ON "magic_links" USING btree ("email","purpose","created_at");--> statement-breakpoint
CREATE INDEX "moderation_actions_target_idx" ON "moderation_actions" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_email_idx" ON "profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "project_click_events_project_created_idx" ON "project_click_events" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "project_click_events_project_session_idx" ON "project_click_events" USING btree ("project_id","session_hash");--> statement-breakpoint
CREATE INDEX "project_owners_project_idx" ON "project_owners" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_posts_project_published_idx" ON "project_posts" USING btree ("project_id","published_at");--> statement-breakpoint
CREATE INDEX "project_rank_snapshots_project_captured_idx" ON "project_rank_snapshots" USING btree ("project_id","captured_at");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_live_url_normalized_idx" ON "projects" USING btree ("live_url_normalized");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_github_url_normalized_idx" ON "projects" USING btree ("github_url_normalized");--> statement-breakpoint
CREATE INDEX "projects_status_published_at_idx" ON "projects" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "projects_last_activity_idx" ON "projects" USING btree ("last_activity_at");--> statement-breakpoint
CREATE INDEX "rate_limit_events_bucket_identifier_idx" ON "rate_limit_events" USING btree ("bucket","identifier","created_at");--> statement-breakpoint
CREATE INDEX "reports_target_idx" ON "reports" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "reports_status_idx" ON "reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_hash_idx" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "view_impression_counters_project_session_idx" ON "view_impression_counters" USING btree ("project_id","session_hash");