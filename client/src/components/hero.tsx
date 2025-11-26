import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarCheck,
  CalendarSearch,
  CheckCircle,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../api/httpClient";
import { API, environment } from "../../../environment/environment";
import { decrypt, encrypt } from "../../../utils/crypto-util";
import NewBannerImage from "../../assests/NewBannerImage.png";
import successImg from "../../assests/successImg.png";

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

type ApplicantResData = {
  id?: number;
  fullname?: string;
  email?: string;
  contact_number?: string;
  passport_number?: string;
  hap_id?: string;
  age?: number;
  dob?: string;
  gender?: string;
  appointment_id?: number;
  reference?: string;
  department?: string;
  service?: string;
  date?: string;
  time?: string;
  applicant_number?: string;
};

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

  const [newappointmentSlot, setNewAppointmentSlot] = useState<any[]>([]);
  console.log("newappointmentSlot:", newappointmentSlot);

  const [appointmentType, setappointmentType] = useState("");

  const [otpButtontype, setotpButtontype] = useState("Reschedule");
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [successmsg, setsuccessmsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpErrorActive, setOtpErrorActive] = useState(false);
  const [timer, setTimer] = useState(environment.OTP_TIMER_DURATION); // 5 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timerVisible, setTimerVisible] = useState(true);
  const [appointmentCancelBtn, setAppointmentCancelBtn] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<any[]>([]);
  console.log("selectedApplicants :", selectedApplicants);
  const [showFastTrackModal, setShowFastTrackModal] = useState<boolean>(false);
  const [fastTrackSearchType, setFastTrackSearchType] =
    useState<string>("referenceId");

  const [fastTrackSearchValue, setFastTrackSearchValue] = useState<string>("");
  const [fastTrackContactValue, setFastTrackContactValue] =
    useState<string>("");
  const [fastTrackErrors, setFastTrackErrors] = useState<{
    searchValue?: string;
    contactValue?: string;
  }>({});

  const [isLoadingApplicantData, setIsLoadingApplicantData] =
    useState<boolean>(false);
  const [fasttrackapplicantdata, setfasttrackapplicantdata] = useState<any>({});
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(0);
  const [completedTemplates, setCompletedTemplates] = useState<number[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState<boolean>(false);
  const [selectedFastTrackapplicants, setselectedFastTrackapplicants] =
    useState({});
  const [isfatstrackotpvisible, setisfatstrackotpvisible] = useState(false);
  const [errors, setErrors] = useState<{
    searchValue?: string;
    contactValue?: string;
  }>({});
  const [successModule, setsuccessModule] = useState(false);
  const [appicantResdata, setAppicantResdata] = useState<ApplicantResData>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [consentFormData, setconsentFormData] = useState<any>({});
  useEffect(() => {
    if (!resendDisabled) return;

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [resendDisabled]);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current); // Clear previous

    setTimer(environment.OTP_TIMER_DURATION); // e.g., 300 seconds
    setResendDisabled(true); // Block resend during countdown
    setTimerVisible(true); // Show the timer

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          setResendDisabled(false); // Enable resend
          setTimerVisible(false); // Hide timer after 5 mins
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getDecryptedAppointmentsdata = (): any[] => {
    const encrypted = localStorage.getItem("appointments");
    if (!encrypted) return [];

    const decrypted = decrypt(encrypted);
    try {
      return decrypted ? JSON.parse(decrypted) : [];
    } catch (error) {
      console.error("Decryption JSON parse error:", error);
      return [];
    }
  };

  useEffect(() => {
    const processNewSlotData = async () => {
      let encrypted;
      if (localStorage.getItem("NewRescheduleData")) {
        encrypted = localStorage.getItem("NewRescheduleData");
      } else {
        encrypted = localStorage.getItem("Newslot");
      }
      // const encrypted = localStorage.getItem("Newslot");

      if (encrypted) {
        try {
          const decrypted = decrypt(encrypted);
          const parsedData = JSON.parse(decrypted ?? "[]");
          console.log("parsedData111--------", parsedData);

          const Appoinment = getDecryptedAppointmentsdata();
          console.log("parsedData222-------", Appoinment);

          const appointmentType = localStorage.getItem("appointmentType");
          setappointmentType(appointmentType ?? "");
          setAppointmentData(Appoinment);
          setNewAppointmentSlot(parsedData);

          const filteredSelectedApplicants = Appoinment.filter((item: any) =>
            parsedData.some(
              (a: any) => a.applicant_number === item.applicant_number
            )
          );

          const otpdata = {
            applicant_number: Appoinment[0]?.applicant_number,
            contact_number: Appoinment[0]?.contact_number,
            otp_type: "RescheduleOTP",
            center_id: Appoinment[0]?.center_id,
            newtype: "new",
          };

          const res = await httpClient.post(API.OTP_API, otpdata);
          console.log("OTP Response:", res);

          toast({
            title: "success",
            description: res.data.message,
            variant: "success",
            duration: 4000,
          });

          startTimer(); // ✅ Start 5-min timer
          setOtpVisible(true);
          setOtpError("");
          setotpButtontype("Reschedule");
          setSelectedApplicants(filteredSelectedApplicants);
          setShowAppointmentModal(true);
        } catch (error) {
          console.error("Error decrypting or processing Newslot data:", error);
        }
      }
    };

    processNewSlotData();
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

    const decrypted = decrypt(encrypted);
    try {
      return decrypted ? JSON.parse(decrypted) : [];
    } catch (error) {
      console.error("Decryption JSON parse error:", error);
      return [];
    }
  };

  const handleCheckboxToggle = (item: any) => {
    setSelectedApplicants((prev) => {
      const exists = prev.find(
        (a) => a.applicant_number === item.applicant_number
      );
      return exists
        ? prev.filter((a) => a.applicant_number !== item.applicant_number)
        : [...prev, item];
    });
  };

  const handleRescheduleClick = async (item: any) => {
    setotpButtontype("Reschedule");
    if (appointmentType === "Group") {
      console.log("Group----item", item); // item is an array of appointments

      // Remove existing appointments from localStorage
      let existing = getDecryptedAppointments().filter(
        (appt: any) => !item.some((i: any) => i.id === appt.id)
      );

      // Add new group appointments
      existing = [...existing, ...item];

      // Encrypt and save
      const encrypted = encrypt(JSON.stringify(existing));

      localStorage.setItem("appointments", encrypted);
      localStorage.setItem("Reschedule", "true");
      localStorage.setItem("appointmentType", appointmentType);

      // Navigate and scroll
      navigate(`${environment.BASE_PATH}AppointmentBooking`);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    } else {
      // const otpdata = {
      //   applicant_number: appointmentData[0]?.applicant_number,
      //   contact_number: appointmentData[0]?.contact_number,
      //   otp_type: "RescheduleOTP",
      //   center_id: appointmentData[0]?.center_id,
      //   newtype: "new",
      // };

      // const res = await httpClient.post(environment.OTP_API, otpdata);
      // console.log("OTP Response:", res);
      // toast({
      //   title: "success",
      //   description: res.data.message,
      //   variant: "success",
      //   duration: 4000,
      // });
      // startTimer();
      // // setotpButtontype("Reschedule");
      // setOtpVisible(true);
      // setOtpError("");

      let existing = getDecryptedAppointments().filter(
        (appt: any) => appt.id !== item.id
      );
      existing.push(item);
      const encrypted = encrypt(JSON.stringify(existing));
      localStorage.setItem("appointments", encrypted);
      // setOtpVisible(true);
      navigate(`${environment.BASE_PATH}AppointmentBooking`);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    console.log("newotp :", newOtp);

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

  //   const handleValidateOtp = async (otptype?: any) => {
  //     console.log("otpButtontype:", otpButtontype);
  //     console.log("otptype :",otptype)
  //     let finalotptype;

  //     if (otptype) {
  //       finalotptype = otptype.target.value;
  //     } else {
  //       finalotptype =
  //         otpButtontype === "Reschedule" ? "RescheduleOTP" : "CancelOTP";
  //     }
  // console.log("otp :",otp);

  //     const payload = {
  //       phone_number: appointmentData[0]?.contact_number,
  //       applicant_number: appointmentData[0]?.applicant_number,
  //       otp: otp.join(""), // Combine the 6 digits
  //       otp_type: finalotptype,
  //     };
  //     console.log(payload);

  //     try {
  //       const res = await httpClient.post(API.OTP_VALIDATE_API, payload);

  //       if (res.data.status) {
  //         toast({
  //           title: "success",
  //           description: res.data.message,
  //           variant: "success",
  //           duration: 4000,
  //         });

  //         setAppointmentCancelBtn(true);

  //         setsuccessmsg(res.data.message);
  //         setTimerVisible(false);
  //         if (otptype == "FastTrackOTP") {
  //           localStorage.setItem("consentform", JSON.stringify(consentFormData));
  //           navigate("/ConsentForm");

  //           console.log("55555", consentFormData);

  //           toast({
  //             title: "Success",
  //             description: "Applicant details loaded successfully!",
  //             variant: "success",
  //             duration: 4000,
  //           });
  //         }
  //       } else {
  //         showOtpError(res.data.message || "Invalid OTP");

  //         return;
  //       }
  //     } catch (error) {
  //       console.error("OTP validation error:", error);
  //       showOtpError("OTP validation failed");
  //     }
  //   };

  const handleValidateOtp = async () => {
    console.log("otpButtontype:", otpButtontype);

    const finalotptype =
      otpButtontype === "Reschedule" ? "RescheduleOTP" : "CancelOTP";

    console.log("otp :", otp);

    const payload = {
      phone_number: appointmentData[0]?.contact_number,
      applicant_number: appointmentData[0]?.applicant_number,
      otp: otp.join(""), // Combine the 6 digits
      otp_type: finalotptype,
    };
    console.log(payload);

    try {
      const res = await httpClient.post(API.OTP_VALIDATE_API, payload);

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
        // if (otptype == "FastTrackOTP") {
        //   localStorage.setItem("consentform", JSON.stringify(consentFormData));
        //   navigate("/ConsentForm");

        //   console.log("55555", consentFormData);

        //   toast({
        //     title: "Success",
        //     description: "Applicant details loaded successfully!",
        //     variant: "success",
        //     duration: 4000,
        //   });
        // }
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
      otp_type: otpButtontype === "Reschedule" ? "RescheduleOTP" : "CancelOTP",
      center_id: appointmentData[0]?.center_id,
      newtype: "resend",
    };
    const res = await httpClient.post(API.OTP_API, otpdata1);

    console.log("OTP Response:", res);
    toast({
      title: "success",
      description: res.data.message,
      variant: "success",
      duration: 4000,
    });
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

    const res = await httpClient.post(API.OTP_API, otpdata);

    console.log("OTP Response:", res);
    toast({
      title: "success",
      description: res.data.message,
      variant: "success",
      duration: 4000,
    });
    startTimer();
    setotpButtontype("cancel");
    setOtpVisible(true);
    setOtpError("");
  };

  console.log("appointmentData :", appointmentData);

  const handleConfirmReschedule = async (item: any) => {
    // if (!/^\d{6}$/.test(otp)) {
    //   setOtpError("Please enter a valid 6-digit OTP");
    //   return;
    // }

    if (newappointmentSlot && item) {
      const rescheduleConfirm = window.confirm(
        "Are you sure you want to reschedule this appointment?"
      );

      if (!rescheduleConfirm) return;
      console.log("selectedApplicants :", selectedApplicants);
      try {
        let payload = {};
        console.log("payload :", payload);
        console.log("API :", API.APPOINMENT_REPORT_CANCEL);

        if (appointmentType === "Group") {
          const data = localStorage.getItem("NewRescheduleData");
          const groupdata = newappointmentSlot.map((item) => ({
            booked_time: item.slot_booking.booked_time,
            booking_status: 3,
            date_booked: item.slot_booking.date_booked,
            id: item.id,
            visa_number: item.visa_number,
            otp: otp,
          }));

          payload = {
            appointmentType: appointmentType,
            groupdata: groupdata,
            booking_status: 3,
          };
        } else {
          payload = {
            booked_time: item.booked_time,
            booking_status: 3,
            date_booked: item.date_booked,
            id: item.id,
            visa_number: item.visa_number,
            otp: otp,
          };
        }

        const response = await fetch(API.APPOINMENT_REPORT_CANCEL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log("Cancellation response:", result);

        console.log("payload---vvv-33333", appointmentData);

        if (result.status === 1) {
          const res = await httpClient.post(
            API.APPLICANT_WITH_APPT_API,
            newappointmentSlot
          );

          const responseData = res.data.data;

          console.log("payload---vvv-44444", responseData);

          if (res.data.status === 1) {
            localStorage.removeItem("appointments");
            localStorage.removeItem("Newslot");
            localStorage.removeItem("appointmentType");
            localStorage.removeItem("NewRescheduleData");
            setShowAppointmentModal(false);
            setAppointmentData([]);
            setOtpVisible(false);
            setAppointmentCancelBtn(false);
            setTimerVisible(false);
            setResendDisabled(true);
            setShowAppointmentModal(false);
            setAppointmentData([]);
            resetAppointmentState();
            setsuccessModule(true);
            if (responseData?.[0]) {
              const applicant = responseData[0].applicant || {};
              const booking = responseData[0].appointments?.bookings?.[0] || {};
              const applicantNumber = responseData[0].applicant_number || "";

              setAppicantResdata({
                ...applicant,
                ...booking,
                applicant_number: applicantNumber,
              });
            }
          }
        } else {
          setOtpError(result.message || "Cancellation failed. Try again.");
        }
      } catch (error) {
        console.error("Cancellation error:", error);
        setOtpError("Something went wrong. Please try again.");
      }
    }
  };

  const resetAppointmentState = () => {
    setShowAppointmentModal(false);
    setAppointmentData([]);
    localStorage.removeItem("appointments");
    localStorage.removeItem("Newslot");
    localStorage.removeItem("appointmentType");
    setOtpVisible(false);
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);
    setAppointmentCancelBtn(false);
    setSelectedApplicants([]);
    setappointmentType("");
    setResendDisabled(true);
    setsuccessModule(false);
    setTimerVisible(false);
    setNewAppointmentSlot([]);
    setsuccessmsg("")
  };

  const handleCancelAppointment = async (item: any) => {
    try {
      let payload = {};
      if (appointmentType === "Group") {
        const groupdata = selectedApplicants.map((item) => ({
          booked_time: item.booked_time,
          booking_status: 2,
          date_booked: item.date_booked,
          id: item.id,
          visa_number: item.visa_number,
          otp: otp,
        }));

        payload = {
          appointmentType: appointmentType,
          groupdata: groupdata,
          booking_status: 2,
        };
      } else {
        payload = {
          booked_time: item.booked_time,
          booking_status: 2, // 2 = Cancelled
          date_booked: item.date_booked,
          id: item.id,
          visa_number: item.visa_number,
          otp: otp, // Include OTP for backend verification if needed
        };
      }

      const response = await fetch(API.APPOINMENT_REPORT_CANCEL, {
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
        resetAppointmentState();
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

      const response = await fetch(API.APPOINMENT_REPORT_API, {
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
        setappointmentType(data?.RegistrationType);
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

  const handleStartForms = async () => {
    setShowFastTrackModal(true);
  };

  const handleFastTrackSearch = async () => {
    const newErrors: typeof fastTrackErrors = {};

    console.log("111111", fastTrackSearchValue);

    if (!fastTrackSearchValue.trim()) {
      newErrors.searchValue = "Applicant No is required.";
    }
    console.log("22222", fastTrackContactValue);

    if (!fastTrackContactValue.trim()) {
      newErrors.contactValue = "Mobile Number is required.";
    } else if (!/^\d{10}$/.test(fastTrackContactValue)) {
      newErrors.contactValue = "Enter a valid 10-digit mobile number.";
    }

    console.log("33333", newErrors);

    setFastTrackErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsLoadingApplicantData(true);

    try {
      console.log("44444", fastTrackSearchType);

      const getAppointment = "yes";
      const formData = new FormData();
      formData.append("application", "1");
      formData.append("getAppointment", getAppointment);
      formData.append("searchType", fastTrackSearchType);
      formData.append("searchValue", fastTrackSearchValue);
      formData.append("contactType", contactType);
      formData.append("contactValue", fastTrackContactValue);
      formData.append("fasttrack", true);
      const response = await fetch(API.APPOINMENT_REPORT_API, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("fast trac status", data.warning);
      console.log("data :", data);

      if (data.warning) {
        showToast("error", data.warning);
        setFastTrackContactValue("");
        setfasttrackapplicantdata([]);
        setFastTrackSearchType("referenceId");
        setFastTrackSearchValue("");
        setContactType("");
        setSearchType("");
        setShowFastTrackModal(false);
      } else if (data.error) {
        showToast("error", data.error);
        setFastTrackContactValue("");
        setfasttrackapplicantdata([]);
        setFastTrackSearchType("referenceId");
        setFastTrackSearchValue("");
        setContactType("");
        setSearchType("");
        setShowFastTrackModal(false);
      } else {
        console.log("else working data");
        
        setconsentFormData(data?.detail[0]);
        setselectedFastTrackapplicants(data?.detail[0]);
        setAppointmentData(data?.detail);
        localStorage.setItem("consentform", JSON.stringify(data?.detail[0]));
        navigate("/ConsentForm");

        const appointmentData1 = data?.detail[0];
        // const otpdata = {
        //   applicant_number: appointmentData1?.applicant_number,
        //   contact_number: appointmentData1?.contact_number,
        //   otp_type: "FastTrackOTP",
        //   center_id: appointmentData1?.center_id,
        //   newtype: "new",
        // };
        // console.log("otpdata :", otpdata);

        // const res1 = await httpClient.post(API.OTP_API, otpdata);

        // toast({
        //   title: "success",
        //   description: res1.data.message,
        //   variant: "success",
        //   duration: 4000,
        // });

        // startTimer(); // ✅ Start 5-min timer
        // setShowFastTrackModal(false);

        // setShowAppointmentModal(true);
        // setisfatstrackotpvisible(true);
      }
    } catch (error: any) {
      console.log("66666", newErrors);

      console.error("Error in fast track:", error);
      toast({
        title: "Error",
        description: error,
        duration: 4000,
      });
    } finally {
      console.log("77777", newErrors);

      setIsLoadingApplicantData(false);
    }
  };

  return (
    <section
      id="home"
      className="hero-gradient py-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-brand-purple/5 to-brand-teal/5"></div>
      <div className="" style={{ marginLeft: "115px", marginRight: "60px" }}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
          <div className="space-y-8 text-left lg:text-left">
            <div>
              <h1 className="text-4xl xl:text-6xl font-bold leading-tight break-words">
                <span className="text-brand-black">Visa Medical</span>
                <br />
                <span className="text-brand-orange">Examinations</span>
              </h1>
            </div>
            <p className="text-xl text-brand-black leading-relaxed">
              Welcome to ND Diagnostics India Private Limited, your trusted
              partner for comprehensive medical examinations required for visa
              applications.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-8">
              <Button
                onClick={() => {
                  navigate(`${environment.BASE_PATH}AppointmentBooking`);
                  setTimeout(
                    () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    50
                  );
                }}
                size="lg"
                // className="card-gradient-blue text-white font-semibold text-lg transition-all duration-300 hover:scale-105 border-0"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-64"
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                Schedule Examination
              </Button>

              <Button
                onClick={() => setOpenModal(true)}
                variant="outline"
                size="lg"
                // className="border-2 border-brand-green text-brand-green hover:bg-orange-500 hover:text-white hover:border-transparent font-semibold text-lg transition-all duration-300 hover:scale-105"
                 className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white active:bg-orange-600 active:text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-64"
              >
                <CalendarSearch className="mr-2 h-5 w-5" />
                Track Appointment
              </Button>

              {/* <Button
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

          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* <img
              src={doctorImage}
              alt="Medical professional with equipment"
              className="rounded-2xl shadow-2xl w-full max-h-[600px] object-cover transition-transform duration-500 hover:scale-105"
            /> */}
<img
  src={NewBannerImage}
  alt="Medical professional with equipment"
  className="w-full h-[550px] object-cover relative transition-transform duration-500 ease-in-out hover:scale-95 hover:z-50"
/>


            </div>
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
                <option value="passport">Passport Number</option>
                <option value="referenceId">Applicant No</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                {searchType === "passport" ? "Passport Number" : "Applicant No"}
              </label>
              <input
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.searchValue ? "border-red-500" : ""
                }`}
                placeholder="Enter your ID"
                value={searchValue}
                maxLength={12}
                onChange={(e) =>
                  setSearchValue(
                    searchType === "passport"
                      ? e.target.value.toUpperCase()
                      : e.target.value
                  )
                }
              />
              {errors.searchValue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.searchValue}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                {contactType === "email" ? "Email ID" : "Mobile Number"}
              </label>
              <input
                type={contactType === "email" ? "email" : "tel"}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.contactValue ? "border-red-500" : ""
                }`}
                placeholder={
                  contactType === "email"
                    ? "Enter your email"
                    : "Enter your mobile number"
                }
                value={contactValue}
                maxLength={10}
                onChange={(e) => setContactValue(e.target.value)}
              />
              {errors.contactValue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contactValue}
                </p>
              )}
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
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) resetAppointmentState();
          }}
        >
          <DialogContent
            className={appointmentType === "Group" ? "max-w-4xl" : "max-w-md"}
          >
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Your appointment information and options
              </DialogDescription>
            </DialogHeader>
            {!isfatstrackotpvisible &&
              (appointmentType === "Group"
                ? appointmentData.length > 0 && (
                    <div className="table-responsive">
                      {/* === Original Appointments Table === */}
                      <table className="table table-bordered text-center align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Select</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Passport Number</th>
                            <th>Date</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointmentData.map((item, index) => (
                            <tr key={`original-${index}`}>
                              <td>
                                <input
                                  type="checkbox"
                                  value={item.applicant_number}
                                  checked={selectedApplicants.some(
                                    (a) =>
                                      a.applicant_number ===
                                      item.applicant_number
                                  )}
                                  onChange={() => handleCheckboxToggle(item)}
                                />
                              </td>
                              <td>{item.applicant_number}</td>
                              <td>{item.patient_name}</td>
                              <td>{item.passport_number}</td>
                              <td>
                                {new Date(item.date_booked).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </td>
                              <td>{item.booked_time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* === Rescheduled Appointments Table === */}
                      {newappointmentSlot?.length > 0 && (
                        <>
                          <div className="mt-4 mb-2 text-start font-semibold text-blue-600">
                            Reschedule Appointment Details
                          </div>

                          <table className="table table-bordered text-center align-middle bg-gray-50">
                            <thead className="table-light">
                              <tr>
                                <th>S.No.</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newappointmentSlot.map(
                                (newitem, index) =>
                                  Array.isArray(newitem.slot_booking) &&
                                  newitem.slot_booking.map(
                                    (slot: any, sIdx: any) => (
                                      <tr key={`new-${index}-${sIdx}`}>
                                        <td>{index + 1}</td>
                                        <td>
                                          {newitem.fullname ||
                                            newitem.patient_name}
                                        </td>
                                        <td>
                                          {new Date(
                                            slot.date_booked
                                          ).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </td>
                                        <td>{slot.booked_time}</td>
                                      </tr>
                                    )
                                  )
                              )}
                            </tbody>
                          </table>
                        </>
                      )}

                      {/* ACTION SECTION */}
                      {!otpVisible ? (
                        selectedApplicants.length > 0 &&
                        selectedApplicants.every(
                          (item) => parseInt(item.booking_status) === 1
                        ) && (
                          <div className="flex justify-between gap-2 pt-4">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() =>
                                handleRescheduleClick(selectedApplicants)
                              }
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
                        )
                      ) : (
                        <>
                          <div>
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
                                ⏳ OTP expires in:{" "}
                                <strong>{formatTimer()}</strong>
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
                          </div>

                          <div className="flex justify-between gap-2 pt-3">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={
                                otpButtontype === "Reschedule"
                                  ? () => {
                                      localStorage.removeItem("appointments");
                                      localStorage.removeItem("Newslot");
                                      navigate(
                                        `${environment.BASE_PATH}AppointmentBooking`
                                      );
                                    }
                                  : () => {
                                      localStorage.removeItem("appointments");
                                      localStorage.removeItem("Newslot");
                                      setOtpVisible(false);
                                    }
                              }
                            >
                              Back
                            </Button>
                            {otpButtontype === "Reschedule" ? (
                              <Button
                                className="w-full bg-orange-500 text-white font-semibold"
                                // disabled={!/^\d{6}$/.test(otp)}
                                onClick={() =>
                                  handleConfirmReschedule(selectedApplicants)
                                }
                                disabled={!appointmentCancelBtn}
                              >
                                Confirm Reschedule
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-orange-500 text-white font-semibold"
                                disabled={!appointmentCancelBtn}
                                onClick={() =>
                                  handleCancelAppointment(selectedApplicants)
                                }
                              >
                                Cancel Appointment
                              </Button>
                            )}
                          </div>

                          {/* <div className="text-center text-sm underline text-muted-foreground hover:text-black cursor-pointer pt-2">
                          Resend OTP
                        </div> */}
                        </>
                      )}
                    </div>
                  )
                : appointmentData.map((item, index) => (
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
                            {new Date(item.date_booked).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Time</div>
                          <div className="font-medium">{item.booked_time}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-500">Applicant No</div>
                          <div className="font-medium">
                            {item.applicant_number}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-500">Mobile Number</div>
                          <div className="font-medium">
                            {item.contact_number}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500">Examination Type</div>
                        <div className="font-medium">{item.service__name}</div>
                      </div>

                      {newappointmentSlot && newappointmentSlot.length > 0 && (
                        <>
                          <div className="flex justify-between items-center">
                            <div className="font-semibold">
                              Reschedule Appointment Details
                            </div>
                          </div>

                          {newappointmentSlot.map((newitem, index) => (
                            <div key={index}>
                              {Array.isArray(newitem.slot_booking) &&
                                newitem.slot_booking.map(
                                  (slot: any, sIdx: any) => (
                                    <div
                                      key={sIdx}
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div>
                                        <div className="text-gray-500">
                                          Date
                                        </div>
                                        <div className="font-medium">
                                          {new Date(
                                            slot.date_booked
                                          ).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-gray-500">
                                          Time
                                        </div>
                                        <div className="font-medium">
                                          {slot.booked_time}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                            </div>
                          ))}
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
                              ⏳ OTP expires in:{" "}
                              <strong>{formatTimer()}</strong>
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
                                      localStorage.removeItem("appointments");
                                      navigate(
                                        `${environment.BASE_PATH}AppointmentBooking`
                                      );
                                    }
                                  : () => {
                                      localStorage.removeItem("appointments");
                                      setOtpVisible(false);
                                    }
                              }
                            >
                              Back
                            </Button>
                            {otpButtontype === "Reschedule" ? (
                              <Button
                                className="w-full bg-orange-500 text-white font-semibold"
                                // disabled={!/^\d{6}$/.test(otp)}
                                onClick={() => handleConfirmReschedule(item)}
                                disabled={!appointmentCancelBtn}
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

                          {/* <div className="text-center text-sm underline text-muted-foreground hover:text-black cursor-pointer pt-2">
                          Resend OTP
                        </div> */}
                        </>
                      )}

                      <div
                        className="text-center text-sm text-muted-foreground pt-4 underline cursor-pointer hover:text-black"
                        onClick={moveToTracking}
                      >
                        Track Another Booking
                      </div>
                    </div>
                  )))}
            {isfatstrackotpvisible && (
              <>
                <p className="otpSubheading">
                  We’ve1 sent a 6-digit code to{" "}
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
                      className={`otp-input ${otpErrorActive ? "error" : ""}`}
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

                {/* <button
                  className="verifyButton"
                  onClick={() => handleValidateOtp("FastTrackOTP")}
                >
                  Verify
                </button> */}

                <p className="resendNote">
                  Didn’t receive code?
                  <button
                    type="button"
                    className="resendBtn"
                    disabled={resendDisabled}
                    onClick={() => handleResendOtp}
                  >
                    Resend Code
                  </button>
                </p>

                <div className="flex justify-between gap-2 pt-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowFastTrackModal(false);
                      setselectedFastTrackapplicants([]);
                      setAppointmentData([]);
                      setShowAppointmentModal(false);
                      setisfatstrackotpvisible(false);
                    }}
                  >
                    Back
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
      {successModule && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{
            position: "fixed",
            top: -100,
            left: 0,
            zIndex: 1050,
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            paddingTop: "100px",
            paddingBottom: "40px",
            overflowY: "auto",
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{ maxWidth: "550px", width: "100%" }}
          >
            <div
              className="modal-content border-0"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
              }}
            >
              <div className="position-relative">
                <div
                  className="p-4 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #f2994a 0%, #f27121 100%)",
                    //  background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div>
                      <h4
                        className="mb-1 fw-bold"
                        style={{ letterSpacing: "0.3px", fontSize: "1.4rem" }}
                      >
                        {appicantResdata.gender === "male" ? "Mr." : "Ms."}{" "}
                        {appicantResdata.fullname}
                      </h4>
                      <div className="d-flex align-items-center mt-1">
                        <i className="bi bi-check-circle-fill me-2 fs-6"></i>
                        <span style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                          Reschedule Appointment Booked
                        </span>
                      </div>
                    </div>
                    <div className="ms-auto bg-white bg-opacity-20 rounded-circle p-2">
                      <i className="bi bi-calendar-check fs-4"></i>
                    </div>
                  </div>
                </div>

                {/* Body - Compact Card Design */}
                <div className="p-3 p-lg-4" style={{ minHeight: "200px" }}>
                  <div className="row g-3">
                    {[
                      {
                        label: "Applicant Number",
                        value: appicantResdata.applicant_number,
                      },
                      {
                        label: "Date",
                        value: appicantResdata.date,
                      },
                      { label: "Time", value: appicantResdata.time },
                      { label: "Reference", value: appicantResdata.reference },
                    ].map((item, index) => (
                      <div className="col-md-6" key={index}>
                        <div
                          className="p-2 rounded"
                          style={{
                            background: "#f8faff",
                            border: "1px solid #e0e8ff",
                            boxShadow: "0 2px 8px rgba(75, 108, 183, 0.08)",
                          }}
                        >
                          <label
                            className="fw-semibold text-muted small mb-1"
                            style={{ color: "#5a6b8c", fontSize: "0.8rem" }}
                          >
                            {item.label}
                          </label>
                          <div
                            className="text-dark fw-bold mt-1"
                            style={{
                              fontSize: "1rem",
                              color: "#2d3a5a",
                            }}
                          >
                            {item.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confetti + Image - Medium Size */}
                <div
                  className="confetti-burst-container"
                  style={{ height: "220px", margin: "15px 0" }}
                >
                  {Array.from({ length: 80 }).map((_, i) => {
                    const angle = Math.random() * 2 * Math.PI;
                    const distance = 150 + Math.random() * 80;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance * 1.1;
                    const rotate = Math.random() * 720;
                    return (
                      <div
                        key={i}
                        className={`confetti-piece color-${i % 5}`}
                        style={{
                          ["--transform" as any]: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
                          width: `${8 + Math.random() * 6}px`,
                          height: `${8 + Math.random() * 6}px`,
                          borderRadius: Math.random() > 0.5 ? "2px" : "50%",
                        }}
                      />
                    );
                  })}

                  <div
                    className="d-flex flex-column align-items-center justify-content-center position-relative z-2"
                    style={{ height: "220px" }}
                  >
                    <div
                      className="position-absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <img
                        src={successImg}
                        alt="Success"
                        className="img-fluid"
                        style={{
                          width: "160px",
                          height: "160px",
                          objectFit: "contain",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                      <h4
                        className="fw-bold mt-3 text-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #4b6cb7 0%, #2ecc71 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontSize: "1.5rem",
                          whiteSpace: "nowrap", // prevent line break
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Appointment Rescheduled successfully!
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Footer - Compact Button */}
                <div
                  className="px-3 pb-3 pt-2"
                  style={{ background: "rgba(246, 248, 255, 0.8)" }}
                >
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn fw-bold flex-fill py-2"
                      style={{
                        // background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
                        background:
                          "linear-gradient(135deg, #f2994a 0%, #f27121 100%)",
                        color: "white",
                        fontSize: "1rem",
                        letterSpacing: "0.3px",
                        borderRadius: "10px",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-2px)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "none")
                      }
                      onClick={() => {
                        setsuccessModule(false);
                        navigate("/");
                      }}
                    >
                      <i className="bi bi-house-door me-2"></i>
                      Return to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
