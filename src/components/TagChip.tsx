import type { StyleTag } from "@/types";

interface TagChipProps {
  tag: StyleTag;
  onRemove?: (tagId: string) => void;
}

export default function TagChip({ tag, onRemove }: TagChipProps) {
  return (
    <span className="chip">
      <strong>{tag.group}</strong>
      {tag.label}
      {onRemove ? (
        <button aria-label={`Remove ${tag.label}`} onClick={() => onRemove(tag.tagId)} type="button">
          x
        </button>
      ) : null}
    </span>
  );
}
