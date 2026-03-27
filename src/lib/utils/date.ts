import { format, formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";

export function formatDate(date: Date | string) {
  return format(new Date(date), "yyyy.MM.dd", { locale: ko });
}

export function formatRelative(date: Date | string) {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
    locale: ko
  });
}
