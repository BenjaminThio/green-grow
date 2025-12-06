export const USERNAME_MIN_LENGTH: number = 3;
export const USERNAME_MAX_LENGTH: number = 20;
export const USERNAME_REGEX: RegExp = /^[a-zA-Z0-9_]+$/;

export const EMAIL_MIN_LENGTH: number = 6;
export const EMAIL_MAX_LENGTH: number = 254;
export const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH: number = 8;
export const PASSWORD_MAX_LENGTH: number = 64;
export const PASSWORD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;