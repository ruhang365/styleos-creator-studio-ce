export default function BarberBriefPreview({ brief }: { brief: string }) {
  return (
    <section className="panel">
      <h3>理发师沟通卡 / Barber Brief</h3>
      <pre className="report-paper">{brief}</pre>
    </section>
  );
}
