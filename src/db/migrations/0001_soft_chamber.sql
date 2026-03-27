ALTER TABLE "project_posts" DROP CONSTRAINT "project_posts_status_check";--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_status_check";--> statement-breakpoint
ALTER TABLE "project_posts" ADD CONSTRAINT "project_posts_status_check" CHECK (status in ('pending','published','hidden','rejected'));--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_status_check" CHECK (status in ('open','reviewing','resolved','rejected'));