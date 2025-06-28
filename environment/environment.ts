export const environment = {

  production: false,
  apiUrl: "http://localhost:3000/api",

  // TOKEN_API: "https://ndhealthcheck.com/appointment-service/api/auth/token",
  // APPLICANT_CRUD_API:
  //   "https://ndhealthcheck.com/appointment-service/transaction/applicant/details",
  // APPOINMENT_SAVE_API:
  //   "https://ndhealthcheck.com/appointment-service/transaction/book_appointment/save",
  // AVAILABLE_SLOTS_API:
  //   "https://ndhealthcheck.com/appointment-service/configuration/slot-listing",
  // AVAILABLE_CENTER_API:
  //   "https://ndhealthcheck.com/appointment-service/master/center?application=1",
  // AVAILABLE_SERVIVCE_API:
  //   "https://ndhealthcheck.com/appointment-service/master/service?status=1&application=1",
  // APPLICANT_WITH_APPT_API:
  //   "https://ndhealthcheck.com/appointment-service/transaction/applicant-appointment/details",
  
  // APPLICANT_RECEIPT_API: (appointmentId: string) =>
  //   `https://ndhealthcheck.com/appointment-service/transaction/invoice/pdf/${appointmentId}/download`,

  // APPOINMENT_REPORT_API:
  //   "https://ndhealthcheck.com/appointment-service/transaction/appointment-report",

  // APPOINMENT_REPORT_Cancel:
  //   "https://ndhealthcheck.com/appointment-service/transaction/appointment/cancel",

  // BASE_PATH: "/ND-Diagnostics-latest/",
  
  BASE_PATH: "/",
  DEFAULT_SERVICE_CODE: "APPT",
  SECRET_KEY: "Ndhelthcheck_@key", // Define your secret key for encryption/decryption



  // -----------local API




  TOKEN_API: "http://127.0.0.1:8001/api/auth/token",
  APPLICANT_CRUD_API:
    "http://127.0.0.1:8001/transaction/applicant/details",
  APPOINMENT_SAVE_API:
    "http://127.0.0.1:8001/transaction/book_appointment/save",
  AVAILABLE_SLOTS_API:
    "http://127.0.0.1:8001/configuration/slot-listing",
  AVAILABLE_CENTER_API:
    "http://127.0.0.1:8001/master/center?application=1",
  AVAILABLE_SERVIVCE_API:
    "http://127.0.0.1:8001/master/service?status=1&application=1",
  APPLICANT_WITH_APPT_API:
    "http://127.0.0.1:8001/transaction/applicant-appointment/details",
  APPLICANT_RECEIPT_API:(appointmentId: string) =>
    `http://127.0.0.1:8001/transaction/invoice/pdf/${appointmentId}`,

  APPOINMENT_REPORT_API:
    "http://127.0.0.1:8001/transaction/appointment-report",

  APPOINMENT_REPORT_Cancel:
    "http://127.0.0.1:8001/transaction/appointment/cancel"



};
