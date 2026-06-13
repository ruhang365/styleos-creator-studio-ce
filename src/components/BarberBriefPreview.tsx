export default function BarberBriefPreview({ brief }: { brief: string }) {
  return (
    <section className="panel">
      <h3>Barber Brief</h3>
      <pre className="report-paper">{brief}</pre>
    </section>
  );
}
