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
    mostUsefulPart: "Barber Brief",
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
          Was the report easy to understand?
          <select
            value={draft.easyToUnderstand}
            onChange={(event) => setDraft({ ...draft, easyToUnderstand: event.target.value as FeedbackDraft["easyToUnderstand"] })}
          >
            <option value="yes">yes</option>
            <option value="partly">partly</option>
            <option value="no">no</option>
          </select>
        </label>
        <label className="field">
          Which part was most useful?
          <input
            value={draft.mostUsefulPart}
            onChange={(event) => setDraft({ ...draft, mostUsefulPart: event.target.value })}
          />
        </label>
        <label className="field">
          Will you use the barber brief?
          <select
            value={draft.willUseBarberBrief}
            onChange={(event) => setDraft({ ...draft, willUseBarberBrief: event.target.value as FeedbackDraft["willUseBarberBrief"] })}
          >
            <option value="yes">yes</option>
            <option value="not_sure">not sure</option>
            <option value="no">no</option>
          </select>
        </label>
        <label className="field">
          Did you show it to a hairstylist?
          <select
            value={draft.showedToHairstylist}
            onChange={(event) => setDraft({ ...draft, showedToHairstylist: event.target.value as FeedbackDraft["showedToHairstylist"] })}
          >
            <option value="yes">yes</option>
            <option value="planned">planned</option>
            <option value="no">no</option>
          </select>
        </label>
        <label className="field">
          Satisfaction score 1-5
          <input
            max="5"
            min="1"
            type="number"
            value={draft.satisfactionScore}
            onChange={(event) => setDraft({ ...draft, satisfactionScore: Number(event.target.value) })}
          />
        </label>
        <label className="field full">
          Creator note
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
            Consent to anonymized learning
          </span>
        </label>
      </div>
      <button className="button primary" type="submit">
        Submit Feedback
      </button>
    </form>
  );
}
