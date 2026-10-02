// Project Neptune: API Gateway Types & Contracts
import { IPublicAuthorityNode, IQueryBlock, ICitizenRTIDossier } from './dossier.js';
import { TimelineEvent } from './timeline.js';
import { IBsaCertificate } from './vault.js';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  source: 'LIVE_BACKEND_GATEWAY' | 'NEPTUNE_STANDALONE_KERNEL';
}

export interface JurisdictionResolveRequest {
  queryText: string;
  stateLgdCode?: number;
  pincode?: string;
}

export interface JurisdictionResolveResponse {
  authority: IPublicAuthorityNode;
  confidenceScore: number;
  matchedKeywords: string[];
  allocationSubject: string;
}

export interface SynthesizeSec2fRequest {
  rawGrievance: string;
  categoryKey: string;
  identifier?: string;
  language?: string;
}

export interface SynthesizeSec2fResponse {
  queryBlocks: IQueryBlock[];
  totalCharacters: number;
  wordCount: number;
  maskedAadhaar?: string;
  isCompliant: boolean;
}

export interface DispatchLogisticsRequest {
  dossierId: string;
  hubPincode: string;
  recipientAddress: string;
}

export interface DispatchLogisticsResponse {
  barcode: string;
  ipoSerialNumber: string;
  trackingUrl: string;
  estimatedDeliveryDate: string;
}
