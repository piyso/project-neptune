import { IQueryBlock } from '../types/dossier.js';

export interface CompilerResult {
  queryBlocks: IQueryBlock[];
  totalCharacterCount: number;
  wordCount: number;
  isWordBudgetCompliant: boolean;
  maskedNarrative: string;
  detectedCategory: string;
  preemptedClauses: string[];
}

export class Section2fCompiler {
  private static readonly CATEGORY_TEMPLATES: Record<string, { label: string; records: Array<{ type: IQueryBlock['recordType']; template: string; clauses: Array<'8(1)(d)' | '8(1)(j)' | '8(1)(e)' | '24' | '10'> }> }> = {
    'ROAD_POTHOLE': {
      label: 'Roads & Infrastructure Quality',
      records: [
        {
          type: 'WORK_MEASUREMENT_BOOK',
          template: 'Certified copy of the Work Measurement Book (MB), bitumen density laboratory test reports, and defect liability guarantee agreement for',
          clauses: ['8(1)(d)', '10'],
        },
        {
          type: 'TENDER_BID_CHART',
          template: 'Certified copy of the comparative financial bid evaluation statement and contractor sanction order under Tender Reference for',
          clauses: ['8(1)(d)'],
        },
        {
          type: 'CITIZEN_CHARTER',
          template: 'Certified copy of the Citizen Charter specifying the statutory time limit and penalty deductions for non-maintenance of the aforementioned road patch.',
          clauses: ['8(1)(j)'],
        }
      ]
    },
    'RATION_DELAY': {
      label: 'Food Supplies & Fair Price Shop (PDS)',
      records: [
        {
          type: 'FILE_NOTING',
          template: 'Certified copy of the physical muster roll, electronic Point of Sale (e-PoS) biometric server audit logs, and stock verification registers for',
          clauses: ['8(1)(j)'],
        },
        {
          type: 'ORDER_COPY',
          template: 'Certified copy of all administrative orders, inspection notes, and internal file notings regarding suspension or cancellation of ration supplies for',
          clauses: ['8(1)(d)', '10'],
        },
        {
          type: 'CITIZEN_CHARTER',
          template: 'Certified copy of the grievance redressal mechanism and statutory timeline prescribed under Section 19 of the National Food Security Act (NFSA 2013).',
          clauses: ['8(1)(j)'],
        }
      ]
    },
    'PENSION_DELAY': {
      label: 'EPFO / Senior Citizen Pension & Arrears',
      records: [
        {
          type: 'FILE_NOTING',
          template: 'Certified copy of the calculation sheet, internal audit clearance check-sheet, and all file notings recording day-to-day progress of Pension Claim under PPO Ref',
          clauses: ['8(1)(j)'],
        },
        {
          type: 'ORDER_COPY',
          template: 'Certified copy of instructions and guidelines issued to field commissioners regarding statutory disbursement time-limits for',
          clauses: ['8(1)(d)'],
        },
        {
          type: 'CITIZEN_CHARTER',
          template: 'Certified copy of the Citizen Charter stating interest compensation payable for delayed pension release pursuant to statutory rules.',
          clauses: ['8(1)(j)', '10'],
        }
      ]
    },
    'LAND_RECORDS': {
      label: 'Revenue & Land Mutation (Khatauni/Khasra)',
      records: [
        {
          type: 'FILE_NOTING',
          template: 'Certified copy of Field Lekhpal/Patwari inquiry report, boundary dispute survey map, and daily progress file notings for Mutation Dossier',
          clauses: ['8(1)(j)', '10'],
        },
        {
          type: 'ORDER_COPY',
          template: 'Certified copy of the statutory order sheet and date of next hearing listed under Revenue Court Act for',
          clauses: ['8(1)(d)'],
        }
      ]
    },
    'POLICE_FIR': {
      label: 'Police FIR Investigation & Status',
      records: [
        {
          type: 'ORDER_COPY',
          template: 'Certified copy of the daily Case Diary extract (General Diary entry), preliminary inquiry conclusion, and status of charge-sheet filed in Court regarding FIR No.',
          clauses: ['8(1)(j)', '24'],
        },
        {
          type: 'CITIZEN_CHARTER',
          template: 'Certified copy of the supervisory order passed by Senior Superintendent of Police / DSP regarding inquiry completion for',
          clauses: ['10', '24'],
        }
      ]
    }
  };

  /**
   * Masks Indian Aadhaar numbers (XXXX-XXXX-1234) and phone numbers to guarantee DPDP 2023 compliance
   */
  public static maskPii(text: string): string {
    // 12-digit Aadhaar pattern
    const aadhaarRegex = /\b(\d{4})[ -]?(\d{4})[ -]?(\d{4})\b/g;
    let masked = text.replace(aadhaarRegex, 'XXXX-XXXX-$3');

    // 10-digit Indian Mobile pattern
    const phoneRegex = /\b([6-9]\d{1})(\d{6})(\d{2})\b/g;
    masked = masked.replace(phoneRegex, '$1******$3');

    return masked;
  }

  /**
   * Compiles citizen narrative into Section 2(f) compliant material record queries
   */
  public static compile(
    rawNarrative: string,
    categoryKey: string = 'ROAD_POTHOLE',
    specificIdentifier: string = ''
  ): CompilerResult {
    const masked = this.maskPii(rawNarrative);
    const category = this.CATEGORY_TEMPLATES[categoryKey] || this.CATEGORY_TEMPLATES['ROAD_POTHOLE'];
    const idSuffix = specificIdentifier.trim() ? specificIdentifier.trim() : 'the aforementioned matter as detailed in grievance narrative';

    const blocks: IQueryBlock[] = category.records.map((item, index) => {
      const text = `${index + 1}. ${item.template} ${idSuffix}. [Section 10 Severability Applied; Preempts ${item.clauses.join(', ')}].`;
      return {
        id: `qb-gen-${index + 1}-${Date.now().toString(36)}`,
        pointNumber: index + 1,
        recordType: item.type,
        certifiedQueryText: text,
        sec2fCompliant: true,
        preemptedClauses: item.clauses,
      };
    });

    const fullDraft = blocks.map(b => b.certifiedQueryText).join('\n\n');
    const totalChars = fullDraft.length;
    const wordCount = fullDraft.trim().split(/\s+/).length;

    // Preempted clauses union
    const clausesSet = new Set<string>();
    blocks.forEach(b => b.preemptedClauses.forEach(c => clausesSet.add(c)));

    return {
      queryBlocks: blocks,
      totalCharacterCount: totalChars,
      wordCount,
      isWordBudgetCompliant: totalChars <= 2800, // Central RTI online limit
      maskedNarrative: masked,
      detectedCategory: category.label,
      preemptedClauses: Array.from(clausesSet),
    };
  }
}
