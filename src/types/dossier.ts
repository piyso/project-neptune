// Project Neptune: Core Domain Types
// Strictly adhering to specifications/03 & specifications/17

export type StatutoryStage =
  | 'PENDING_CPIO'
  | 'SEC6_3_HOP'
  | 'FEE_PAUSED'
  | 'DEEMED_REFUSAL'
  | 'FIRST_APPEAL_PENDING'
  | 'CIC_SECOND_APPEAL'
  | 'SETTLED_SUCCESS';

export type SubmissionChannel =
  | 'CENTRAL_ONLINE'      // NIC rtionline.gov.in (₹10)
  | 'STATE_ONLINE'        // State Portal (e.g., Maharti)
  | 'OFFLINE_SPEED_POST'  // Physical Speed Post + ₹10 IPO (₹39)
  | 'GUIDED_CLIPBOARD';   // Self-paste mode (₹0)

export interface IPublicAuthorityNode {
  id: string;
  ministryId: string;
  ministryName: string;
  canonicalName: string;
  hindiName?: string;
  portalType: 'CENTRAL_ONLINE' | 'STATE_ONLINE' | 'OFFLINE_SPEED_POST';
  portalId?: string;
  dropdownPath: string[];
  cpioDesignation: string;
  officeAddress: string;
  pincode: string;
  stateLgdCode: number;
  districtLgdCode?: number;
  isSec24Exempt: boolean;
  appellateAuthorityDesignation: string;
  complianceRating?: number; // 0 to 100%
  medianResponseDays?: number;
}

export interface IQueryBlock {
  id: string;
  pointNumber: number;
  recordType: 'WORK_MEASUREMENT_BOOK' | 'TENDER_BID_CHART' | 'ATTENDANCE_LOG' | 'FILE_NOTING' | 'ORDER_COPY' | 'CITIZEN_CHARTER';
  certifiedQueryText: string;
  sec2fCompliant: boolean;
  preemptedClauses: Array<'8(1)(d)' | '8(1)(j)' | '8(1)(e)' | '24' | '10'>;
}

export interface IStatutoryClock {
  filedDate: string;
  deliveryConfirmedDate?: string;
  currentStatutoryDeadline: string;
  daysRemaining: number;
  totalDays: number;
  stage: StatutoryStage;
  isOverdue: boolean;
  hopCount: number;
  feeDemanded?: number;
  isIllegalFee?: boolean;
  sec7_6_FeeWaiverActive: boolean;
}

export interface ICitizenRTIDossier {
  dossierId: string;
  citizenUuid: string;
  title: string;
  targetAuthority: IPublicAuthorityNode;
  filingChannel: SubmissionChannel;
  govRegistrationNumber?: string;
  postalBarcode?: string;
  rawGrievanceNarrative: string;
  categoryKey: string;
  queryBlocks: IQueryBlock[];
  totalCharacterCount: number;
  isWordBudgetCompliant: boolean;
  maskedAadhaar?: string;
  proxyAddressUsed?: string;
  merkleRootHash: string;
  statutoryClock: IStatutoryClock;
  createdAt: string;
  updatedAt: string;
}
