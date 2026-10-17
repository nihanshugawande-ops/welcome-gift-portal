export interface RegistrationRecord {
  id: string;
  countryCode: string;
  nationalNumber: string;
  fullMobileNumber: string;
  displayName?: string;
  submissionTimestamp: string;
  submissionUnixMs: number;
  consentStatus: boolean;
  verificationStatus: 'not_verified' | 'verified';
  registrationStatus: string;
  createdAt: string;
  maskedNumber?: string;
}

export interface RegistrationRequest {
  countryCode: string;
  mobileNumber: string;
  displayName?: string;
  consent: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  isExisting?: boolean;
  data?: {
    id: string;
    fullMobileNumber: string;
    displayName?: string;
    submissionTimestamp: string;
    consentStatus: boolean;
    verificationStatus: 'not_verified' | 'verified';
    registrationStatus: string;
  };
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  username?: string;
  message?: string;
}

export interface AdminStats {
  totalRegistrations: number;
  todayRegistrations: number;
  verifiedNumbers: number;
  unverifiedNumbers: number;
  consentRate: number;
  latestRegistrationTime: string | null;
  dbEngine: string;
  dbPath: string;
  dbSizeBytes: number;
  envConfig: {
    isProductionSafe: boolean;
    missingVars: string[];
    usingDefaultAdmin: boolean;
  };
}

export interface RegistrationListResponse {
  success: boolean;
  records: RegistrationRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CountryInfo {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
  placeholder: string;
  sampleLength: number;
}

export type MainSection =
  | 'home'
  | 'spirituality'
  | 'navratri'
  | 'india'
  | 'ai-art'
  | 'knowledge'
  | 'fun-zone'
  | 'friendship'
  | 'daily-surprise'
  | 'about';
