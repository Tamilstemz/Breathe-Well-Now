export type EnvType = "LOCAL" | "UAT" | "PROD";

export const ACTIVE_ENV: EnvType = "LOCAL";

const CONFIG = {
  LOCAL: {
    BASE_URL: "http://localhost:8001",
    SECRET_KEY: "Ndhelthcheck_@local",
    ENCRYPTION_KEY: "ND-HealthCheck-Web!local",
  },
  UAT: {
    BASE_URL: "https://uat.ndhealthcheck.com/appointment-service",
    SECRET_KEY: "Ndhelthcheck_@uat",
    ENCRYPTION_KEY: "ND-HealthCheck-Web!uat",
  },
  PROD: {
    BASE_URL: "https://ndhealthcheck.com/appointment-service",
    SECRET_KEY: "Ndhelthcheck_@prod",
    ENCRYPTION_KEY: "ND-HealthCheck-Web!prod",
  },
}[ACTIVE_ENV as EnvType];

export const environment = {
  production: (ACTIVE_ENV as EnvType) === "PROD" ? true : false,
  apiUrl: "http://localhost:3000/api",
  BASE_PATH: "/",
  DEFAULT_SERVICE_CODE: "APPT",
  SECRET_KEY: "Ndhelthcheck_@key",
  WEBSITE_CUSTOM_SECRET_KEY: CONFIG.SECRET_KEY,
  WEBSITE_CUSTOM_ENCRYPTION_SECRET_KEY: CONFIG.ENCRYPTION_KEY,
  OTP_TIMER_DURATION: 300,
};

const apiPath = (path: string) => `${CONFIG.BASE_URL}${path}`;

export const API = {
  TOKEN_API: apiPath("/api/auth/webtoken"),
  APPLICANT_CRUD_API: apiPath("/transaction/applicant/details"),
  APPOINMENT_SAVE_API: apiPath("/transaction/book_appointment/save"),
  AVAILABLE_SLOTS_API: apiPath("/configuration/slot-listing"),
  AVAILABLE_CENTER_API: apiPath("/master/center?application=1"),
  AVAILABLE_SERVICE_API: apiPath("/master/service?status=1&application=1"),
  APPLICANT_WITH_APPT_API: apiPath(
    "/transaction/applicant-appointment/details"
  ),
  APPLICANT_RECEIPT_API: (appointmentId: string) =>
    apiPath(`/transaction/invoice/pdf/${appointmentId}/download`),
  APPOINMENT_REPORT_API: apiPath("/transaction/appointment-report"),
  APPOINMENT_REPORT_CANCEL: apiPath("/transaction/appointment/cancel"),
  OTP_API: apiPath("/notification/GenerateOTP"),
  OTP_VALIDATE_API: apiPath("/notification/validate-otp"),
  HOLIDAY_API: apiPath("/master/holiday?status=1&application=1"),
};
