import React from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { HelpCircle, X, Shield, Clock, FileText, CheckCircle2, Scale, Sparkles, AlertCircle } from 'lucide-react';

export const HelpGuideModal: React.FC = () => {
  const { isHelpOpen, setHelpOpen, setView } = useNeptuneStore();

  if (!isHelpOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--neptune-bg-elevated)',
        border: '1px solid var(--neptune-border-card)',
        borderRadius: 20,
        maxWidth: 720,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--neptune-border-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--neptune-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                How Project Neptune Works • नेपच्यून का उपयोग कैसे करें
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                Simple, citizen-first guide to holding government authorities accountable under RTI Act 2005
              </p>
            </div>
          </div>
          <button
            onClick={() => setHelpOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--neptune-text-secondary)',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick 3-Step Journey */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="var(--neptune-emerald)" />
              The 3 Simple Steps to File & Win
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div style={{
                background: 'var(--neptune-bg-surface)',
                border: '1px solid var(--neptune-border-card)',
                borderRadius: 12,
                padding: '1rem',
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>🗣️</div>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--neptune-text-primary)' }}>
                  1. Speak or Write
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neptune-text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                  Explain your issue in plain words (Hindi, English, Bhojpuri, etc.). No legal jargon needed.
                </div>
              </div>

              <div style={{
                background: 'var(--neptune-bg-surface)',
                border: '1px solid var(--neptune-border-card)',
                borderRadius: 12,
                padding: '1rem',
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>⚖️</div>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--neptune-text-primary)' }}>
                  2. Auto Legal Draft
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neptune-text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                  Neptune turns your complaint into official Section 2(f) certified record queries that officials cannot dodge.
                </div>
              </div>

              <div style={{
                background: 'var(--neptune-bg-surface)',
                border: '1px solid var(--neptune-border-card)',
                borderRadius: 12,
                padding: '1rem',
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>⏱️</div>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--neptune-text-primary)' }}>
                  3. 30-Day Deadline Clock
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neptune-text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                  Officials must reply in 30 days. If they don't, 1-click generates a free legal First Appeal for you!
                </div>
              </div>
            </div>
          </div>

          {/* Key Legal Rights Every Citizen Has */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 14,
            padding: '1rem 1.25rem',
          }}>
            <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: 'var(--neptune-emerald-light)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Scale size={16} />
              Your Rights Under India's RTI Act 2005:
            </h4>
            <ul style={{ margin: '0.5rem 0 0 1.2rem', padding: 0, fontSize: '0.8rem', color: 'var(--neptune-text-secondary)', display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.4 }}>
              <li><strong>Right to Certified Records (Section 2(f)):</strong> You have the legal right to ask for actual copies of government memos, registers, sanction letters, and bills—not just oral explanations.</li>
              <li><strong>Strict 30-Day Time Limit (Section 7(1)):</strong> The Public Information Officer (CPIO) must give you the information within 30 days of receiving your application.</li>
              <li><strong>Free Information on Delay (Section 7(6)):</strong> If the department fails to answer within 30 days, they must legally provide all requested records completely FREE of charge.</li>
              <li><strong>Personal Fines for Officers (Section 20):</strong> Officers who unlawfully delay or deny information face personal salary deductions of ₹250 per day up to ₹25,000.</li>
            </ul>
          </div>

          {/* Citizen Mode vs Advocate Mode */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Mode Switcher: Citizen vs Advocate
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: 'var(--neptune-bg-surface)', padding: '0.75rem', borderRadius: 10, border: '1px solid var(--neptune-border-card)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--neptune-emerald-light)' }}>
                  👤 Citizen Mode (Default)
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  Clean, friendly view showing: What did I ask? When is the officer's reply due? What are my 1-click next steps?
                </div>
              </div>
              <div style={{ background: 'var(--neptune-bg-surface)', padding: '0.75rem', borderRadius: 10, border: '1px solid var(--neptune-border-card)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--neptune-cobalt-light)' }}>
                  ⚖️ Advocate Mode
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  For RTI activists and lawyers: 3-pane litigation suite, CPIO resistance radar, Merkle tree evidence chain, and multi-case kanban.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--neptune-border-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--neptune-bg-surface)',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--neptune-text-tertiary)' }}>
            Free & Open Source Civic Technology • 100% Client-Side Privacy
          </span>
          <button
            onClick={() => {
              setHelpOpen(false);
              setView('intake');
            }}
            className="btn btn-primary btn-sm"
          >
            <span>Start Drafting an RTI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
