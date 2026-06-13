import Link from "next/link";

const layers = [
  {
    name: "styleos-protocol",
    role: "open standard",
    description: "Defines public rule-card structure, tag language, and interoperability contracts."
  },
  {
    name: "creator-studio-ce",
    role: "open-source community edition",
    description: "Turns the open protocol into a local-first creator workflow for small-B services."
  },
  {
    name: "StyleOS Cloud",
    role: "future hosted product",
    description: "Planned official hosted product for creators who do not want to self-host."
  },
  {
    name: "StyleOS Pro",
    role: "future advanced knowledge library",
    description: "Planned closed advanced knowledge layer, separate from the open CE repository."
  }
];

export default function HomePage() {
  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="label">Local-first community edition</p>
          <h1>StyleOS Creator Studio CE</h1>
          <p className="hero-text">
            开源社区版小 B 工作台，把粉丝咨询转化为 intake、标签、规则匹配、Lite Report、Barber Brief 和候选知识队列。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/dashboard">
              Enter Studio
            </Link>
            <a className="button" href="https://github.com/ruhang365/styleos-protocol">
              View Protocol
            </a>
            <a
              className="button ghost"
              href="https://github.com/ruhang365/styleos-creator-studio-ce/blob/main/PRODUCT.md"
            >
              Read Product Docs
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Product workflow preview">
          <div className="workflow-step active">Fan Intake</div>
          <div className="workflow-step">Style Tags</div>
          <div className="workflow-step">Rule Matching</div>
          <div className="workflow-step">Lite Report</div>
          <div className="workflow-step">Feedback</div>
          <div className="workflow-step">Candidate Knowledge</div>
        </div>
      </section>

      <section className="layer-grid" aria-label="StyleOS product layers">
        {layers.map((layer) => (
          <article className="layer-card" key={layer.name}>
            <p className="label">{layer.role}</p>
            <h2>{layer.name}</h2>
            <p>{layer.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
