import React from 'react';
import { ShieldAlert, Scale, CheckCircle2, TrendingUp, AlertOctagon, HelpCircle } from 'lucide-react';

interface CpioDispositionRadarProps {
  authorityName: string;
  cpioName?: string;
  resistanceScore?: number; // 0 to 100
}

export const CpioDispositionRadar: React.FC<CpioDispositionRadarProps> = ({
  authorityName,
  cpioName = 'Chief General Manager / Designated CPIO',
  resistanceScore = 74,
}) => {
  const getRiskLabel = (score: number) => {
    if (score >= 70) return { label: 'HIGH STONEWALL RISK', color: 'var(--neptune-crimson)', bg: 'rgba(239, 68, 68, 0.15)' };
    if (score >= 40) return { label: 'MODERATE DELAY RISK', color: 'var(--neptune-amber)', bg: 'rgba(245, 158, 11, 0.15)' };
    return { label: 'COMPLIANT REGIME', color: 'var(--neptune-emerald)', bg: 'rgba(16, 185, 129, 0.15)' };
  };

  const risk = getRiskLabel(resistanceScore);

  return (
    <div style={{
      background: 'var(--neptune-bg-card)',
      border: '1px solid var(--neptune-border-subtle)',
      borderRadius: 16,
      padding: '1.2rem',
      boxShadow: 'var(--neptune-shadow-card)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--neptune-border-subtle)', paddingBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={18} color={risk.color} />
          <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700 }}>CPIO Behavioral Disposition Radar</h4>
        </div>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          fontFamily: 'var(--neptune-font-mono)',
          padding: '0.2rem 0.6rem',
          borderRadius: 6,
          background: risk.bg,
          color: risk.color,
          border: `1px solid ${risk.color}`,
        }}>
          {risk.label}
        </div>
      </div>

      {/* CPIO Info */}
      <div style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
        <div style={{ color: 'var(--neptune-text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--neptune-font-mono)' }}>TARGET PUBLIC AUTHORITY</div>
        <div style={{ fontWeight: 700, color: 'var(--neptune-text-primary)' }}>{authorityName}</div>
        <div style={{ color: 'var(--neptune-text-secondary)', fontSize: '0.75rem', marginTop: 2 }}>CPIO: {cpioName}</div>
      </div>

      {/* Resistance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: '1.2rem' }}>
        <div style={{ background: 'var(--neptune-bg-elevated)', padding: '0.6rem', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: risk.color }}>{resistanceScore}%</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--neptune-text-secondary)' }}>Resistance Index</div>
        </div>
        <div style={{ background: 'var(--neptune-bg-elevated)', padding: '0.6rem', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neptune-amber)' }}>+21d</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--neptune-text-secondary)' }}>Avg SLA Breach</div>
        </div>
        <div style={{ background: 'var(--neptune-bg-elevated)', padding: '0.6rem', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neptune-cobalt)' }}>82%</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--neptune-text-secondary)' }}>Sec 8(1)(j) Claim</div>
        </div>
      </div>

      {/* Preemptive Estoppel Chips */}
      <div>
        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--neptune-text-secondary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Scale size={14} color="var(--neptune-emerald-light)" />
          <span>PREEMPTIVE LEGAL ESTOPPEL CLAUSES INJECTED:</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 8,
            padding: '0.45rem 0.7rem',
            fontSize: '0.74rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6,
          }}>
            <CheckCircle2 size={14} color="var(--neptune-emerald-light)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Naval Kishore v. BSNL:</strong> Public contract evaluation sheets & measurement logs are not confidential commercial secrets under Section 8(1)(d).
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 8,
            padding: '0.45rem 0.7rem',
            fontSize: '0.74rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6,
          }}>
            <CheckCircle2 size={14} color="var(--neptune-emerald-light)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Bhagat Singh v. CIC (Delhi HC):</strong> Mere administrative or vigilance inquiry pendency is not ground for withholding records without a judicial injunction.
            </div>
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: 8,
            padding: '0.45rem 0.7rem',
            fontSize: '0.74rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6,
          }}>
            <CheckCircle2 size={14} color="var(--neptune-cobalt)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Section 10 Severability Invariant:</strong> Preempts DPDP 2023 blanket redaction by demanding masking of exempt portions with disclosure of remainder.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
