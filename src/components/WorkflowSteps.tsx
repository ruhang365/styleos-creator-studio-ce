import type { ReactNode } from "react";

export interface WorkflowStepDef {
  key: string;
  label: string;
  desc: string;
}

export const WORKFLOW_STEPS: WorkflowStepDef[] = [
  { key: "intake", label: "采集顾客信息", desc: "结构化记录脸型、发质与造型诉求" },
  { key: "tags", label: "生成发型标签", desc: "从采集信息提炼特征标签" },
  { key: "rules", label: "匹配发型规则", desc: "用标签匹配可执行的发型方案" },
  { key: "report", label: "生成顾客报告", desc: "Lite Report，给顾客看的方案" },
  { key: "brief", label: "生成沟通卡", desc: "Barber Brief，给理发师看的执行卡" }
];

interface WorkflowStepsProps {
  /** 当前所处步骤的 key，传入后会高亮该步骤并标记此前步骤为已完成 */
  activeKey?: string;
  /** 可选：为每个步骤渲染操作区（如跳转按钮） */
  renderAction?: (step: WorkflowStepDef, index: number) => ReactNode;
}

export default function WorkflowSteps({ activeKey, renderAction }: WorkflowStepsProps) {
  const activeIndex = activeKey ? WORKFLOW_STEPS.findIndex((step) => step.key === activeKey) : -1;

  return (
    <ol className="flow-steps">
      {WORKFLOW_STEPS.map((step, index) => {
        const state = activeIndex === -1 ? "" : index < activeIndex ? "done" : index === activeIndex ? "active" : "";
        return (
          <li className={`flow-step ${state}`} key={step.key}>
            <span className="flow-step-num" aria-hidden="true">
              {index + 1}
            </span>
            <span className="flow-step-body">
              <span className="flow-step-label">{step.label}</span>
              <span className="flow-step-desc">{step.desc}</span>
              {renderAction ? <span className="flow-step-action">{renderAction(step, index)}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
