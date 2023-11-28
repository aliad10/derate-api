export enum Role {
  USER = 1,
  SCRIPT = 2,
}

export enum UserStatus {
  NOT_VERIFIED = 1,
  PENDING = 2,
  VERIFIED = 3,
}

export enum PlatformStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
}

export enum SignerRecoverySelector {
  SERVICE,
  FEEDBACK,
  FEEDBACK_ON_FEEDBACK,
}
