export default function ReportPreview({ markdown }: { markdown: string }) {
  return (
    <section className="panel">
      <h3>顾客报告 / Lite Report</h3>
      <pre className="report-paper">{markdown}</pre>
    </section>
  );
}
