import React, { useState } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { Monitor, Volume2, Printer, CheckCircle, ArrowRight, Smartphone, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const KioskTouchGrid: React.FC = () => {
  const { setView } = useNeptuneStore();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [citizenName, setCitizenName] = useState('रामेश्वर प्रसाद (Rameshwar Prasad)');
  const [printedSlip, setPrintedSlip] = useState<boolean>(false);

  const topics = [
    { id: 'ration', icon: '🌾', title: 'राशन / PDS समस्या', subtitle: 'Ration Card Blockage & Grain Muster Roll', categoryKey: 'RATION_DELAY' },
    { id: 'pension', icon: '👵', title: 'पेंशन / वृद्धावस्था', subtitle: 'Pension Delay & Bank Account Linkage', categoryKey: 'PENSION_DELAY' },
    { id: 'roads', icon: '🛣️', title: 'सड़क / नाली निर्माण', subtitle: 'Road Potholes & Measurement Book', categoryKey: 'ROAD_POTHOLE' },
    { id: 'land', icon: '🚜', title: 'भूमि दाखिल-खारिज', subtitle: 'Land Mutation & Lekhpal Field Report', categoryKey: 'LAND_RECORDS' },
    { id: 'police', icon: '👮', title: 'थाना / FIR जांच', subtitle: 'Police Investigation & Case Diary', categoryKey: 'POLICE_FIR' },
  ];

  const handlePrintSlip = () => {
    setPrintedSlip(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#fbbf24'],
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Kiosk Header */}
      <div className="neptune-card neptune-card-glass" style={{ borderLeft: '4px solid var(--neptune-amber)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🇮🇳</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                जन सेवा केंद्र (CSC RURAL ASSISTED KIOSK)
              </h2>
            </div>
            <p style={{ fontSize: '0.86rem', marginTop: 4 }}>
              High-throughput village operator touch mode. 48px tactile targets, vernacular audio prompts, and 58mm ESC/POS thermal slip generator.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => alert('Audio Prompt: कृपया अपनी समस्या का विषय चुनें और माइक बटन दबाकर बोलें।')}>
              <Volume2 size={16} style={{ color: 'var(--neptune-amber-light)' }} />
              <span>🔊 आवाज़ सुनें (Audio Guide)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 48px Massive Touch Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {topics.map(t => {
          const isSelected = selectedTopic === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              className="touch-target-48"
              style={{
                background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--neptune-bg-card)',
                border: `2px solid ${isSelected ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                borderRadius: 16,
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'var(--neptune-transition)',
                boxShadow: isSelected ? 'var(--neptune-shadow-emerald)' : 'var(--neptune-shadow-sm)',
              }}
            >
              <div style={{
                fontSize: '2.2rem',
                width: 60,
                height: 60,
                borderRadius: 12,
                background: 'var(--neptune-bg-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {t.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--neptune-text-primary)' }}>
                  {t.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                  {t.subtitle}
                </div>
              </div>
              {isSelected && <CheckCircle size={22} style={{ color: 'var(--neptune-emerald)' }} />}
            </div>
          );
        })}
      </div>

      {/* Operator Ingest & Thermal Slip Split */}
      {selectedTopic && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
          {/* Operator Action Card */}
          <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              ऑपरेटर सहायता कंसोल (Operator Assisted Console)
            </h3>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neptune-text-secondary)' }}>
                नागरिक का नाम (Citizen Full Name):
              </label>
              <input
                type="text"
                className="input-field"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                style={{ marginTop: 4 }}
              />
            </div>

            <div style={{
              background: 'var(--neptune-bg-surface)',
              border: '1px solid var(--neptune-border-card)',
              borderRadius: 10,
              padding: '1rem',
            }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--neptune-text-primary)' }}>
                🎙️ ग्रामीण नागरिक की आवाज़ रिकॉर्ड करें:
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--neptune-text-secondary)', marginTop: 4 }}>
                Citizen speaks in local dialect (Bhojpuri/Hindi/Maithili). System compiles directly into Certified Section 2(f) Record Demands.
              </div>
              <button
                onClick={() => setView('intake')}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
              >
                <span>Launch Audio Ingest Worklet</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <button onClick={handlePrintSlip} className="btn btn-amber btn-lg" style={{ flex: 1 }}>
                <Printer size={18} />
                <span>प्रिंट रसीद (Thermal Slip)</span>
              </button>
            </div>
          </div>

          {/* 58mm Thermal Print Receipt Preview */}
          <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700, marginBottom: '0.75rem' }}>
              58mm ESC/POS Thermal Slip Simulation
            </div>

            <div className="thermal-slip">
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 13, borderBottom: '1px dashed #000', paddingBottom: 6, marginBottom: 8 }}>
                ================================<br />
                PROJECT NEPTUNE CIVIC<br />
                GOVERNMENT OF INDIA RTI<br />
                CSC VILLAGE KIOSK #42<br />
                ================================
              </div>

              <div><strong>Reg No   :</strong> CSC/UP/2026/08912</div>
              <div><strong>Date     :</strong> {new Date().toLocaleDateString('en-IN')} 11:42 AM</div>
              <div><strong>Citizen  :</strong> {citizenName.toUpperCase()}</div>
              <div><strong>Category :</strong> {selectedTopic.toUpperCase()}</div>
              <div><strong>Statutory:</strong> RTI ACT 2005 (SEC 6)</div>
              <div style={{ margin: '6px 0', borderTop: '1px dashed #000', paddingTop: 4 }}>
                <div><strong>STATUS   :</strong> DISPATCHED TO CPIO</div>
                <div><strong>DEADLINE :</strong> 30 STATUTORY DAYS</div>
                <div><strong>SLA CLOCK:</strong> RUNNING</div>
              </div>
              <div style={{ borderTop: '1px dashed #000', paddingTop: 4, marginTop: 4 }}>
                <div><strong>EVIDENCE HASH:</strong></div>
                <div style={{ fontSize: 9, wordBreak: 'break-all' }}>SHA256: 4f9b20e819b...91a2</div>
                <div>BSA 2023 SEC 63 CERTIFIED</div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 8, borderTop: '1px dashed #000', paddingTop: 6 }}>
                <strong>TRACK ON PHONE:</strong><br />
                SMS 'RTI 08912' to 9220592205<br />
                ================================
              </div>
            </div>

            {printedSlip && (
              <div style={{ marginTop: '0.75rem', color: 'var(--neptune-emerald-light)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={14} />
                <span>Thermal ESC/POS Slip Emitted Successfully</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
