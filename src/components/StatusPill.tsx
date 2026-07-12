import { statusColor, type AssetStatus } from "@/lib/mock-data";

export function StatusPill({ status }: { status: AssetStatus | string }) {
  const cls = statusColor[status as AssetStatus] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
