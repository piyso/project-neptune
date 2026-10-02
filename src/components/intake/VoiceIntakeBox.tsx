import React, { useState, useEffect, useRef } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { Section2fCompiler } from '../../services/cfgCompiler.js';
import { ICitizenRTIDossier, SubmissionChannel } from '../../types/dossier.js';
import { ttsEngine } from '../../services/ttsService.js';
import {
  Mic,
  MicOff,
  Sparkles,
  Shield,
  Send,
  CheckCircle2,
  FileText,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  HelpCircle,
  Clock,
  Landmark,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VoiceIntakeBox: React.FC = () => {
  const { language, addDossier, authorities, setHelpOpen, preselectedAuthorityId } = useNeptuneStore();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [grievanceText, setGrievanceText] = useState('');
  const [categoryKey, setCategoryKey] = useState('RATION_DELAY');
  const [specificId, setSpecificId] = useState('');
  const [showIdInput, setShowIdInput] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<SubmissionChannel>('CENTRAL_ONLINE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSpeakingDraft, setIsSpeakingDraft] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio Waveform Visualizer loop (active when recording)
  useEffect(() => {
    if (!isRecording) return;
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

      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const bars = 40;
      const step = width / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * step;
        const amplitude = Math.sin(phase + i * 0.35) * 14 + Math.cos(phase * 1.5 + i * 0.2) * 7;
        ctx.moveTo(x, centerY - amplitude);
        ctx.lineTo(x, centerY + amplitude);
      }
      ctx.stroke();

      phase += 0.15;
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
  const activeNarrative = grievanceText.trim() || 'राशन कार्ड 6 महीने से बंद कर दिया है, कोटेदार अनाज नहीं दे रहा और बोलता है ऊपर से नाम कट गया है।';
  const compilationResult = Section2fCompiler.compile(activeNarrative, categoryKey, specificId);

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
      // Simulate real-time vernacular speech-to-text
      setTimeout(() => {
        setGrievanceText('कोटेदार ने बोला कि सर्वर डाउन है और पिछले 3 महीने का राशन लैप्स हो गया। मुझे ई-पॉस सर्वर लॉग और भौतिक रजिस्टर चाहिए।');
        setCategoryKey('RATION_DELAY');
        setIsRecording(false);
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const handleApplyPreset = (text: string, catKey: string, sampleId: string) => {
    setGrievanceText(text);
    setCategoryKey(catKey);
    setSpecificId(sampleId);
    setShowIdInput(true);
  };

  const handleDispatch = async () => {
    setIsSubmitting(true);
    setStatusMessage('Applying Section 63 BSA cryptographic evidence seal...');

    setTimeout(() => {
      setStatusMessage('Registering application and initiating 30-day statutory countdown...');
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
        rawGrievanceNarrative: grievanceText || activeNarrative,
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
        colors: ['#059669', '#2563eb', '#f59e0b'],
      });
    }, 1600);
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 3-Step Guided Breadcrumb Stepper */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
      }}>
        {[
          { step: 1, label: '1. Describe Issue' },
          { step: 2, label: '2. Review Questions' },
          { step: 3, label: '3. Submit & Track' },
        ].map((s) => {
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;
          return (
            <button
              key={s.step}
              onClick={() => {
                if (s.step === 1 || grievanceText.trim() || currentStep >= s.step) {
                  setCurrentStep(s.step as any);
                }
              }}
              style={{
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: (s.step === 1 || grievanceText.trim()) ? 'pointer' : 'default',
                padding: '0.4rem 0.6rem',
              }}
            >
              <span style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: isDone ? 'var(--neptune-emerald)' : isActive ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
                transition: 'var(--neptune-transition)',
              }}>
                {isDone ? <Check size={13} /> : s.step}
              </span>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--neptune-text-primary)' : 'var(--neptune-text-tertiary)',
              }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: DESCRIBE YOUR ISSUE                                               */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="neptune-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--neptune-text-primary)' }}>
              What government problem are you facing?
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: 'var(--neptune-text-secondary)', lineHeight: 1.5 }}>
              Type or speak what happened. We automatically draft certified Section 2(f) questions that officers must legally answer in 30 days.
            </p>
          </div>

          {/* Quick Inspiration Presets */}
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700, marginBottom: 6 }}>
              Quick Templates (समस्या का विषय):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {[
                { label: '🌾 राशन (Ration / PDS)', cat: 'RATION_DELAY', text: 'राशन कार्ड 6 महीने से बंद कर दिया है, कोटेदार अनाज नहीं दे रहा और बोलता है ऊपर से नाम कट गया है।', id: 'राशन कार्ड सं. 2149021882' },
                { label: '👵 पेंशन (Pension Delay)', cat: 'PENSION_DELAY', text: 'वृद्धावस्था पेंशन पिछले 5 महीने से बैंक खाते में नहीं आ रही। समाज कल्याण विभाग में कोई सुनवाई नहीं हो रही।', id: 'पेंशन PPO: UP-2024-88412' },
                { label: '🛣️ सड़क (Road Quality / PWD)', cat: 'ROAD_POTHOLE', text: 'गांव की मुख्य सड़क 2 महीने पहले बनी थी और पहली बारिश में टूट गई। ठेकेदार का विवरण और माप पुस्तिका चाहिए।', id: 'सड़क कार्य सं. PWD-2025-09' },
                { label: '🚜 जमीन (Land Mutation)', cat: 'LAND_RECORDS', text: 'दाखिल-खारिज का आवेदन 8 महीने से लंबित है। लेखपाल रिपोर्ट नहीं लगा रहा।', id: 'आवेदन सं. REV-48192' },
              ].map(p => (
                <button
                  key={p.cat}
                  onClick={() => handleApplyPreset(p.text, p.cat, p.id)}
                  style={{
                    background: categoryKey === p.cat && grievanceText === p.text ? 'var(--neptune-badge-emerald-bg)' : 'var(--neptune-bg-elevated)',
                    border: `1px solid ${categoryKey === p.cat && grievanceText === p.text ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                    color: categoryKey === p.cat && grievanceText === p.text ? 'var(--neptune-emerald)' : 'var(--neptune-text-secondary)',
                    borderRadius: 20,
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--neptune-transition)',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unified Smart Input Card */}
          <div style={{
            background: 'var(--neptune-bg-surface)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 12,
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {/* Live Audio Visualizer (Appears while recording) */}
            {isRecording && (
              <div style={{
                background: 'var(--neptune-badge-emerald-bg)',
                borderRadius: 8,
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}>
                <canvas ref={canvasRef} width={400} height={40} style={{ width: '100%', maxWidth: 400, height: 40 }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neptune-emerald)' }}>
                  Recording voice in {language} (00:{recordingSeconds.toString().padStart(2, '0')})... बोलिए
                </div>
              </div>
            )}

            <textarea
              className="textarea-field"
              value={grievanceText}
              onChange={(e) => setGrievanceText(e.target.value)}
              placeholder="वर्णन करें: क्या समस्या है, किस विभाग में और कब से रुकी हुई है... (e.g. My ration has been stopped for 3 months, or my pension application was not processed)"
              rows={4}
              style={{
                fontSize: '0.94rem',
                lineHeight: 1.55,
                border: 'none',
                background: 'transparent',
                padding: 0,
                outline: 'none',
                resize: 'vertical',
              }}
            />

            {/* Bottom Bar inside input: Voice Mic + Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--neptune-border-card)',
              paddingTop: '0.65rem',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              <button
                onClick={handleToggleRecording}
                className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                style={{ borderRadius: 20, padding: '0.35rem 0.85rem', fontWeight: 700, fontSize: '0.78rem' }}
              >
                {isRecording ? <><MicOff size={14} /> Stop Recording</> : <><Mic size={14} style={{ color: 'var(--neptune-emerald)' }} /> 🎙️ Hold to Speak (बोलें)</>}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.75rem', color: 'var(--neptune-text-tertiary)' }}>
                <span>🛡️ Aadhaar & Mobile Masked</span>
                <span>•</span>
                <span>{grievanceText.length} chars</span>
              </div>
            </div>
          </div>

          {/* Optional Reference ID Toggle */}
          <div>
            {!showIdInput ? (
              <button
                onClick={() => setShowIdInput(true)}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--neptune-emerald)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>+ Add Reference / Card No. (Optional)</span>
                <ChevronDown size={14} />
              </button>
            ) : (
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neptune-text-secondary)', display: 'block', marginBottom: 4 }}>
                  Card No. / Application Reference No. (Optional):
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={specificId}
                  onChange={(e) => setSpecificId(e.target.value)}
                  placeholder="e.g. Ration Card No, Pension PPO, or FIR number"
                  style={{ fontSize: '0.86rem', padding: '0.55rem 0.85rem' }}
                />
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            onClick={() => setCurrentStep(2)}
            disabled={!grievanceText.trim()}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700 }}
          >
            <span>Review Official RTI Questions (प्रश्न देखें)</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: REVIEW OFFICIAL LEGAL QUESTIONS                                    */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="neptune-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--neptune-text-primary)' }}>
                Review Official RTI Questions
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: 'var(--neptune-text-secondary)' }}>
                Government officers are legally required to provide certified records for each query below.
              </p>
            </div>

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
              {isSpeakingDraft ? <VolumeX size={14} /> : <Volume2 size={14} style={{ color: 'var(--neptune-emerald)' }} />}
              <span>{isSpeakingDraft ? 'Stop Audio' : '🔊 Listen (सुनें)'}</span>
            </button>
          </div>

          {/* Target Public Authority Card */}
          <div style={{
            background: 'var(--neptune-bg-elevated)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            padding: '0.85rem 1rem',
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)', fontWeight: 700 }}>
              Target Department & Office (संबंधित सरकारी विभाग)
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neptune-text-primary)', marginTop: 2 }}>
              {targetAuthority.canonicalName}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
              {targetAuthority.cpioDesignation} • {targetAuthority.officeAddress}
            </div>
          </div>

          {/* Generated Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {compilationResult.queryBlocks.map((block) => (
              <div
                key={block.id}
                style={{
                  background: 'var(--neptune-bg-surface)',
                  border: '1px solid var(--neptune-border-card)',
                  borderRadius: 10,
                  padding: '0.85rem 1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                    Question #{block.pointNumber}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--neptune-emerald)', fontWeight: 600 }}>
                    ✓ Protected under Section 2(f)
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--neptune-text-primary)', lineHeight: 1.5 }}>
                  {block.certifiedQueryText}
                </div>
              </div>
            ))}
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
        <div className="neptune-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--neptune-text-primary)' }}>
              Choose How to File Your RTI
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: 'var(--neptune-text-secondary)' }}>
              Select your preferred submission channel to start the official 30-day statutory countdown.
            </p>
          </div>

          {/* Submission Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
            <div
              onClick={() => setSelectedChannel('CENTRAL_ONLINE')}
              style={{
                padding: '1.1rem 1.25rem',
                borderRadius: 12,
                border: `2px solid ${selectedChannel === 'CENTRAL_ONLINE' ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                background: selectedChannel === 'CENTRAL_ONLINE' ? 'var(--neptune-badge-emerald-bg)' : 'var(--neptune-bg-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'var(--neptune-transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(5, 150, 105, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neptune-emerald)',
                  flexShrink: 0,
                }}>
                  <Send size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--neptune-text-primary)' }}>
                    🌐 Send Online via NIC Portal (₹10 Statutory Fee)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                    Instant e-filing with official government registration number & immediate 30-day countdown.
                  </div>
                </div>
              </div>
              <CheckCircle2 size={20} style={{ color: selectedChannel === 'CENTRAL_ONLINE' ? 'var(--neptune-emerald)' : 'transparent', flexShrink: 0 }} />
            </div>

            <div
              onClick={() => setSelectedChannel('OFFLINE_SPEED_POST')}
              style={{
                padding: '1.1rem 1.25rem',
                borderRadius: 12,
                border: `2px solid ${selectedChannel === 'OFFLINE_SPEED_POST' ? 'var(--neptune-emerald)' : 'var(--neptune-border-card)'}`,
                background: selectedChannel === 'OFFLINE_SPEED_POST' ? 'var(--neptune-badge-emerald-bg)' : 'var(--neptune-bg-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'var(--neptune-transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(217, 119, 6, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neptune-amber)',
                  flexShrink: 0,
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--neptune-text-primary)' }}>
                    📮 Registered Speed Post + Indian Postal Order (₹39)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                    Physical physical package with ₹10 IPO and CEPT consignment tracking barcode.
                  </div>
                </div>
              </div>
              <CheckCircle2 size={20} style={{ color: selectedChannel === 'OFFLINE_SPEED_POST' ? 'var(--neptune-emerald)' : 'transparent', flexShrink: 0 }} />
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--neptune-bg-elevated)',
            border: '1px solid var(--neptune-border-card)',
            borderRadius: 10,
            padding: '0.75rem 1rem',
            fontSize: '0.78rem',
            color: 'var(--neptune-text-secondary)',
          }}>
            <Shield size={18} style={{ color: 'var(--neptune-emerald)', flexShrink: 0 }} />
            <div>
              <strong>Avishek Goenka Whistleblower Shield:</strong> Your home address and phone number are safely masked to protect you from local harassment.
            </div>
          </div>

          {/* Action Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentStep(2)}
              className="btn btn-secondary btn-md"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              onClick={handleDispatch}
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, flex: 1, justifyContent: 'center' }}
            >
              {isSubmitting ? (
                <span>{statusMessage || 'Processing...'}</span>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>🚀 Seal & Launch 30-Day Statutory Clock</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
