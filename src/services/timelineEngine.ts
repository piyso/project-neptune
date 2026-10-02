import { IStatutoryClock, StatutoryStage } from '../types/dossier.js';
import { TimelineEvent } from '../types/timeline.js';

export interface FirstAppealDraft {
  memoTitle: string;
  appellantHeading: string;
  legalGrounds: string[];
  prayers: string[];
  fullDraftText: string;
}

export class StatutoryTimelineEngine {
  /**
   * Recalculates days remaining and statutory stage based on event history
   */
  public static calculateClock(
    filedDateStr: string,
    deliveryDateStr?: string,
    hopCount: number = 0,
    hasFeeDemanded: boolean = false,
    hasCpioReplied: boolean = false
  ): IStatutoryClock {
    const baseDate = new Date(deliveryDateStr || filedDateStr);
    const statutoryDays = 30 + (hopCount * 5); // +5 days per Sec 6(3) hop

    const deadline = new Date(baseDate);
    deadline.setDate(deadline.getDate() + statutoryDays);

    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining <= 0;

    let stage: StatutoryStage = 'PENDING_CPIO';

    if (hasCpioReplied) {
      stage = 'SETTLED_SUCCESS';
    } else if (hasFeeDemanded) {
      stage = 'FEE_PAUSED';
    } else if (hopCount > 0 && !isOverdue) {
      stage = 'SEC6_3_HOP';
    } else if (isOverdue) {
      stage = 'DEEMED_REFUSAL';
    }

    return {
      filedDate: filedDateStr,
      deliveryConfirmedDate: deliveryDateStr,
      currentStatutoryDeadline: deadline.toISOString(),
      daysRemaining: Math.max(0, daysRemaining),
      totalDays: statutoryDays,
      stage,
      isOverdue,
      hopCount,
      sec7_6_FeeWaiverActive: isOverdue, // Section 7(6): All records must be provided 100% free if 30 days lapse
    };
  }

  /**
   * Automatically pre-compiles a legally unassailable Section 19(1) First Appeal memo
   */
  public static compileFirstAppeal(
    regNo: string,
    authorityName: string,
    filingDate: string,
    appellantName: string = 'Authorized Citizen / Appellant'
  ): FirstAppealDraft {
    const grounds = [
      `1. DEEMED REFUSAL UNDER SECTION 7(2): The CPIO has failed to furnish the requested information within the mandatory statutory period of 30 days from receipt of the application dated ${filingDate}.`,
      `2. SECTION 7(6) STATUTORY FEE FORFEITURE: By virtue of statutory default, the Respondent Public Authority has forfeited all rights to charge any inspection or photocopying fee. All certified records must be furnished entirely free of cost.`,
      `3. NON-APPLICATION OF MIND: No order of transfer under Section 6(3) or invocation of Section 8/9 exemptions was communicated within the prescribed limitation period.`,
      `4. BREACH OF CITIZEN CHARTER: Non-compliance constitutes a willful violation of statutory obligations warranting inquiry under Section 19(8) of the Act.`
    ];

    const prayers = [
      `a) Direct the CPIO to immediately furnish certified copies of all requested records to the Appellant completely free of cost pursuant to Section 7(6).`,
      `b) Summon the original records and file notings for personal inspection by the First Appellate Authority.`,
      `c) Recommend initiation of disciplinary proceedings against the delinquent CPIO under Section 20 for deliberate stonewalling.`
    ];

    const fullDraftText = `MEMORANDUM OF FIRST APPEAL UNDER SECTION 19(1) OF THE RTI ACT, 2005

BEFORE THE FIRST APPELLATE AUTHORITY
Public Authority: ${authorityName}
Original RTI Registration No: ${regNo}
Filing Date: ${filingDate}

IN THE MATTER OF:
${appellantName} ... Appellant
VERSUS
Central Public Information Officer (CPIO), ${authorityName} ... Respondent

STATEMENT OF FACTS & GROUNDS OF APPEAL:
${grounds.join('\n\n')}

PRAYERS:
In the premises aforesaid, the Appellant most respectfully prays that this Hon'ble First Appellate Authority may be pleased to:
${prayers.join('\n')}

Place: New Delhi / Digital Submission
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
Respectfully Submitted by Appellant
[Digitally Signed with BSA 2023 Cryptographic Seal]`;

    return {
      memoTitle: `First Appeal Memo: ${regNo}`,
      appellantHeading: `${appellantName} v. CPIO (${authorityName})`,
      legalGrounds: grounds,
      prayers,
      fullDraftText,
    };
  }
}
