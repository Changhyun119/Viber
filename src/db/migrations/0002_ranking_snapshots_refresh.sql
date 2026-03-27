ALTER TABLE "project_rank_snapshots" RENAME COLUMN "score" TO "final_score";--> statement-breakpoint
ALTER TABLE "project_rank_snapshots" RENAME COLUMN "unique_clicks" TO "unique_try_clicks_7d";--> statement-breakpoint
ALTER TABLE "project_rank_snapshots" RENAME COLUMN "save_count" TO "new_saves_30d";--> statement-breakpoint
ALTER TABLE "project_rank_snapshots" RENAME COLUMN "comment_count" TO "comment_signal_30d";--> statement-breakpoint
ALTER TABLE "project_rank_snapshots" RENAME COLUMN "captured_at" TO "computed_at";--> statement-breakpoint
ALTER TABLE "project_rank_snapshots" ADD COLUMN "freshness_multiplier" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "project_rank_snapshots" ADD COLUMN "quality_multiplier" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "project_rank_snapshots" ADD COLUMN "rank_position" integer;--> statement-breakpoint
DROP INDEX "project_rank_snapshots_project_captured_idx";--> statement-breakpoint
CREATE INDEX "project_rank_snapshots_project_computed_idx" ON "project_rank_snapshots" USING btree ("project_id","computed_at");--> statement-breakpoint
CREATE INDEX "view_impression_counters_project_source_created_idx" ON "view_impression_counters" USING btree ("project_id","source","created_at");
