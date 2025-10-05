import { ethers } from 'ethers';

export interface Developer {
  wallet: string;
  skillScore: string; // Encrypted
  expectedSalary: string; // Encrypted
  isActive: boolean;
  timestamp: number;
}

export interface Job {
  employer: string;
  requiredScore: string; // Encrypted
  offeredSalary: string; // Encrypted
  description: string;
  isOpen: boolean;
  timestamp: number;
}

export interface Match {
  developerId: number;
  jobId: number;
  isConfirmed: boolean;
  isCompleted: boolean;
}

export interface CodeSubmission {
  id: number;
  developer: string;
  codeHash: string;
  complexityScore: string; // Encrypted
  securityScore: string; // Encrypted
  qualityScore: string; // Encrypted
  finalScore: string; // Encrypted
  timestamp: number;
  isEvaluated: boolean;
}

export interface EvaluationCriteria {
  complexityWeight: number;
  securityWeight: number;
  qualityWeight: number;
  maxScore: number;
}

export interface ComponentProps {
  account: string;
  signer: ethers.JsonRpcSigner | null;
}

export interface JobMatch {
  id: number;
  title: string;
  company: string;
  industry: string;
  companySize: string;
  fundingStage: string;
  techStack: string[];
  culture: string[];
  verified: boolean;
  matchScore: number;
  salaryRange: string;
  requirements: string;
  posted: string;
  type: string;
  location: string;
}

export interface Application {
  id: number;
  jobTitle: string;
  status: 'Applied' | 'Under Review' | 'Approved' | 'Rejected';
  appliedDate: string;
  matchScore: number;
}

export interface AnalysisResult {
  complexity: number;
  security: number;
  quality: number;
  finalScore: number;
  analysis: {
    linesOfCode: number;
    functions: number;
    events: number;
    modifiers: number;
  };
}