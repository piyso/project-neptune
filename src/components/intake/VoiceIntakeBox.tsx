import React, { useState, useEffect, useRef } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { Section2fCompiler } from '../../services/cfgCompiler.js';
import { NeptuneApiClient } from '../../services/api.js';
import { ICitizenRTIDossier, SubmissionChannel, IQueryBlock } from '../../types/dossier.js';
import { ttsEngine } from '../../services/ttsService.js';
import { Mic, MicOff, Sparkles, Shield, Send, CheckCircle2, AlertCircle, FileText, ArrowRight, Truck, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VoiceIntakeBox: React.FC = () => {
  const { language, addDossier, authorities } = useNeptuneStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [grievanceText, setGrievanceText] = useState(
    'राशन कार्ड 6 महीने से बंद कर दिया है, कोटेदार अनाज नहीं दे रहा और बोलता है ऊपर से नाम कट गया है।'
  );
  const [categoryKey, setCategoryKey] = useState('RATION_DELAY');
  const [specificId, setSpecificId] = useState('राशन कार्ड सं. 2149021882');
  const [selectedChannel, setSelectedChannel] = useState<SubmissionChannel>('CENTRAL_ONLINE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSpeakingDraft, setIsSpeakingDraft] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio Waveform Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw baseline
      ctx.strokeStyle = isRecording ? '#10b981' : '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const bars = 48;
      const step = width / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * step;
        let amplitude = 4;
        if (isRecording) {
          amplitude = Math.sin(phase + i * 0.35) * 18 + Math.cos(phase * 1.5 + i * 0.2) * 10;
        } else {
          amplitude = Math.sin(phase * 0.4 + i * 0.2) * 3;
        }
        ctx.moveTo(x, centerY - amplitude);
        ctx.lineTo(x, centerY + amplitude);
      }
      ctx.stroke();

      phase += isRecording ? 0.15 : 0.03;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording]);

  // Recording timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Real-time CFG Compilation
  const compilationResult = Section2fCompiler.compile(grievanceText, categoryKey, specificId);

  // Match authority
  const targetAuthority = authorities.find(a =>
    categoryKey === 'ROAD_POTHOLE' ? a.portalId === 'NHAI' :
    categoryKey === 'PENSION_DELAY' ? a.portalId === 'EPFO' :
    categoryKey === 'RATION_DELAY' ? a.portalId === 'DFPDS' || a.id.includes('ballia') :
    authorities[0]
  ) || authorities[0];

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate live speech recognition in Hindi/vernacular
      setTimeout(() => {
        setGrievanceText('कोटेदार ने बोला कि सर्वर डाउन है और पिछले 3 महीने का राशन लैप्स हो गया। मुझे ई-पॉस सर्वर लॉग और भौतिक रजिस्टर चाहिए।');
        setCategoryKey('RATION_DELAY');
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const handleDispatch = async () => {
    setIsSubmitting(true);
    setStatusMessage('Initiating Section 63 BSA Cryptographic Vault Sealing...');

    // Simulate pipeline steps
    setTimeout(async () => {
      setStatusMessage('Compiling Section 2(f) Context-Free Grammar query blocks...');
    }, 600);

    setTimeout(async () => {
      const regNo = selectedChannel === 'CENTRAL_ONLINE' ? `NIC/R/2026/${Math.floor(10000 + Math.random() * 90000)}` : undefined;
      const barcode = selectedChannel === 'OFFLINE_SPEED_POST' ? `EU${Math.floor(100000000 + Math.random() * 900000000)}IN` : undefined;

      const newDossier: ICitizenRTIDossier = {
        dossierId: `dossier-${Date.now().toString(36)}`,
        citizenUuid: 'citizen-prod-user-01',
        title: `${compilationResult.detectedCategory} - ${specificId || 'Grievance Dossier'}`,
        targetAuthority,
        filingChannel: selectedChannel,
        govRegistrationNumber: regNo,
        postalBarcode: barcode,
        rawGrievanceNarrative: grievanceText,
        categoryKey,
        queryBlocks: compilationResult.queryBlocks,
        totalCharacterCount: compilationResult.totalCharacterCount,
        isWordBudgetCompliant: compilationResult.isWordBudgetCompliant,
        maskedAadhaar: compilationResult.maskedNarrative,
        proxyAddressUsed: 'Chamber 402, High Court Bar Association, Sher Shah Road, New Delhi',
        merkleRootHash: `sha256-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
        statutoryClock: {
          filedDate: new Date().toISOString(),
          currentStatutoryDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          daysRemaining: 30,
          totalDays: 30,
          stage: 'PENDING_CPIO',
          isOverdue: false,
          hopCount: 0,
          sec7_6_FeeWaiverActive: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addDossier(newDossier);
      setIsSubmitting(false);
      setStatusMessage(null);

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8', '#fbbf24'],
      });
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="neptune-card neptune-card-glass" style={{ borderLeft: '4px solid var(--neptune-emerald)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={22} style={{ color: 'var(--neptune-emerald)' }} />
              Draft Your RTI Application • अपनी आरटीआई तैयार करें
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--neptune-text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
              Explain your issue in your own words. Our legal engine automatically turns your complaint into certified record queries (Section 2(f)) that government officials are legally mandated to answer within 30 days.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="badge badge-emerald">
              ⚖️ RTI Act 2005 Format
            </span>
            <span className="badge badge-cobalt">
              🔒 Privacy Shielded
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left Input & Recording | Right Live CFG Section 2(f) Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Voice & Grievance Input */}
        <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--neptune-text-primary)' }}>
              1. Speak or Write Your Grievance (अपनी समस्या बताएं)
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              Language: {language}
            </span>
          </div>

          {/* WebAudio Waveform Visualizer */}
          <div style={{
            background: 'var(--neptune-bg-surface)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 14,
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.85rem',
          }}>
            <canvas ref={canvasRef} width={420} height={48} className="waveform-canvas" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--neptune-text-secondary)' }}>
                <span className={`status-dot ${isRecording ? 'emerald' : ''}`} />
                <span>{isRecording ? `Recording voice (00:${recordingSeconds.toString().padStart(2, '0')})... बोलिए` : 'Microphone Ready • बोलकर बताएं'}</span>
              </div>

              <button
                onClick={handleToggleRecording}
                className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'} btn-sm`}
                style={{ borderRadius: 20, padding: '0.4rem 1rem', fontWeight: 700 }}
              >
                {isRecording ? <><MicOff size={15} /> Stop Recording</> : <><Mic size={15} /> Hold to Speak (बोलें)</>}
              </button>
            </div>
          </div>

          {/* Category Selector Pills */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--neptune-text-secondary)', display: 'block', marginBottom: 6 }}>
              Select Topic / समस्या का प्रकार:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {[
                { key: 'RATION_DELAY', label: '🌾 राशन (Ration / PDS)' },
                { key: 'ROAD_POTHOLE', label: '🛣️ सड़क (Roads & PWD)' },
                { key: 'PENSION_DELAY', label: '👵 पेंशन (Pension / EPFO)' },
                { key: 'LAND_RECORDS', label: '🚜 जमीन (Land & Mutation)' },
                { key: 'POLICE_FIR', label: '👮 पुलिस (Police FIR)' },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategoryKey(cat.key)}
                  className={`btn btn-sm ${categoryKey === cat.key ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', fontWeight: 600 }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grievance Narrative Textarea */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--neptune-text-secondary)', display: 'block', marginBottom: 6 }}>
              Describe what happened in plain words (अपनी समस्या लिखें):
            </label>
            <textarea
              className="textarea-field"
              value={grievanceText}
              onChange={(e) => setGrievanceText(e.target.value)}
              placeholder="वर्णन करें: क्या समस्या है, किस विभाग में और कब से रुकी हुई है..."
              rows={4}
              style={{ fontSize: '0.9rem', lineHeight: 1.5 }}
            />
          </div>

          {/* Reference Identifier Input */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--neptune-text-secondary)', display: 'block', marginBottom: 6 }}>
              Card No. / Application No. / File Reference (यदि कोई हो):
            </label>
            <input
              type="text"
              className="input-field"
              value={specificId}
              onChange={(e) => setSpecificId(e.target.value)}
              placeholder="e.g. Ration Card No, Pension PPO, or complaint number"
            />
          </div>

          {/* PII Masking Shield Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 10,
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            color: 'var(--neptune-text-secondary)',
          }}>
            <Shield size={20} style={{ color: 'var(--neptune-emerald)', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--neptune-emerald-light)' }}>100% Privacy Protected:</strong> Personal details like Aadhaar and mobile numbers are automatically masked before any officer sees them.
            </div>
          </div>
        </div>

        {/* Right Column: Live Section 2(f) Query Blocks & Submission Channels */}
        <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--neptune-text-primary)' }}>
              2. Official RTI Questions (अधिकारी के पास जाने वाले प्रश्न)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => {
                  if (isSpeakingDraft) {
                    ttsEngine.stop();
                    setIsSpeakingDraft(false);
                  } else {
                    const allText = compilationResult.queryBlocks.map(q => `बिंदु ${q.pointNumber}: ${q.certifiedQueryText}`).join('. ');
                    setIsSpeakingDraft(true);
                    ttsEngine.speak(allText, language, () => setIsSpeakingDraft(false), () => setIsSpeakingDraft(false));
                  }
                }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {isSpeakingDraft ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isSpeakingDraft ? 'Stop Audio' : '🔊 Listen (सुनें)'}</span>
              </button>
              <span className={`badge ${compilationResult.isWordBudgetCompliant ? 'badge-emerald' : 'badge-amber'}`}>
                {compilationResult.totalCharacterCount} / 2,800 Chars
              </span>
            </div>
          </div>

          {/* Friendly explainer note */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: 8,
            padding: '0.6rem 0.85rem',
            fontSize: '0.78rem',
            color: 'var(--neptune-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span>💡</span>
            <span><strong>Why these questions?</strong> Under RTI Section 2(f), officials cannot give oral excuses—they are legally bound to hand over certified copies of records within 30 days.</span>
          </div>

          {/* Target Public Authority Card */}
          <div style={{
            background: 'var(--neptune-bg-surface)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            padding: '0.75rem 1rem',
          }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700 }}>
              Target Department & Office (संबंधित सरकारी कार्यालय)
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--neptune-text-primary)', marginTop: 2 }}>
              {targetAuthority.canonicalName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--neptune-text-secondary)' }}>
              {targetAuthority.cpioDesignation} • {targetAuthority.officeAddress}
            </div>
          </div>

          {/* Compiled Query Blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 260, overflowY: 'auto' }}>
            {compilationResult.queryBlocks.map((block) => (
              <div
                key={block.id}
                style={{
                  background: 'var(--neptune-bg-elevated)',
                  border: '1px solid var(--neptune-border-card)',
                  borderRadius: 10,
                  padding: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="badge badge-cobalt" style={{ fontSize: '0.68rem' }}>
                    Question #{block.pointNumber}
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>
                    ✓ Protected by Law
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--neptune-text-primary)', lineHeight: 1.45 }}>
                  {block.certifiedQueryText}
                </div>
              </div>
            ))}
          </div>

          {/* Submission Channel Selection */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--neptune-text-secondary)', display: 'block', marginBottom: 6 }}>
              3. Choose How to Send Your RTI (जमा करने का तरीका):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              {/* Channel 1: Cloud */}
              <div
                onClick={() => setSelectedChannel('CENTRAL_ONLINE')}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  border: `1px solid ${selectedChannel === 'CENTRAL_ONLINE' ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                  background: selectedChannel === 'CENTRAL_ONLINE' ? 'rgba(16, 185, 129, 0.08)' : 'var(--neptune-bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'var(--neptune-transition)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Send size={18} style={{ color: 'var(--neptune-emerald)' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>🌐 Send Online via NIC Portal (₹10 Statutory Fee)</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)' }}>Instant e-filing with official government registration number</div>
                  </div>
                </div>
                <CheckCircle2 size={16} style={{ color: selectedChannel === 'CENTRAL_ONLINE' ? 'var(--neptune-emerald)' : 'transparent' }} />
              </div>

              {/* Channel 2: Speed Post */}
              <div
                onClick={() => setSelectedChannel('OFFLINE_SPEED_POST')}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  border: `1px solid ${selectedChannel === 'OFFLINE_SPEED_POST' ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                  background: selectedChannel === 'OFFLINE_SPEED_POST' ? 'rgba(16, 185, 129, 0.08)' : 'var(--neptune-bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'var(--neptune-transition)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Truck size={18} style={{ color: 'var(--neptune-amber)' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>📮 Send by Registered Speed Post (₹39 All-Inclusive)</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)' }}>We print Form 'A', attach ₹10 Postal Order (IPO), and mail it with tracking barcode</div>
                  </div>
                </div>
                <CheckCircle2 size={16} style={{ color: selectedChannel === 'OFFLINE_SPEED_POST' ? 'var(--neptune-emerald)' : 'transparent' }} />
              </div>
            </div>
          </div>

          {/* Action Dispatch Button */}
          {statusMessage && (
            <div style={{ fontSize: '0.78rem', color: 'var(--neptune-emerald-light)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="status-dot emerald" />
              <span>{statusMessage}</span>
            </div>
          )}

          <button
            onClick={handleDispatch}
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700 }}
          >
            {isSubmitting ? (
              <span>Submitting and sealing proof in vault...</span>
            ) : (
              <>
                <span>Submit RTI & Start 30-Day Response Clock</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
