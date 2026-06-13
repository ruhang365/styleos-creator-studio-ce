export default function ReportPreview({ markdown }: { markdown: string }) {
  return <pre className="report-paper">{markdown}</pre>;
}
