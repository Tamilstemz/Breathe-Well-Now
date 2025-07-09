export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api",
  BASE_PATH: "/",
  DEFAULT_SERVICE_CODE: "APPT",
  SECRET_KEY: "Ndhelthcheck_@key",
  // TOKEN_API: "https://uat.ndhealthcheck.com/appointment-service/api/auth/token",
  // APPLICANT_CRUD_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/transaction/applicant/details",
  // APPOINMENT_SAVE_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/transaction/book_appointment/save",
  // AVAILABLE_SLOTS_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/configuration/slot-listing",
  // AVAILABLE_CENTER_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/master/center?application=1",
  // AVAILABLE_SERVIVCE_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/master/service?status=1&application=1",
  // APPLICANT_WITH_APPT_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/transaction/applicant-appointment/details",

  // APPLICANT_RECEIPT_API: (appointmentId: string) =>
  //   `https://uat.ndhealthcheck.com/appointment-service/transaction/invoice/pdf/${appointmentId}/download`,

  // APPOINMENT_REPORT_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/transaction/appointment-report",

  // APPOINMENT_REPORT_Cancel:
  //   "https://uat.ndhealthcheck.com/appointment-service/transaction/appointment/cancel",

  // OTP_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/notification/GenerateOTP",
  // OTP_VALIDATE_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/notification/validate-otp",
  // HOLIDAY_API:
  //   "https://uat.ndhealthcheck.com/appointment-service/master/holiday?status=1&application=1",

  // -----------local API

  TOKEN_API: "http://localhost:8001/api/auth/token",
  APPLICANT_CRUD_API: "http://localhost:8001/transaction/applicant/details",
  APPOINMENT_SAVE_API:
    "http://localhost:8001/transaction/book_appointment/save",
  AVAILABLE_SLOTS_API: "http://localhost:8001/configuration/slot-listing",
  AVAILABLE_CENTER_API: "http://localhost:8001/master/center?application=1",
  AVAILABLE_SERVIVCE_API:
    "http://localhost:8001/master/service?status=1&application=1",
  APPLICANT_WITH_APPT_API:
    "http://localhost:8001/transaction/applicant-appointment/details",
  APPLICANT_RECEIPT_API: (appointmentId: string) =>
    `http://localhost:8001/transaction/invoice/pdf/${appointmentId}/download`,
  APPOINMENT_REPORT_API: "http://localhost:8001/transaction/appointment-report",

  APPOINMENT_REPORT_Cancel:
    "http://localhost:8001/transaction/appointment/cancel",

  HOLIDAY_API: "http://localhost:8001/master/holiday?status=1&application=1",

  OTP_API: "http://localhost:8001/notification/GenerateOTP",
  OTP_VALIDATE_API: "http://localhost:8001/notification/validate-otp",
  OTP_TIMER_DURATION: 300,
};
