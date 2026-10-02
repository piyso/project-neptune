import React from 'react';
import { ICitizenRTIDossier } from '../../types/dossier.js';
import { TimelineEvent } from '../../types/timeline.js';
import { CheckCircle2, Clock, AlertTriangle, Scale, ShieldCheck, ArrowRight, CornerDownRight } from 'lucide-react';

interface StatutoryTimelineProps {
  dossier: ICitizenRTIDossier;
  events: TimelineEvent[];
  onTriggerAppeal: () => void;
}

export const StatutoryTimeline: React.FC<StatutoryTimelineProps> = ({
  dossier,
  events,
  onTriggerAppeal,
}) => {
  const clock = dossier.statutoryClock;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Statutory Header Status Card */}
      <div style={{
        background: clock.isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.08)',
        border: `1px solid ${clock.isOverdue ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.3)'}`,
        borderRadius: 12,
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`status-dot ${clock.isOverdue ? 'crimson' : 'emerald'}`} />
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: clock.isOverdue ? 'var(--neptune-crimson-light)' : 'var(--neptune-emerald-light)' }}>
              {clock.isOverdue ? 'STATUTORY BREACH: DEEMED REFUSAL UNDER SEC 7(2)' : `SLA RUNNING: ${clock.daysRemaining} DAYS REMAINING`}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
            Due Date: {new Date(clock.currentStatutoryDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Standard 30-Day Window {clock.hopCount > 0 && `(+${clock.hopCount * 5} Days for Sec 6(3) Transfer)`}
          </div>
        </div>

        {clock.isOverdue && (
          <button onClick={onTriggerAppeal} className="btn btn-danger btn-sm">
            <Scale size={15} />
            <span>Launch 1-Tap First Appeal (Sec 19)</span>
          </button>
        )}
      </div>

      {/* Section 7(6) Fee Forfeiture Banner if Overdue */}
      {clock.sec7_6_FeeWaiverActive && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 10,
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--neptune-amber-light)',
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>Section 7(6) Fee Immunity Activated:</strong> The Public Authority defaulted on the 30-day statutory limit. By law, the CPIO is legally barred from demanding any additional fee for photocopying, CD, or inspection. All records must be furnished 100% FREE.
          </div>
        </div>
      )}

      {/* Amazon-Style Visual Stepper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', paddingLeft: '1.25rem' }}>
        {/* Vertical tracking line */}
        <div style={{
          position: 'absolute',
          top: 14,
          bottom: 14,
          left: 10,
          width: 2,
          background: 'var(--neptune-border-card)',
          zIndex: 1,
        }} />

        {events.map((event, index) => {
          const isDone = event.status === 'COMPLETED';
          const isActive = event.status === 'ACTIVE';

          return (
            <div key={event.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', position: 'relative', zIndex: 2 }}>
              {/* Stepper Node Icon */}
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: isDone ? 'var(--neptune-emerald)' : isActive ? (clock.isOverdue ? 'var(--neptune-crimson)' : 'var(--neptune-amber)') : 'var(--neptune-bg-elevated)',
                border: '3px solid var(--neptune-bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0,
                marginTop: 2,
                boxShadow: isActive ? (clock.isOverdue ? 'var(--neptune-shadow-crimson)' : 'var(--neptune-shadow-amber)') : 'none',
              }}>
                {isDone ? <CheckCircle2 size={12} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
              </div>

              {/* Event Body */}
              <div style={{
                flex: 1,
                background: 'var(--neptune-bg-surface)',
                border: `1px solid ${isActive ? (clock.isOverdue ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)') : 'var(--neptune-border-card)'}`,
                borderRadius: 10,
                padding: '0.75rem 1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--neptune-text-primary)' }}>
                    {event.title}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)', fontFamily: 'var(--neptune-font-mono)' }}>
                    {event.timestamp}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', lineHeight: 1.45 }}>
                  {event.description}
                </div>
                {event.statutoryDaysAdded && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6 }} className="badge badge-amber">
                    <CornerDownRight size={12} /> +{event.statutoryDaysAdded} Days SLA Extension Calibrated
                  </div>
                )}
                {event.referenceNo && (
                  <div style={{ marginTop: 4, fontSize: '0.72rem', fontFamily: 'var(--neptune-font-mono)', color: 'var(--neptune-emerald-light)' }}>
                    Ref: {event.referenceNo}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
