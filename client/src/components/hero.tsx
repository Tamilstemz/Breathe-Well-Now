import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import doctorImage from "@assets/newpic1_1749587017199.png";
import CryptoJS from "crypto-js";
import {
  CalendarCheck,
  CalendarSearch,
  CheckCircle,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../api/httpClient";
import { environment } from "../../../environment/environment";

interface AppointmentData {
  reappoint_code: string;
  applicant_number: string;
  passport_number: string;
  patient_name: string;
  date_booked: string;
  booked_time: string;
  booking_status: string;
  service__name: string;
  email: string;
  contact_number: string;
  Newslot?: any;
  center_id: string;
}

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigate = useNavigate();
  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [searchType, setSearchType] = useState("referenceId");
  const [contactType, setContactType] = useState("mobile");

  const [searchValue, setSearchValue] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);

  const [otpButtontype, setotpButtontype] = useState("Reschedule");
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [successmsg, setsuccessmsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpErrorActive, setOtpErrorActive] = useState(false);
  const [timer, setTimer] = useState(environment.OTP_TIMER_DURATION); // 2 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timerVisible, setTimerVisible] = useState(true);
  const [appointmentCancelBtn, setAppointmentCancelBtn] = useState(false);
  const [errors, setErrors] = useState<{
    searchValue?: string;
    contactValue?: string;
  }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // const handleTrackBooking = () => {
  //   setOpenModal(false);
  // };

  useEffect(() => {
    startTimer(); // auto trigger only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!resendDisabled) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          setTimerVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendDisabled]);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current); // Clear any existing timer

    setTimer(environment.OTP_TIMER_DURATION); // reset to 2 minutes

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const encrypted = localStorage.getItem("Newslot");

    if (encrypted) {
      try {
        const decrypted = CryptoJS.AES.decrypt(
          encrypted,
          environment.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);

        const parsedData = JSON.parse(decrypted);
        console.log("parsedData--------", parsedData);

        setAppointmentData(parsedData);
        setShowAppointmentModal(true);
        setotpButtontype("Reschedule");
        setOtpVisible(true);
        setOtpError("");

        // setRescheduledAppointments(parsedData);
      } catch (error) {
        console.error("Error decrypting or parsing Newslot data:", error);
      }
    }
  }, []);

  const handleClear = () => {
    setSearchType("referenceId");
    setSearchValue("");
    setContactType("mobile");
    setContactValue("");
    setErrors({});
  };

  const bookingStatusMap: { [key: number]: string } = {
    1: "Booked",
    2: "Cancelled",
    3: "Rescheduled",
    4: "Completed",
  };

  const moveToTracking = () => {
    setShowAppointmentModal(false);
    setAppointmentData([]);
    setOpenModal(true);
  };

  const getDecryptedAppointments = (): any[] => {
    const encrypted = localStorage.getItem("appointments");
    if (!encrypted) return [];

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, environment.SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      return [];
    }
  };

  const handleRescheduleClick = (item: any) => {
    // setotpButtontype('Reschedule')
    // setOtpVisible(true);
    // setOtp("998999");
    // setOtpError("");

    // Get and filter out any existing appointment with same ID

    let existing = getDecryptedAppointments().filter(
      (appt) => appt.id !== item.id
    );

    // Add the new appointment
    existing.push(item);

    // Encrypt and save to localStorage
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(existing),
      environment.SECRET_KEY
    ).toString();

    localStorage.setItem("appointments", encrypted);

    // Navigate and scroll
    navigate(`${environment.BASE_PATH}AppointmentBooking`);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    const nextInput = e.target.nextElementSibling as HTMLInputElement | null;
    if (nextInput) {
      nextInput.focus();
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault(); // Prevent default cursor move

      const newOtp = [...otp];
      if (otp[index]) {
        // If current has value, just clear it
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // If current is already empty, move to previous
        const prevInput = e.currentTarget
          .previousElementSibling as HTMLInputElement | null;
        if (prevInput) {
          prevInput.focus();
          const newOtp = [...otp];
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      }
    }
  };

  const handleValidateOtp = async () => {
    const payload = {
      phone_number: appointmentData[0]?.contact_number,
      otp: otp.join(""), // Combine the 6 digits
    };

    try {
      const res = await httpClient.post(environment.OTP_VALIDATE_API, payload);

      if (res.data.status) {
        toast({
          title: "success",
          description: res.data.message,
          variant: "success",
          duration: 4000,
        });
        setAppointmentCancelBtn(true);
        setsuccessmsg(res.data.message);
        setTimerVisible(false);
      } else {
        showOtpError(res.data.message || "Invalid OTP");

        return;
      }
    } catch (error) {
      console.error("OTP validation error:", error);
      showOtpError("OTP validation failed");
    }
  };

  const showOtpError = (message: string) => {
    setOtpError(message);
    setOtpErrorActive(true);

    // Remove error after 10 seconds
    setTimeout(() => {
      setOtpError("");
      setOtpErrorActive(false);
    }, 5000);
  };

  const handleResendOtp = async () => {
    const otpdata1 = {
      applicant_number: appointmentData[0]?.applicant_number,
      contact_number: appointmentData[0]?.contact_number,
      otp_type: "CancelOTP",
      center_id: appointmentData[0]?.center_id,
      newtype: "resend",
    };
    const res = await httpClient.post(environment.OTP_API, otpdata1);

    console.log("OTP Response:", res);
    toast({
      title: "success",
      description: res.data.message,
      variant: "success",
      duration: 4000,
    });
    alert("OTP resent!");
    setOtp(new Array(6).fill(""));
    startTimer();
  };

  const formatTimer = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handlecancelAppointmentDetails = async () => {
    const otpdata = {
      applicant_number: appointmentData[0]?.applicant_number,
      contact_number: appointmentData[0]?.contact_number,
      otp_type: "CancelOTP",
      center_id: appointmentData[0]?.center_id,
      newtype: "new",
    };

    const res = await httpClient.post(environment.OTP_API, otpdata);

    console.log("OTP Response:", res);
    toast({
      title: "success",
      description: res.data.message,
      variant: "success",
      duration: 4000,
    });
    setotpButtontype("cancel");
    setOtpVisible(true);
    setOtpError("");
  };

  const handleConfirmReschedule = async (item: any) => {
    // if (!/^\d{6}$/.test(otp)) {
    //   setOtpError("Please enter a valid 6-digit OTP");
    //   return;
    // }

    const rescheduleConfirm = window.confirm(
      "Are you sure you want to reschedule this appointment?"
    );

    if (!rescheduleConfirm) return;

    try {
      // 1. Remove related localStorage entries
      localStorage.removeItem("appointments");
      localStorage.removeItem("Newslot");

      // 2. Build the cancellation payload
      const payload = {
        booked_time: item.booked_time,
        booking_status: 3, // 2 = Cancelled
        date_booked: item.date_booked,
        id: item.id,
        visa_number: item.visa_number,
        otp: otp, // Assuming backend requires OTP
      };

      // 3. Send the POST request
      const response = await fetch(environment.APPOINMENT_REPORT_Cancel, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Cancellation response:", result);

      // 4. Handle response
      if (result.status === 1) {
        setShowAppointmentModal(false);
        setAppointmentData([]);
        setOtpVisible(false);
        setAppointmentCancelBtn(false);
        setTimerVisible(false)
        setResendDisabled(true);

      } else {
        setOtpError(result.message || "Cancellation failed. Try again.");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      setOtpError("Something went wrong. Please try again.");
    }
  };

  const handleCancelAppointment = async (item: any) => {
    try {
      const payload = {
        booked_time: item.booked_time,
        booking_status: 2, // 2 = Cancelled
        date_booked: item.date_booked,
        id: item.id,
        visa_number: item.visa_number,
        otp: otp, // Include OTP for backend verification if needed
      };

      const response = await fetch(environment.APPOINMENT_REPORT_Cancel, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log("111111---", result);

      if (result.status === 1) {
        toast({
          title: "Cancelled",
          description: "Your appointment has been cancelled successfully.",
          variant: "success",
          duration: 4000,
        });
        // Optionally close modal or refresh data here
        setShowAppointmentModal(false);
        setAppointmentData([]);
      } else {
        setOtpError(result.message || "Cancellation failed. Try again.");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      setOtpError("An error occurred. Please try again.");
    }
  };

  const handleTrackBooking = async () => {
    const newErrors: typeof errors = {};

    // Validate Reference ID or Passport Number
    if (!searchValue.trim()) {
      newErrors.searchValue = `${
        searchType === "passport" ? "Passport Number" : "Reference ID"
      } is required.`;
    } else if (
      searchType === "passport" &&
      !/^[A-Z0-9]{6,12}$/.test(searchValue)
    ) {
      newErrors.searchValue =
        "6-12 characters, uppercase letters/numbers only.";
    }

    // Validate Mobile or Email
    if (!contactValue.trim()) {
      newErrors.contactValue = `${
        contactType === "email" ? "Email ID" : "Mobile Number"
      } is required.`;
    } else if (
      contactType === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contactValue)
    ) {
      newErrors.contactValue = "Enter a valid email (e.g., name@example.com)";
    } else if (contactType === "mobile" && !/^\d{10}$/.test(contactValue)) {
      newErrors.contactValue = "Enter a valid 10-digit mobile number.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Stop if validation fails

    try {
      const getAppointment = "yes";
      const formData = new FormData();
      formData.append("application", "1");
      formData.append("getAppointment", getAppointment);
      formData.append("searchType", searchType);
      formData.append("searchValue", searchValue);
      formData.append("contactType", contactType);
      formData.append("contactValue", contactValue);

      const response = await fetch(environment.APPOINMENT_REPORT_API, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("vvvvvv----0000", data);
      if (data?.message === "success" && data?.detail?.legend !== 0) {
        setAppointmentData(data?.detail);
        handleClear();
        setOpenModal(false);
        setShowAppointmentModal(true);
      } else {
        toast({
          title: "Warning",
          description: data?.message,
          variant: "warn",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Search failed", error);
      alert("Error fetching appointment");
    }
  };

  return (
    <section
      id="home"
      className="hero-gradient py-16 lg:py-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-brand-purple/5 to-brand-teal/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl xl:text-6xl font-bold leading-tight break-words">
              <span className="text-brand-black">Australia Visa</span>
              <br />
              <span className="text-brand-orange">Medical Examinations</span>
            </h1>
            <p className="text-xl text-brand-black leading-relaxed">
              Welcome to ND Diagnostics India Private Limited, your trusted
              partner for comprehensive medical examinations required for
              Australia visa applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <Button
                onClick={() => {
                  navigate(`${environment.BASE_PATH}AppointmentBooking`);
                  setTimeout(
                    () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    50
                  );
                }}
                size="lg"
                className="card-gradient-blue text-white font-semibold text-lg transition-all duration-300 hover:scale-105 border-0"
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                Schedule Examination
              </Button>

              <Button
                onClick={() => setOpenModal(true)}
                variant="outline"
                size="lg"
                className="border-2 border-brand-green text-brand-green hover:bg-orange-500 hover:text-white hover:border-transparent font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                <CalendarSearch className="mr-2 h-5 w-5" />
                Track Appointment
              </Button>
              {/* 
            <Button
            onClick={() => scrollToSection("about")}
            variant="outline"
            size="lg"
            className="border-2 border-brand-orange text-brand-orange hover:card-gradient-orange hover:text-white hover:border-transparent font-semibold text-lg transition-all duration-300 hover:scale-105"
          >
            <Info className="mr-2 h-5 w-5" />
            Learn More
          </Button> */}
            </div>
          </div>

          <div className="relative min-w-0">
            <img
              src={doctorImage}
              alt="Medical professional with equipment"
              className="rounded-2xl shadow-2xl w-full max-h-[600px] object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Modal for Track Appointment */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Track Your Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Select ID Type
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="">Choose your ID type</option>
                <option value="hap">HAP ID</option>
                <option value="passport">Passport Number</option>
                <option value="referenceId">Reference Number</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                {searchType === "hap"
                  ? "HAP ID"
                  : searchType === "passport"
                  ? "Passport Number"
                  : "Reference ID"}
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your ID"
                value={searchValue}
                onChange={(e) =>
                  setSearchValue(
                    searchType === "passport"
                      ? e.target.value.toUpperCase()
                      : e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Mobile Number
              </label>
              <input
                type="tel"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your mobile number"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTrackBooking}
              className="w-full card-gradient-blue text-white font-semibold transition-none"
            >
              <Search className="w-5 h-5 text-white" /> Track Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showAppointmentModal && appointmentData.length > 0 && (
        <Dialog open={true} onOpenChange={() => setShowAppointmentModal(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Your appointment information and options
              </DialogDescription>
            </DialogHeader>

            {appointmentData.map((item, index) => (
              <div key={index} className="space-y-4 mt-2 text-sm">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Appointment Details</div>
                  <div className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />{" "}
                    {bookingStatusMap[parseInt(item.booking_status)] ||
                      "Unknown"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500">Date</div>
                    <div className="font-medium">
                      {new Date(item.date_booked).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Time</div>
                    <div className="font-medium">{item.booked_time}</div>
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">Examination Type</div>
                  <div className="font-medium">{item.service__name}</div>
                </div>

                <div>
                  <div className="text-gray-500">Reference Number</div>
                  <div className="font-medium">{item.applicant_number}</div>
                </div>

                {item && item?.Newslot && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">
                        Reschedule Appointment Details
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-500">Date</div>
                        <div className="font-medium">
                          {new Date(
                            item?.Newslot?.slotItem?.slot?.date
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Time</div>
                        <div className="font-medium">{item?.Newslot?.time}</div>
                      </div>
                    </div>
                  </>
                )}

                {!otpVisible ? (
                  parseInt(item.booking_status) === 1 ? (
                    <div className="flex justify-between gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleRescheduleClick(item)}
                      >
                        <RefreshCcw className="w-4 h-4 mr-1" />
                        Reschedule
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handlecancelAppointmentDetails}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  ) : null
                ) : (
                  <>
                    {/* <div>
                      <p className="text-sm text-muted-foreground">
                        Enter the OTP sent to your mobile number to{" "}
                        {otpButtontype === "Reschedule"
                          ? "reschedule your booking:"
                          : "Cancel your booking:"}
                      </p>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "");
                          if (onlyDigits.length <= 6) setOtp(onlyDigits);
                        }}
                        className="mt-2 text-center tracking-widest font-semibold text-lg"
                      />
                      <button onClick={handleValidateOtp}>Verify OTP</button>
                      {otpError && (
                        <div className="text-red-600 text-xs mt-1">
                          {otpError}
                        </div>
                      )}
                    </div> */}
                    {/* <div className="mt-4 max-w-sm mx-auto bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 text-center">
                      <h6 className="text-sm font-semibold mb-4 text-gray-800 dark:text-white">
                        {" "}
                        Enter the OTP sent to your mobile number to{" "}
                        {otpButtontype === "Reschedule"
                          ? "reschedule your booking:"
                          : "Cancel your booking:"}
                      </h6>

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "");
                          if (onlyDigits.length <= 6) setOtp(onlyDigits);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-center tracking-widest font-semibold text-lg text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />

                      <button
                        onClick={handleValidateOtp}
                        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow"
                      >
                        Verify OTP
                      </button>

                      {otpError && (
                        <p className="mt-3 text-red-600 text-sm font-medium">
                          {otpError}
                        </p>
                      )}
                    </div> */}

                    <p className="otpSubheading">
                      We’ve sent a 6-digit code to{" "}
                      {appointmentData[0]?.contact_number}
                    </p>

                    <div className="inputContainer">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          pattern="\d*"
                          value={digit}
                          onChange={(e) => handleChange(e, i)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          className={`otp-input ${
                            otpErrorActive ? "error" : ""
                          }`}
                          disabled={appointmentCancelBtn}
                        />
                      ))}
                    </div>
                    {timerVisible && (
                      <p className="countdown-timer">
                        ⏳ OTP expires in: <strong>{formatTimer()}</strong>
                      </p>
                    )}
                    {otpError && (
                      <div className="otp-error">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="error-icon"
                          viewBox="0 0 20 20"
                          fill="red"
                          width="20"
                          height="20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-6h2v5h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{otpError}</span>
                      </div>
                    )}
                    {successmsg && (
                      <div className="otp-success">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="success-icon"
                          viewBox="0 0 20 20"
                          fill="green"
                          width="20"
                          height="20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{successmsg}</span>
                      </div>
                    )}

                    <button
                      className="verifyButton"
                      onClick={handleValidateOtp}
                    >
                      Verify
                    </button>

                    <p className="resendNote">
                      Didn’t receive code?
                      <button
                        type="button"
                        className="resendBtn"
                        disabled={resendDisabled}
                        onClick={handleResendOtp}
                      >
                        Resend Code
                      </button>
                    </p>

                    <div className="flex justify-between gap-2 pt-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={
                          otpButtontype === "Reschedule"
                            ? () => {
                                navigate(
                                  `${environment.BASE_PATH}AppointmentBooking`
                                );
                              }
                            : () => setOtpVisible(false)
                        }
                      >
                        Back
                      </Button>
                      {otpButtontype === "Reschedule" ? (
                        <Button
                          className="w-full bg-orange-500 text-white font-semibold"
                          // disabled={!/^\d{6}$/.test(otp)}
                          onClick={() => handleConfirmReschedule(item)}
                        >
                          Confirm Reschedule
                        </Button>
                      ) : (
                        <Button
                          className={`w-full font-semibold transition duration-300 ${
                            appointmentCancelBtn
                              ? "bg-orange-500 text-white cursor-pointer hover:bg-orange-600"
                              : "bg-gray-400 text-white cursor-not-allowed"
                          }`}
                          disabled={!appointmentCancelBtn}
                          onClick={() => handleCancelAppointment(item)}
                        >
                          Cancel Appointment
                        </Button>
                      )}
                    </div>

                    <div className="text-center text-sm underline text-muted-foreground hover:text-black cursor-pointer pt-2">
                      Resend OTP
                    </div>
                  </>
                )}

                <div
                  className="text-center text-sm text-muted-foreground pt-4 underline cursor-pointer hover:text-black"
                  onClick={moveToTracking}
                >
                  Track Another Booking
                </div>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
