import { ApiResponse, JurisdictionResolveRequest, JurisdictionResolveResponse, SynthesizeSec2fRequest, SynthesizeSec2fResponse, DispatchLogisticsRequest, DispatchLogisticsResponse } from '../types/api.js';
import { ICitizenRTIDossier, IPublicAuthorityNode } from '../types/dossier.js';
import { TimelineEvent } from '../types/timeline.js';
import { IBsaCertificate } from '../types/vault.js';
import { INITIAL_PUBLIC_AUTHORITIES, INITIAL_DOSSIERS, INITIAL_TIMELINE_EVENTS } from './mockData.js';
import { Section2fCompiler } from './cfgCompiler.js';
import { BsaMerkleVaultService } from './merkleVault.js';
import { StatutoryTimelineEngine } from './timelineEngine.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/v1';
const CONFIGURED_MODE = (import.meta.env.VITE_API_MODE || 'mock').toLowerCase();

export class NeptuneApiClient {
  private static isBackendAvailable: boolean | null = null;

  /**
   * Diagnostic probe to test backend gateway availability
   */
  public static async checkBackendHealth(): Promise<boolean> {
    if (CONFIGURED_MODE === 'mock') {
      this.isBackendAvailable = false;
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      this.isBackendAvailable = res.ok;
      return res.ok;
    } catch {
      this.isBackendAvailable = false;
      return false;
    }
  }

  /**
   * Resolves target Public Authority from citizen intent or keywords
   */
  public static async resolveJurisdiction(req: JurisdictionResolveRequest): Promise<ApiResponse<JurisdictionResolveResponse>> {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/jurisdiction/resolve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
        });
        if (res.ok) {
          const json = await res.json();
          return { ...json, source: 'LIVE_BACKEND_GATEWAY' };
        }
      } catch (err) {
        console.warn('[NeptuneAPI] Live gateway error, switching to standalone kernel:', err);
      }
    }

    // Standalone Local Kernel Fallback
    const query = req.queryText.toLowerCase();
    let matchedAuthority = INITIAL_PUBLIC_AUTHORITIES[0]; // NHAI default

    if (query.includes('pension') || query.includes('epfo') || query.includes('pf') || query.includes('retirement')) {
      matchedAuthority = INITIAL_PUBLIC_AUTHORITIES[1];
    } else if (query.includes('ration') || query.includes('kotedaar') || query.includes('food') || query.includes('nfsa') || query.includes('grain')) {
      matchedAuthority = INITIAL_PUBLIC_AUTHORITIES[2];
    } else if (query.includes('petrol') || query.includes('diesel') || query.includes('iocl') || query.includes('gas') || query.includes('lpg')) {
      matchedAuthority = INITIAL_PUBLIC_AUTHORITIES[3];
    } else if (query.includes('ballia') || query.includes('tehsil') || query.includes('patwari') || query.includes('lekhpal') || query.includes('mutation')) {
      matchedAuthority = INITIAL_PUBLIC_AUTHORITIES[4];
    } else if (query.includes('delhi') || query.includes('flyover') || query.includes('drainage') || query.includes('pwd')) {
      matchedAuthority = INITIAL_PUBLIC_AUTHORITIES[5];
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
      source: 'NEPTUNE_STANDALONE_KERNEL',
      data: {
        authority: matchedAuthority,
        confidenceScore: 0.96,
        matchedKeywords: ['statutory jurisdiction', matchedAuthority.canonicalName],
        allocationSubject: matchedAuthority.ministryName,
      },
    };
  }

  /**
   * Compiles citizen narrative into Section 2(f) query blocks
   */
  public static async synthesizeSection2f(req: SynthesizeSec2fRequest): Promise<ApiResponse<SynthesizeSec2fResponse>> {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/synthesize/sec2f`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
        });
        if (res.ok) {
          const json = await res.json();
          return { ...json, source: 'LIVE_BACKEND_GATEWAY' };
        }
      } catch (err) {
        console.warn('[NeptuneAPI] Live gateway error, switching to standalone kernel:', err);
      }
    }

    // Standalone Local Kernel
    const result = Section2fCompiler.compile(req.rawGrievance, req.categoryKey, req.identifier);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      source: 'NEPTUNE_STANDALONE_KERNEL',
      data: {
        queryBlocks: result.queryBlocks,
        totalCharacters: result.totalCharacterCount,
        wordCount: result.wordCount,
        maskedAadhaar: result.maskedNarrative,
        isCompliant: result.isWordBudgetCompliant,
      },
    };
  }

  /**
   * Retrieves all active dossiers
   */
  public static async getDossiers(): Promise<ApiResponse<ICitizenRTIDossier[]>> {
    // Check local storage for citizen creations
    const localSaved = localStorage.getItem('neptune_prod_dossiers');
    const dossiers: ICitizenRTIDossier[] = localSaved ? JSON.parse(localSaved) : INITIAL_DOSSIERS;

    return {
      success: true,
      timestamp: new Date().toISOString(),
      source: this.isBackendAvailable ? 'LIVE_BACKEND_GATEWAY' : 'NEPTUNE_STANDALONE_KERNEL',
      data: dossiers,
    };
  }

  /**
   * Retrieves timeline events for a given dossier
   */
  public static async getTimelineEvents(dossierId: string): Promise<ApiResponse<TimelineEvent[]>> {
    const events = INITIAL_TIMELINE_EVENTS[dossierId] || [
      {
        id: `te-init-${dossierId}`,
        type: 'APPLICATION_FILED',
        timestamp: new Date().toLocaleString(),
        title: 'Application Sealed & Generated',
        description: 'Dossier compiled with BSA 2023 Cryptographic Seal and submitted.',
        status: 'COMPLETED',
      },
      {
        id: `te-desk-${dossierId}`,
        type: 'SPEED_POST_DELIVERED',
        timestamp: 'Pending Delivery',
        title: 'Transit to CPIO Desk',
        description: 'Waiting for physical speed post or digital portal acknowledgement.',
        status: 'ACTIVE',
      }
    ];

    return {
      success: true,
      timestamp: new Date().toISOString(),
      source: 'NEPTUNE_STANDALONE_KERNEL',
      data: events,
    };
  }

  /**
   * Generates or fetches BSA Section 63 Evidence Certificate
   */
  public static async getBsaCertificate(dossier: ICitizenRTIDossier): Promise<ApiResponse<IBsaCertificate>> {
    const cert = await BsaMerkleVaultService.generateCertificate(
      dossier.dossierId,
      dossier.queryBlocks.map(b => b.certifiedQueryText).join('\n'),
      dossier.govRegistrationNumber || dossier.postalBarcode || 'RTI-2026-PENDING',
      dossier.targetAuthority.canonicalName
    );

    return {
      success: true,
      timestamp: new Date().toISOString(),
      source: 'NEPTUNE_STANDALONE_KERNEL',
      data: cert,
    };
  }

  /**
   * Dispatches speed post logistics with simulated IPO allocation
   */
  public static async dispatchLogistics(req: DispatchLogisticsRequest): Promise<ApiResponse<DispatchLogisticsResponse>> {
    const barcode = `EU${Math.floor(100000000 + Math.random() * 900000000)}IN`;
    const ipoSerial = `42G ${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      success: true,
      timestamp: new Date().toISOString(),
      source: 'NEPTUNE_STANDALONE_KERNEL',
      data: {
        barcode,
        ipoSerialNumber: ipoSerial,
        trackingUrl: `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?consCode=${barcode}`,
        estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      },
    };
  }
}
