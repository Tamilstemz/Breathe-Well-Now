export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api",
  TOKEN_API: "https://ndhealthcheck.com/appointment-service/api/auth/token",
  APPLICANT_CRUD_API:
    "https://ndhealthcheck.com/appointment-service/transaction/applicant/details",
  APPOINMENT_SAVE_API:
    "https://ndhealthcheck.com/appointment-service/transaction/book_appointment/save",
  AVAILABLE_SLOTS_API:
    "https://ndhealthcheck.com/appointment-service/configuration/slot-listing",
  AVAILABLE_CENTER_API:
    "https://ndhealthcheck.com/appointment-service/master/center?application=1",
  AVAILABLE_SERVIVCE_API:
    "https://ndhealthcheck.com/appointment-service/master/service?status=1&application=1",
  APPLICANT_WITH_APPT_API:
    "https://ndhealthcheck.com/appointment-service/transaction/applicant-appointment/details",
  APPLICANT_RECEIPT_API:
    "https://ndhealthcheck.com/appointment-service/transaction/invoice/pdf/",
  // BASE_PATH: "/ND-Diagnostics-latest/",
  BASE_PATH: "/",
 DEFAULT_SERVICE_CODE : "APPT"
};
