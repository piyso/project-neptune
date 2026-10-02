// Project Neptune: Section 63 BSA & Cryptographic Vault Types

export interface IMerkleLeafs {
  citizenVoiceAudioHash: string;
  synthesizedDraftTextHash: string;
  httpRequestWireHash: string;
  govtServerReceiptHash: string;
}

export interface IBsaCertificate {
  certificateId: string;
  dossierId: string;
  merkleRootHash: string;
  nodeH12: string; // Voice + Text hash
  nodeH34: string; // Wire + Govt receipt hash
  leafs: IMerkleLeafs;
  ntpTimestamp: string;
  rfc3161Authority: string;
  bsaAdmissibilitySection: 'Section 63 Bharatiya Sakshya Adhiniyam, 2023';
  jurisdictionCourt: string;
  signerPublicKey: string;
  status: 'CRYPTOGRAPHICALLY_SEALED' | 'VERIFIED' | 'TAMPER_DETECTED';
}
