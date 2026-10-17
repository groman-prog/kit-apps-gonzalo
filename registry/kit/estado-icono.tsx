type Estado = "sinrevisar" | "porhacer" | "curso" | "revision" | "hecha" | "bloqueada" | "cancelada";
const COLOR: Record<Estado, string> = {
  sinrevisar: "text-muted-foreground", porhacer: "text-muted-foreground",
  curso: "text-ring", revision: "text-ring", hecha: "text-success",
  bloqueada: "text-destructive", cancelada: "text-muted-foreground",
};
const DISCO = "M7 0a7 7 0 1 0 0 14A7 7 0 0 0 7 0Z";
const CHECK = "M11.1 5.1a.85.85 0 0 0-1.2-1.2L5.5 8.3 4.1 6.9a.85.85 0 0 0-1.2 1.2l2 2a.85.85 0 0 0 1.2 0l5-5Z";
const ASPA = "M4.9 3.7a.85.85 0 0 0-1.2 1.2L5.8 7 3.7 9.1a.85.85 0 1 0 1.2 1.2L7 8.2l2.1 2.1a.85.85 0 0 0 1.2-1.2L8.2 7l2.1-2.1a.85.85 0 0 0-1.2-1.2L7 5.8 4.9 3.7Z";

export function EstadoIcono({ estado, size = 14, label }: { estado: Estado; size?: number; label?: string }) {
  const anillo = <rect x="1" y="1" width="12" height="12" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />;
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className={`shrink-0 ${COLOR[estado]}`}
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {estado === "sinrevisar" && <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.571 1.571" />}
      {estado === "porhacer" && anillo}
      {estado === "curso" && <>{anillo}<path d="M7 7V3.5A3.5 3.5 0 0 1 7 10.5z" fill="currentColor" /></>}
      {estado === "revision" && <>{anillo}<path d="M7 7V3.5A3.5 3.5 0 1 1 3.5 7z" fill="currentColor" /></>}
      {estado === "hecha" && <path fill="currentColor" fillRule="evenodd" d={DISCO + CHECK} />}
      {(estado === "bloqueada" || estado === "cancelada") && <path fill="currentColor" fillRule="evenodd" d={DISCO + ASPA} />}
    </svg>
  );
}
