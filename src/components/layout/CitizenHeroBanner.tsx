import React, { useState } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { Sparkles, ArrowRight, HelpCircle, ChevronDown, ChevronUp, FolderKanban, Mic, Scale, CheckCircle2 } from 'lucide-react';

export const CitizenHeroBanner: React.FC = () => {
  const { currentView, setView, setHelpOpen, userMode } = useNeptuneStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If in advocate mode or user deliberately collapsed it, show compact pill
  if (isCollapsed) {
    return (
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 12,
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.82rem',
        marginBottom: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={15} color="var(--neptune-emerald-light)" />
          <span style={{ fontWeight: 600 }}>Project Neptune: India's Sovereign RTI Copilot</span>
          <span style={{ color: 'var(--neptune-text-secondary)', fontSize: '0.76rem' }}>• Voice & text complaints converted into legally binding RTI applications</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setHelpOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
          >
            <HelpCircle size={13} />
            <span>How RTI Works</span>
          </button>
          <button
            onClick={() => setIsCollapsed(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--neptune-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
            }}
          >
            <span>Show Quick Guide</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(30, 41, 59, 0.5) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: 16,
      padding: '1.25rem 1.5rem',
      boxShadow: 'var(--neptune-shadow-sm)',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '0.5rem',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 840 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              🇮🇳 CITIZEN EMPOWERMENT PLATFORM
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--neptune-emerald-light)', fontWeight: 600 }}>
              Right to Information Act, 2005
            </span>
          </div>

          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            margin: '0.25rem 0 0.4rem 0',
            letterSpacing: '-0.02em',
            color: 'var(--neptune-text-primary)',
          }}>
            Hold Government Accountable in 3 Simple Steps
          </h2>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--neptune-text-secondary)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Got an unresolved issue with rations, delayed pensions, potholed roads, college degrees, or police complaints?
            Speak or write in your own language. Project Neptune turns your words into official legal RTI questions that government officers must legally answer within 30 days.
          </p>
        </div>

        {/* Top actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setHelpOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}
          >
            <HelpCircle size={14} />
            <span>How RTI Works (FAQ)</span>
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            title="Minimize guide banner"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--neptune-border-card)',
              borderRadius: 6,
              color: 'var(--neptune-text-secondary)',
              cursor: 'pointer',
              padding: '4px 6px',
            }}
          >
            <ChevronUp size={14} />
          </button>
        </div>
      </div>

      {/* 3 Steps Visual Guide */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '0.85rem',
        marginTop: '1.1rem',
      }}>
        {/* Step 1 */}
        <div
          onClick={() => setView('intake')}
          style={{
            background: currentView === 'intake' ? 'rgba(16, 185, 129, 0.15)' : 'var(--neptune-bg-elevated)',
            border: `1px solid ${currentView === 'intake' ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
            borderRadius: 12,
            padding: '0.9rem',
            cursor: 'pointer',
            transition: 'var(--neptune-transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '1.2rem' }}>🗣️</span>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--neptune-emerald-light)' }}>
              Step 1: Speak or Type
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--neptune-text-secondary)', lineHeight: 1.4 }}>
            Tell us your problem in plain Hindi, English, Bhojpuri, etc. No legal degree or complex forms needed.
          </p>
        </div>

        {/* Step 2 */}
        <div
          onClick={() => setView('intake')}
          style={{
            background: 'var(--neptune-bg-elevated)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 12,
            padding: '0.9rem',
            cursor: 'pointer',
            transition: 'var(--neptune-transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '1.2rem' }}>⚖️</span>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--neptune-cyan)' }}>
              Step 2: Instant Legal Draft
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--neptune-text-secondary)', lineHeight: 1.4 }}>
            Our engine converts your problem into certified record queries (Section 2(f)) that officials cannot legally brush off.
          </p>
        </div>

        {/* Step 3 */}
        <div
          onClick={() => setView('dossiers')}
          style={{
            background: currentView === 'dossiers' ? 'rgba(16, 185, 129, 0.15)' : 'var(--neptune-bg-elevated)',
            border: `1px solid ${currentView === 'dossiers' ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
            borderRadius: 12,
            padding: '0.9rem',
            cursor: 'pointer',
            transition: 'var(--neptune-transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '1.2rem' }}>⏱️</span>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--neptune-amber-light)' }}>
              Step 3: 30-Day Clock & Auto Appeal
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--neptune-text-secondary)', lineHeight: 1.4 }}>
            The department has 30 days to reply. If they delay or reject, 1-click generates your free legal First Appeal!
          </p>
        </div>
      </div>

      {/* Quick Launch Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setView('intake')}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
        >
          <Mic size={15} />
          <span>Draft an RTI Now (बोलकर या लिखकर शुरू करें)</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={() => setView('dossiers')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <FolderKanban size={15} />
          <span>View Sample Cases & Deadlines</span>
        </button>
      </div>
    </div>
  );
};
