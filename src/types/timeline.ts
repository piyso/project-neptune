// Project Neptune: Timeline & Statutory SLA Types

export type StatutoryEventType =
  | 'APPLICATION_FILED'
  | 'SPEED_POST_DELIVERED'
  | 'SEC6_3_TRANSFERRED'
  | 'SEC7_3_FEE_DEMANDED'
  | 'FEE_PAYMENT_SETTLED'
  | 'CPIO_REPLY_RECEIVED'
  | 'DEEMED_REFUSAL_TRIGGERED'
  | 'FIRST_APPEAL_FILED'
  | 'FAA_HEARING_SCHEDULED'
  | 'SECOND_APPEAL_CIC_FILED'
  | 'PENALTY_IMPOSED_SEC20';

export interface TimelineEvent {
  id: string;
  type: StatutoryEventType;
  timestamp: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  statutoryDaysAdded?: number;
  isIllegalFee?: boolean;
  authorityName?: string;
  referenceNo?: string;
  documentHash?: string;
}
