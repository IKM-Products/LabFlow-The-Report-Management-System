"use client";

interface ResultStatusBadgeProps {
  status: "pending" | "entered" | "validated" | string;
}

export function ResultStatusBadge({ status }: ResultStatusBadgeProps) {
  const normalized = status.toLowerCase().trim();

  const getStyles = () => {
    switch (normalized) {
      case "validated":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50";
      case "entered":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50";
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50";
    }
  };

  const getLabel = () => {
    switch (normalized) {
      case "validated":
        return "Certified & Validated";
      case "entered":
        return "Awaiting Review";
      case "pending":
      default:
        return "Pending Entry";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide transition-colors ${getStyles()}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {getLabel()}
    </span>
  );
}