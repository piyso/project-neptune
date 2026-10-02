import React, { useState } from 'react';
import { X, ShieldAlert, Lock, Database, Globe, UserCheck, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';
import { useNeptuneStore, IndicLanguage } from '../../store/useNeptuneStore.js';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, theme, toggleTheme } = useNeptuneStore();
  const [proxyShieldEnabled, setProxyShieldEnabled] = useState(true);
  const [deadManSwitchEnabled, setDeadManSwitchEnabled] = useState(false);
  const [proxyAddress, setProxyAddress] = useState('Neptune Legal Enclave, Post Box #819, GPO New Delhi 110001');

  if (!isOpen) return null;

  const languages: { code: IndicLanguage; label: string; script: string }[] = [
    { code: 'HINDI', label: 'Hindi', script: 'हिन्दी' },
    { code: 'ENGLISH', label: 'English', script: 'English' },
    { code: 'BHOJPURI', label: 'Bhojpuri', script: 'भोजपुरी' },
    { code: 'TAMIL', label: 'Tamil', script: 'தமிழ்' },
    { code: 'BENGALI', label: 'Bengali', script: 'বাংলা' },
    { code: 'MARATHI', label: 'Marathi', script: 'मराठी' },
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: 640 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--neptune-border-subtle)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={20} color="var(--neptune-emerald-light)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Sovereign Privacy & Security Configuration</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--neptune-text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Section 1: Whistleblower Protection Shield */}
        <div style={{
          background: proxyShieldEnabled ? 'rgba(16, 185, 129, 0.08)' : 'var(--neptune-bg-elevated)',
          border: `1px solid ${proxyShieldEnabled ? 'rgba(16, 185, 129, 0.3)' : 'var(--neptune-border-subtle)'}`,
          borderRadius: 12,
          padding: '1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert size={18} color="var(--neptune-emerald-light)" />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Avishek Goenka Whistleblower Address Shield</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)' }}>Calcutta High Court W.P. No. 33290(W) of 2013 Doctrine</div>
              </div>
            </div>
            <button
              onClick={() => setProxyShieldEnabled(!proxyShieldEnabled)}
              style={{
                background: proxyShieldEnabled ? 'var(--neptune-emerald)' : 'var(--neptune-border-subtle)',
                color: '#fff',
                border: 'none',
                padding: '0.35rem 0.8rem',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {proxyShieldEnabled ? 'ACTIVE SHIELD' : 'DISABLED'}
            </button>
          </div>

          <p style={{ margin: '0 0 8px', fontSize: '0.76rem', color: 'var(--neptune-text-secondary)' }}>
            Hides your doorstep residential coordinates from corrupt officials. Official replies are routed through our accredited institutional post box to prevent physical intimidation.
          </p>

          {proxyShieldEnabled && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.8rem', borderRadius: 8, fontSize: '0.75rem', fontFamily: 'var(--neptune-font-mono)', color: 'var(--neptune-emerald-light)' }}>
              Proxy Address: {proxyAddress}
            </div>
          )}
        </div>

        {/* Section 2: Shamir's Dead-Man Switch */}
        <div style={{
          background: deadManSwitchEnabled ? 'rgba(245, 158, 11, 0.08)' : 'var(--neptune-bg-elevated)',
          border: `1px solid ${deadManSwitchEnabled ? 'rgba(245, 158, 11, 0.3)' : 'var(--neptune-border-subtle)'}`,
          borderRadius: 12,
          padding: '1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <KeyRound size={18} color="var(--neptune-amber)" />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Cryptographic Dead-Man Switch</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)' }}>Shamir 3-of-5 Threshold Dispersal for Sensitive Inquiries</div>
              </div>
            </div>
            <button
              onClick={() => setDeadManSwitchEnabled(!deadManSwitchEnabled)}
              style={{
                background: deadManSwitchEnabled ? 'var(--neptune-amber)' : 'var(--neptune-border-subtle)',
                color: deadManSwitchEnabled ? '#000' : '#fff',
                border: 'none',
                padding: '0.35rem 0.8rem',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {deadManSwitchEnabled ? 'ARMED' : 'OFF'}
            </button>
          </div>

          <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--neptune-text-secondary)' }}>
            If a high-stakes whistleblower inquiry is active and you miss your 14-day safety check-in, the system automatically dispatches the unredacted evidence vault to the Lokpal, CVC, and accredited press agencies.
          </p>
        </div>

        {/* Section 3: Vernacular Language Selection */}
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--neptune-text-secondary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Globe size={14} />
            <span>PRIMARY VERNACULAR INTERFACE LANGUAGE</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                style={{
                  background: language === l.code ? 'rgba(16, 185, 129, 0.15)' : 'var(--neptune-bg-elevated)',
                  border: `1px solid ${language === l.code ? 'var(--neptune-emerald)' : 'var(--neptune-border-subtle)'}`,
                  color: language === l.code ? 'var(--neptune-emerald-light)' : 'var(--neptune-text-primary)',
                  padding: '0.55rem',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div>{l.script}</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>{l.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Offline Storage Telemetry */}
        <div style={{ background: 'var(--neptune-bg-elevated)', borderRadius: 10, padding: '0.8rem', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--neptune-text-secondary)' }}>
            <Database size={14} />
            <span>IndexedDB Offline Vault Quota:</span>
            <strong style={{ color: 'var(--neptune-emerald-light)' }}>48.5 MB Allocated (CRDT Active)</strong>
          </div>
          <span style={{ color: 'var(--neptune-text-secondary)', fontFamily: 'var(--neptune-font-mono)' }}>0 Brownout Backlog</span>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} className="primary-btn" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
            Save Security Profile
          </button>
        </div>
      </div>
    </div>
  );
};
