"use client";

import { useState } from "react";
import type { Feedback } from "@/types";

type FeedbackDraft = Omit<Feedback, "feedbackId" | "reportId" | "caseId" | "createdAt">;

interface FeedbackFormProps {
  onSubmit: (draft: FeedbackDraft) => void;
}

export default function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [draft, setDraft] = useState<FeedbackDraft>({
    easyToUnderstand: "yes",
    mostUsefulPart: "理发师沟通卡",
    willUseBarberBrief: "yes",
    showedToHairstylist: "planned",
    satisfactionScore: 4,
    creatorNote: "",
    consentToAnonymizedLearning: false
  });

  return (
    <form
      className="form-card"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(draft);
      }}
    >
      <div className="form-grid">
        <label className="field">
          报告是否容易理解？
          <select
            value={draft.easyToUnderstand}
            onChange={(event) => setDraft({ ...draft, easyToUnderstand: event.target.value as FeedbackDraft["easyToUnderstand"] })}
          >
            <option value="yes">容易理解</option>
            <option value="partly">部分理解</option>
            <option value="no">不太理解</option>
          </select>
        </label>
        <label className="field">
          哪一部分最有帮助？
          <input
            value={draft.mostUsefulPart}
            onChange={(event) => setDraft({ ...draft, mostUsefulPart: event.target.value })}
          />
        </label>
        <label className="field">
          是否会使用理发师沟通卡？
          <select
            value={draft.willUseBarberBrief}
            onChange={(event) => setDraft({ ...draft, willUseBarberBrief: event.target.value as FeedbackDraft["willUseBarberBrief"] })}
          >
            <option value="yes">会使用</option>
            <option value="not_sure">还不确定</option>
            <option value="no">暂不使用</option>
          </select>
        </label>
        <label className="field">
          是否已经给理发师看过？
          <select
            value={draft.showedToHairstylist}
            onChange={(event) => setDraft({ ...draft, showedToHairstylist: event.target.value as FeedbackDraft["showedToHairstylist"] })}
          >
            <option value="yes">已经看过</option>
            <option value="planned">准备使用</option>
            <option value="no">还没有</option>
          </select>
        </label>
        <label className="field">
          满意度评分 1-5
          <input
            max="5"
            min="1"
            type="number"
            value={draft.satisfactionScore}
            onChange={(event) => setDraft({ ...draft, satisfactionScore: Number(event.target.value) })}
          />
        </label>
        <label className="field full">
          反馈说明
          <textarea
            value={draft.creatorNote}
            onChange={(event) => setDraft({ ...draft, creatorNote: event.target.value })}
          />
        </label>
        <label className="field full">
          <span>
            <input
              checked={draft.consentToAnonymizedLearning}
              onChange={(event) => setDraft({ ...draft, consentToAnonymizedLearning: event.target.checked })}
              type="checkbox"
            />{" "}
            同意将本次反馈脱敏后用于改进候选知识
          </span>
        </label>
      </div>
      <button className="button primary" type="submit">
        提交反馈
      </button>
    </form>
  );
}
