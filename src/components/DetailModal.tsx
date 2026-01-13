import {
  X,
  Calendar,
  Users,
  DollarSign,
  Building,
  Clock,
  MapPin,
  AlignLeft,
} from 'lucide-react';
import type { Inquiry } from '@/types';
import { PHASE_CONFIG } from '@/types';
import { formatCurrency, formatDisplayDate, formatRelativeDate } from '@/lib';
import { cn } from '@/lib';

interface DetailModalProps {
  inquiry: Inquiry;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailModal({ inquiry, isOpen, onClose }: DetailModalProps) {
  if (!isOpen) return null;

  const phaseConfig = PHASE_CONFIG[inquiry.phase];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-900">
              {inquiry.clientName}
            </h2>
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                phaseConfig.color.bg,
                phaseConfig.color.text,
              )}
            >
              {phaseConfig.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Main Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Event Details
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Calendar className="text-slate-400" size={18} />
                  <span>{formatDisplayDate(inquiry.eventDate)}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Users className="text-slate-400" size={18} />
                  <span>{inquiry.guestCount} Guests</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <DollarSign className="text-slate-400" size={18} />
                  <span className="font-medium">
                    {formatCurrency(inquiry.potentialValue)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                    TYPE
                  </span>
                  <span>{inquiry.eventType}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Contact
              </h3>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                  {inquiry.contactPerson.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {inquiry.contactPerson}
                  </p>
                  <p className="text-xs text-slate-500">Main Contact</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-slate-100" />

          {/* Hotels */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
              <Building size={16} />
              Requested Hotels
            </h3>

            {inquiry.hotels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {inquiry.hotels.map((hotel) => (
                  <span
                    key={hotel}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
                  >
                    <MapPin size={14} className="text-slate-400" />
                    {hotel}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                No hotels selected yet
              </p>
            )}
          </div>

          <hr className="my-6 border-slate-100" />

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
              <AlignLeft size={16} />
              Notes
            </h3>
            <div className="rounded-lg bg-yellow-50/50 p-4 border border-yellow-100 text-sm text-slate-700 leading-relaxed">
              {inquiry.notes}
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-8 flex items-center justify-between text-xs text-slate-400 border-t pt-4">
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              Created {formatRelativeDate(inquiry.createdAt)}
            </div>
            <div>Updated {formatRelativeDate(inquiry.updatedAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
