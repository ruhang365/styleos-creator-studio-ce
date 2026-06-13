import Link from "next/link";
import type { Service } from "@/types";
import StatusBadge from "@/components/StatusBadge";

interface ServiceCardProps {
  service: Service;
  caseCount: number;
}

export default function ServiceCard({ service, caseCount }: ServiceCardProps) {
  return (
    <article className="card">
      <div className="card-row">
        <div>
          <h3>{service.serviceName}</h3>
          <p className="muted">{service.module}</p>
        </div>
        <StatusBadge status={service.status} />
      </div>
      <p>{service.description}</p>
      <p className="muted">Cases: {caseCount}</p>
      <div className="actions">
        <Link className="button" href={`/services/${service.serviceId}`}>
          Open Service
        </Link>
        <Link className="button ghost" href={service.intakePath}>
          Intake Form
        </Link>
      </div>
    </article>
  );
}
