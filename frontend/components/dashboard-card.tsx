type DashboardCardProps = { title: string; description?: string; count?: number; children?: React.ReactNode; className?: string };

export function DashboardCard({ title, description, count, children, className = "span-4" }: DashboardCardProps) {
  return (
    <section className={`card ${className}`}>
      <h2>{title}</h2>
      {typeof count === "number" ? <div className="metric">{count}</div> : null}
      {description ? <p>{description}</p> : null}
      {children}
    </section>
  );
}
