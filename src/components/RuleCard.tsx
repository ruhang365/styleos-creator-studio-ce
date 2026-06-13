import type { RuleCard as RuleCardType, RuleMatch } from "@/types";
import StatusBadge from "@/components/StatusBadge";

interface RuleCardProps {
  rule: RuleCardType;
  match?: RuleMatch;
  selected: boolean;
  onToggle?: (ruleId: string) => void;
}

export default function RuleCard({ rule, match, selected, onToggle }: RuleCardProps) {
  return (
    <article className={`card rule-card ${selected ? "selected" : ""}`}>
      <div className="card-row">
        <div>
          <h3>{rule.rule_name}</h3>
          <p className="muted">{rule.rule_id}</p>
        </div>
        <StatusBadge status={rule.status} />
      </div>
      <p>
        <strong>Evidence:</strong> {rule.evidence_level}
      </p>
      <p>
        <strong>Recommendation:</strong> {rule.recommendation}
      </p>
      <p>
        <strong>Avoid:</strong> {rule.avoid.join(", ")}
      </p>
      <p className="muted">Limitations: {rule.limitations.join(" ")}</p>
      <p className="muted">Match reason: {match ? match.reasons.join("; ") : "Not matched yet"}</p>
      <div className="chips">
        {rule.tags.map((tag) => (
          <span className="chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      {onToggle ? (
        <button className="button" onClick={() => onToggle(rule.rule_id)} type="button">
          {selected ? "Unselect Rule" : "Select Rule"}
        </button>
      ) : null}
    </article>
  );
}
