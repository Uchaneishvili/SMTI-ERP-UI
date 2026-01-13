import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Inquiry } from '@/types';
import { InquiryCard } from './InquiryCard';

interface SortableInquiryCardProps {
  inquiry: Inquiry;
  onClick?: () => void;
}

export function SortableInquiryCard({
  inquiry,
  onClick,
}: SortableInquiryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: inquiry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="opacity-50">
        <InquiryCard inquiry={inquiry} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <InquiryCard inquiry={inquiry} onClick={onClick} />
    </div>
  );
}
