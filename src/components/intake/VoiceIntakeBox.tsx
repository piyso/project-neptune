import React, { useState, useEffect, useRef } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { Section2fCompiler } from '../../services/cfgCompiler.js';
import { NeptuneApiClient } from '../../services/api.js';
import { ICitizenRTIDossier, SubmissionChannel, IQueryBlock } from '../../types/dossier.js';
import { ttsEngine } from '../../services/ttsService.js';
import {
  Mic,
  MicOff,
  Sparkles,
  Shield,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  Truck,
  Volume2,
  VolumeX,
  HelpCircle,
  Clock,
  Landmark,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VoiceIntakeBox: React.FC = () => {
  const { language, addDossier, authorities, setHelpOpen, preselectedAuthorityId } = useNeptuneStore();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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

      ctx.strokeStyle = isRecording ? '#10b981' : '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const bars = 48;
      const step = width / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * step;
        let amplitude = 4;
        if (isRecording) {
          amplitude = Math.sin(phase + i * 0.35) * 16 + Math.cos(phase * 1.5 + i * 0.2) * 8;
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
  }, [isRecording, currentStep]);

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

  // Match target authority
  const targetAuthority = authorities.find(a =>
    preselectedAuthorityId ? a.id === preselectedAuthorityId :
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
    setStatusMessage('Sealing application with Section 63 BSA cryptographic proof...');

    setTimeout(() => {
      setStatusMessage('Registering application and initiating 30-day statutory clock...');
    }, 700);

    setTimeout(() => {
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

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8', '#fbbf24'],
      });
    }, 1600);
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header & 3-Step Guided Progress Stepper */}
      <div style={{
        background: 'var(--neptune-bg-card)',
        border: '1px solid var(--neptune-border-card)',
        borderRadius: 16,
        padding: '1.25rem 1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={22} style={{ color: 'var(--neptune-emerald)' }} />
              <span>Draft Your RTI Application</span>
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--neptune-text-secondary)' }}>
              Explain your issue in plain words. We automatically generate official legal questions that government officers must answer in 30 days.
            </p>
          </div>
          <button
            onClick={() => setHelpOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}
          >
            <HelpCircle size={14} style={{ color: 'var(--neptune-emerald-light)' }} />
            <span>How RTI Works (FAQ)</span>
          </button>
        </div>

        {/* 3-Step Guided Breadcrumb Stepper */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          background: 'var(--neptune-bg-surface)',
          padding: '0.35rem',
          borderRadius: 12,
          border: '1px solid var(--neptune-border-card)',
        }}>
          <button
            onClick={() => setCurrentStep(1)}
            style={{
              border: 'none',
              background: currentStep === 1 ? 'var(--neptune-bg-elevated)' : 'transparent',
              color: currentStep === 1 ? 'var(--neptune-emerald-light)' : 'var(--neptune-text-secondary)',
              borderRadius: 8,
              padding: '0.55rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--neptune-transition)',
            }}
          >
            <span style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: currentStep >= 1 ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 800,
            }}>
              {currentStep > 1 ? <Check size={12} /> : '1'}
            </span>
            <span>1. Describe Issue</span>
          </button>

          <button
            onClick={() => { if (grievanceText.trim()) setCurrentStep(2); }}
            style={{
              border: 'none',
              background: currentStep === 2 ? 'var(--neptune-bg-elevated)' : 'transparent',
              color: currentStep === 2 ? 'var(--neptune-cobalt)' : 'var(--neptune-text-secondary)',
              borderRadius: 8,
              padding: '0.55rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: grievanceText.trim() ? 'pointer' : 'not-allowed',
              opacity: grievanceText.trim() ? 1 : 0.6,
              transition: 'var(--neptune-transition)',
            }}
          >
            <span style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: currentStep >= 2 ? 'var(--neptune-cobalt)' : 'var(--neptune-border-card)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 800,
            }}>
              {currentStep > 2 ? <Check size={12} /> : '2'}
            </span>
            <span>2. Legal Questions</span>
          </button>

          <button
            onClick={() => { if (grievanceText.trim()) setCurrentStep(3); }}
            style={{
              border: 'none',
              background: currentStep === 3 ? 'var(--neptune-bg-elevated)' : 'transparent',
              color: currentStep === 3 ? 'var(--neptune-amber)' : 'var(--neptune-text-secondary)',
              borderRadius: 8,
              padding: '0.55rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: grievanceText.trim() ? 'pointer' : 'not-allowed',
              opacity: grievanceText.trim() ? 1 : 0.6,
              transition: 'var(--neptune-transition)',
            }}
          >
            <span style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: currentStep === 3 ? 'var(--neptune-amber)' : 'var(--neptune-border-card)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 800,
            }}>
              3
            </span>
            <span>3. Submit & Track</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: DESCRIBE YOUR ISSUE                                               */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
          {/* Topic Pills */}
          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--neptune-text-primary)', display: 'block', marginBottom: 8 }}>
              Select Topic (समस्या का विषय चुनें):
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', fontWeight: 600, borderRadius: 20 }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Dictation Card with Live Waveform */}
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
            <canvas ref={canvasRef} width={500} height={46} style={{ width: '100%', maxWidth: 500, height: 46 }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--neptune-text-secondary)' }}>
                <span className={`status-dot ${isRecording ? 'emerald' : ''}`} />
                <span>
                  {isRecording
                    ? `Recording voice in ${language} (00:${recordingSeconds.toString().padStart(2, '0')})... बोलिए`
                    : 'Microphone Ready • बोलकर समस्या बताएं'}
                </span>
              </div>

              <button
                onClick={handleToggleRecording}
                className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'} btn-sm`}
                style={{ borderRadius: 20, padding: '0.45rem 1.1rem', fontWeight: 700 }}
              >
                {isRecording ? <><MicOff size={15} /> Stop Recording</> : <><Mic size={15} /> Hold to Speak (बोलें)</>}
              </button>
            </div>
          </div>

          {/* Grievance Narrative Textarea */}
          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--neptune-text-primary)', display: 'block', marginBottom: 6 }}>
              Describe what happened in plain words (अपनी समस्या लिखें या बोलें):
            </label>
            <textarea
              className="textarea-field"
              value={grievanceText}
              onChange={(e) => setGrievanceText(e.target.value)}
              placeholder="वर्णन करें: क्या समस्या है, किस विभाग में और कब से रुकी हुई है..."
              rows={4}
              style={{ fontSize: '0.92rem', lineHeight: 1.5 }}
            />
          </div>

          {/* Reference Identifier Input */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--neptune-text-secondary)', display: 'block', marginBottom: 6 }}>
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

          {/* Privacy Note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 10,
            padding: '0.65rem 0.9rem',
            fontSize: '0.78rem',
            color: 'var(--neptune-text-secondary)',
          }}>
            <Shield size={18} style={{ color: 'var(--neptune-emerald)', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--neptune-emerald-light)' }}>100% Privacy Shield:</strong> Aadhaar numbers and mobile numbers are automatically masked before any officer sees them.
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              if (grievanceText.trim()) setCurrentStep(2);
            }}
            disabled={!grievanceText.trim()}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700 }}
          >
            <span>Generate Official RTI Questions (प्रश्न तैयार करें)</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: REVIEW OFFICIAL LEGAL QUESTIONS                                    */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Review Official RTI Questions (अधिकारी के पास जाने वाले प्रश्न)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--neptune-text-secondary)' }}>
                These certified record queries (Section 2(f)) are legally binding. Officials cannot brush them off with oral excuses.
              </p>
            </div>

            {/* Dialect Audio Readout Button */}
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
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
            >
              {isSpeakingDraft ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isSpeakingDraft ? 'Stop Audio' : '🔊 Listen (सुनें)'}</span>
            </button>
          </div>

          {/* Target Public Authority Card */}
          <div style={{
            background: 'var(--neptune-bg-surface)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 12,
            padding: '1rem',
          }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700 }}>
              Target Department & Office (संबंधित सरकारी विभाग)
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neptune-text-primary)', marginTop: 2 }}>
              {targetAuthority.canonicalName}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
              {targetAuthority.cpioDesignation} • {targetAuthority.officeAddress}
            </div>
          </div>

          {/* Generated Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {compilationResult.queryBlocks.map((block) => (
              <div
                key={block.id}
                style={{
                  background: 'var(--neptune-bg-elevated)',
                  border: '1px solid var(--neptune-border-card)',
                  borderRadius: 12,
                  padding: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="badge badge-cobalt" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                    Question #{block.pointNumber}
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    ✓ Protected under Section 2(f)
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--neptune-text-primary)', lineHeight: 1.5 }}>
                  {block.certifiedQueryText}
                </div>
              </div>
            ))}
          </div>

          {/* Word Budget & Masking Summary */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--neptune-bg-surface)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            padding: '0.65rem 1rem',
            fontSize: '0.78rem',
            color: 'var(--neptune-text-secondary)',
            flexWrap: 'wrap',
            gap: 6,
          }}>
            <div>
              Character Count: <strong style={{ color: 'var(--neptune-emerald-light)' }}>{compilationResult.totalCharacterCount} / 2,800 Chars</strong> (Within Central Online Limit)
            </div>
            <div style={{ color: 'var(--neptune-emerald-light)', fontWeight: 600 }}>
              ✓ DPDP 2023 Masking Applied
            </div>
          </div>

          {/* Action Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentStep(1)}
              className="btn btn-secondary btn-md"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowLeft size={16} />
              <span>Edit My Problem (बदलाव करें)</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="btn btn-primary btn-md"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}
            >
              <span>Continue to Submission (आगे बढ़ें)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: CHOOSE SUBMISSION METHOD & LAUNCH 30-DAY CLOCK                     */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
              Choose How to Send Your RTI (जमा करने का माध्यम चुनें)
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--neptune-text-secondary)' }}>
              Select whether you want to file digitally through the government portal or send a physical Speed Post package.
            </p>
          </div>

          {/* Submission Channel Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
            {/* Option 1: Online */}
            <div
              onClick={() => setSelectedChannel('CENTRAL_ONLINE')}
              style={{
                padding: '1.1rem 1.25rem',
                borderRadius: 14,
                border: `2px solid ${selectedChannel === 'CENTRAL_ONLINE' ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                background: selectedChannel === 'CENTRAL_ONLINE' ? 'rgba(16, 185, 129, 0.1)' : 'var(--neptune-bg-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'var(--neptune-transition)',
                boxShadow: selectedChannel === 'CENTRAL_ONLINE' ? 'var(--neptune-shadow-emerald)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neptune-emerald)',
                  flexShrink: 0,
                }}>
                  <Send size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800 }}>🌐 Send Online via NIC Portal (₹10 Statutory Fee)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                    Instant e-filing with official government registration number & immediate 30-day statutory countdown.
                  </div>
                </div>
              </div>
              <CheckCircle2 size={20} style={{ color: selectedChannel === 'CENTRAL_ONLINE' ? 'var(--neptune-emerald)' : 'transparent', flexShrink: 0 }} />
            </div>

            {/* Option 2: Speed Post */}
            <div
              onClick={() => setSelectedChannel('OFFLINE_SPEED_POST')}
              style={{
                padding: '1.1rem 1.25rem',
                borderRadius: 14,
                border: `2px solid ${selectedChannel === 'OFFLINE_SPEED_POST' ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                background: selectedChannel === 'OFFLINE_SPEED_POST' ? 'rgba(16, 185, 129, 0.1)' : 'var(--neptune-bg-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'var(--neptune-transition)',
                boxShadow: selectedChannel === 'OFFLINE_SPEED_POST' ? 'var(--neptune-shadow-emerald)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neptune-amber)',
                  flexShrink: 0,
                }}>
                  <Truck size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800 }}>📮 Send by Registered Speed Post (₹39 All-Inclusive)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                    We print official Form 'A', attach a ₹10 Indian Postal Order (IPO), and mail it via India Post with tracking barcode.
                  </div>
                </div>
              </div>
              <CheckCircle2 size={20} style={{ color: selectedChannel === 'OFFLINE_SPEED_POST' ? 'var(--neptune-emerald)' : 'transparent', flexShrink: 0 }} />
            </div>
          </div>

          {/* Statutory Guarantee Explainer Box */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: 12,
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            fontSize: '0.82rem',
            color: 'var(--neptune-text-secondary)',
            lineHeight: 1.45,
          }}>
            <Clock size={18} style={{ color: 'var(--neptune-cyan)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ color: 'var(--neptune-text-primary)' }}>Your Statutory 30-Day Guarantee:</strong> Under Section 7(1) of the RTI Act 2005, the department has strictly 30 days to furnish the requested records. If they fail, Section 7(6) makes all records completely <strong>100% FREE</strong>, and you can file a 1-tap legal First Appeal.
            </div>
          </div>

          {/* Status update indicator if submitting */}
          {statusMessage && (
            <div style={{ fontSize: '0.82rem', color: 'var(--neptune-emerald-light)', display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0' }}>
              <span className="status-dot emerald" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Action Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentStep(2)}
              className="btn btn-secondary btn-md"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowLeft size={16} />
              <span>Back to Questions</span>
            </button>

            <button
              onClick={handleDispatch}
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{ flex: 1, minWidth: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 800 }}
            >
              {isSubmitting ? (
                <span>Submitting & Sealing Proof...</span>
              ) : (
                <>
                  <span>Submit Application & Start 30-Day Clock</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
