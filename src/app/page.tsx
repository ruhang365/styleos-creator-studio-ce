import Link from "next/link";
import { WORKFLOW_STEPS } from "@/components/WorkflowSteps";

const layers = [
  {
    name: "采集与标签",
    role: "第 1 - 2 步",
    description: "结构化记录顾客脸型、发质与诉求，自动提炼成可复用的特征标签。"
  },
  {
    name: "规则匹配",
    role: "第 3 步",
    description: "用标签匹配本地发型方案规则，给出可执行、可解释的造型建议。"
  },
  {
    name: "顾客报告",
    role: "第 4 步",
    description: "一键生成 Lite Report，用顾客能看懂的语言说明方案与理由。"
  },
  {
    name: "理发师沟通卡",
    role: "第 5 步",
    description: "生成 Barber Brief，把方案翻译成理发师能直接执行的剪裁要点。"
  }
];

export default function HomePage() {
  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="label">发型顾问咨询工作台</p>
          <h1>StyleOS 造型工作台</h1>
          <p className="hero-text">
            给小 B 造型 / 发型创作者的实用工具。把一次粉丝咨询，沿着 5 步流程做成给顾客看的方案报告和给理发师看的沟通卡，并沉淀成可复用的经验。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/dashboard">
              进入工作台
            </Link>
            <a className="button" href="https://github.com/ruhang365/styleos-protocol">
              查看协议规范
            </a>
            <a
              className="button ghost"
              href="https://github.com/ruhang365/styleos-creator-studio-ce/blob/main/PRODUCT.md"
            >
              阅读产品文档
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="造型咨询流程预览">
          {WORKFLOW_STEPS.map((step, index) => (
            <div className={`workflow-step ${index === 0 ? "active" : ""}`} key={step.key}>
              {`${index + 1}. ${step.label}`}
            </div>
          ))}
        </div>
      </section>

      <section className="layer-grid" aria-label="造型咨询流程拆解">
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
