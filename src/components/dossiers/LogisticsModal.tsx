import React from 'react';
import { X, Truck, CheckCircle2, Clock, MapPin, Receipt, ShieldCheck } from 'lucide-react';

interface LogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  consignmentNumber?: string;
  authorityName?: string;
  ipoNumber?: string;
  deliveryDate?: string;
}

export const LogisticsModal: React.FC<LogisticsModalProps> = ({
  isOpen,
  onClose,
  consignmentNumber = 'ED918237461IN',
  authorityName = 'National Highways Authority of India (NHAI)',
  ipoNumber = '44F 918231',
  deliveryDate = '2026-09-17 12:45 PM',
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: 620 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--neptune-border-subtle)', paddingBottom: '0.8rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={20} color="var(--neptune-emerald-light)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>India Post Speed Post & IPO Escrow Logistics</h3>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--neptune-text-secondary)' }}>
              CEPT Postal API tracking with Amar Singh Harika delivery calibration anchor.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--neptune-text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Consignment Banner */}
        <div style={{
          background: 'var(--neptune-bg-elevated)',
          border: '1px solid var(--neptune-border-subtle)',
          borderRadius: 12,
          padding: '1rem',
          marginBottom: '1.2rem',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--neptune-text-secondary)', fontFamily: 'var(--neptune-font-mono)' }}>SPEED POST BARCODE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neptune-emerald-light)', letterSpacing: 1 }}>{consignmentNumber}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--neptune-text-secondary)', marginTop: 4 }}>Target: {authorityName}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--neptune-text-secondary)', fontFamily: 'var(--neptune-font-mono)' }}>STATUTORY FEE ESCROW</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--neptune-amber)' }}>₹10 Indian Postal Order</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>IPO No: <span style={{ fontFamily: 'var(--neptune-font-mono)', color: 'var(--neptune-text-primary)' }}>{ipoNumber}</span></div>
          </div>
        </div>

        {/* Postal Transit Milestones */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neptune-text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Verified Postal Movement Chronology
          </div>

          <div style={{ position: 'relative', borderLeft: '2px solid var(--neptune-border-subtle)', marginLeft: '1rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Step 1 */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: -26, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--neptune-emerald)', border: '2px solid var(--neptune-emerald-light)' }} />
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)', fontFamily: 'var(--neptune-font-mono)' }}>15-Sep-2026 • 10:20 AM</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Article Booked & Hub Dispatched</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neptune-text-secondary)' }}>National Sorting Hub (NSH), New Delhi GPO</div>
            </div>

            {/* Step 2 */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: -26, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--neptune-emerald)', border: '2px solid var(--neptune-emerald-light)' }} />
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)', fontFamily: 'var(--neptune-font-mono)' }}>16-Sep-2026 • 14:15 PM</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Transit & Bagged</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neptune-text-secondary)' }}>Regional Sorting Hub • Bag ID: NSH-DEL-4412</div>
            </div>

            {/* Step 3 */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: -26, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--neptune-emerald)', border: '2px solid var(--neptune-emerald-light)' }} />
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-secondary)', fontFamily: 'var(--neptune-font-mono)' }}>17-Sep-2026 • 09:30 AM</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Out for Delivery</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neptune-text-secondary)' }}>Delivery Beat #4 • Postman: Rajesh Kumar</div>
            </div>

            {/* Step 4: Harika Anchor */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: -26, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--neptune-emerald)', boxShadow: '0 0 10px var(--neptune-emerald)' }} />
              <div style={{ fontSize: '0.72rem', color: 'var(--neptune-emerald-light)', fontFamily: 'var(--neptune-font-mono)', fontWeight: 700 }}>{deliveryDate}</div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--neptune-emerald-light)' }}>Delivered & Signed at CPIO Receiving Desk</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--neptune-text-primary)' }}>
                Signature Captured: <em>"Central Registry / Diary Clerk"</em>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Harika Rule Banner */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 10,
          padding: '0.8rem',
          fontSize: '0.78rem',
          marginBottom: '1.2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
        }}>
          <ShieldCheck size={18} color="var(--neptune-cobalt)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Amar Singh Harika Legal Doctrine Applied:</strong> Under Supreme Court precedent, the 30-day statutory limitation period begins strictly upon verified physical receipt by the department (Sep 17, 2026), preventing corrupt CPIOs from claiming delay before delivery.
          </div>
        </div>

        {/* Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="primary-btn" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
            Close Logistics Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
