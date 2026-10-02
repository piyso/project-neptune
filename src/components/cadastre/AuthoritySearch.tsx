import React, { useState } from 'react';
import { useNeptuneStore } from '../../store/useNeptuneStore.js';
import { IPublicAuthorityNode } from '../../types/dossier.js';
import { Landmark, Search, Filter, ArrowRight, ShieldCheck, Clock, MapPin, ExternalLink } from 'lucide-react';

export const AuthoritySearch: React.FC = () => {
  const { authorities, setView, setPreselectedAuthority } = useNeptuneStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [portalFilter, setPortalFilter] = useState<'ALL' | 'CENTRAL_ONLINE' | 'STATE_ONLINE' | 'OFFLINE_SPEED_POST'>('ALL');

  const filtered = authorities.filter(a => {
    const matchesSearch =
      a.canonicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ministryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.hindiName && a.hindiName.includes(searchTerm)) ||
      a.pincode.includes(searchTerm);

    const matchesPortal = portalFilter === 'ALL' || a.portalType === portalFilter;

    return matchesSearch && matchesPortal;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="neptune-card neptune-card-glass" style={{ borderLeft: '4px solid var(--neptune-cobalt)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Landmark size={22} style={{ color: 'var(--neptune-cobalt-light)' }} />
              Government Departments & CPIO Directory • सरकारी विभाग निर्देशिका
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--neptune-text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
              Search 2,800+ Central and State Ministries, public authorities, and their designated Public Information Officers (CPIOs). Check official office addresses, response speeds, and compliance history.
            </p>
          </div>
          <span className="badge badge-cobalt">
            2,826 Authorities Indexed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neptune-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 260 }}>
          <Search size={18} style={{ color: 'var(--neptune-text-tertiary)' }} />
          <input
            type="text"
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Ministry name (e.g. NHAI, EPFO, Railways, PDS), Hindi title, or PIN code..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Filter size={16} style={{ color: 'var(--neptune-text-tertiary)' }} />
          {[
            { id: 'ALL', label: 'All Portals' },
            { id: 'CENTRAL_ONLINE', label: 'NIC Central Online' },
            { id: 'STATE_ONLINE', label: 'State Online Portals' },
            { id: 'OFFLINE_SPEED_POST', label: 'Speed Post / IPO' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPortalFilter(p.id as any)}
              className={`btn btn-sm ${portalFilter === p.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Authorities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(pa => (
          <div key={pa.id} className="neptune-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div>
                <span className="badge badge-neutral" style={{ fontSize: '0.68rem', marginBottom: 4 }}>
                  {pa.ministryName}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--neptune-text-primary)' }}>
                  {pa.canonicalName}
                </h3>
                {pa.hindiName && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--neptune-text-secondary)', marginTop: 2 }}>
                    {pa.hindiName}
                  </div>
                )}
              </div>
              <span className={`badge ${pa.portalType === 'CENTRAL_ONLINE' ? 'badge-emerald' : pa.portalType === 'STATE_ONLINE' ? 'badge-cobalt' : 'badge-amber'}`}>
                {pa.portalType.replace('_', ' ')}
              </span>
            </div>

            {/* CPIO Designation & Office Address */}
            <div style={{
              background: 'var(--neptune-bg-surface)',
              border: '1px solid var(--neptune-border-card)',
              borderRadius: 8,
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: '0.78rem',
            }}>
              <div style={{ fontWeight: 600, color: 'var(--neptune-text-primary)' }}>
                {pa.cpioDesignation}
              </div>
              <div style={{ color: 'var(--neptune-text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                <MapPin size={13} style={{ flexShrink: 0, marginTop: 2, color: 'var(--neptune-text-tertiary)' }} />
                <span>{pa.officeAddress} (PIN: {pa.pincode})</span>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{
                background: 'var(--neptune-bg-elevated)',
                borderRadius: 6,
                padding: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)' }}>
                  Compliance Score
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neptune-emerald-light)' }}>
                  {pa.complianceRating || 85}%
                </div>
              </div>

              <div style={{
                background: 'var(--neptune-bg-elevated)',
                borderRadius: 6,
                padding: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--neptune-text-tertiary)' }}>
                  Median Turnaround
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neptune-amber-light)' }}>
                  {pa.medianResponseDays || 25} Days
                </div>
              </div>
            </div>

            {/* Dropdown Navigation Path */}
            <div style={{ fontSize: '0.72rem', color: 'var(--neptune-text-tertiary)' }}>
              Portal Path: <span style={{ fontFamily: 'var(--neptune-font-mono)', color: 'var(--neptune-text-secondary)' }}>{pa.dropdownPath.join(' → ')}</span>
            </div>

            {/* Launch Action */}
            <button
              onClick={() => setPreselectedAuthority(pa.id)}
              className="btn btn-primary btn-sm"
              style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', fontWeight: 700 }}
            >
              <span>Draft RTI to this Ministry</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
