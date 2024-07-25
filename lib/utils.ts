import { type ClassValue, clsx } from "clsx";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(form: Date) {
  const currentDate = new Date();

  if (currentDate.getTime() - form.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(form, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === form.getFullYear()) {
      return formatDate(form, "MMM d");
    } else {
      return formatDate(form, "MMM d, yyy");
    }
  }
}

export function formatNumber(n: number) {
  return Intl.NumberFormat("ru-RU", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
