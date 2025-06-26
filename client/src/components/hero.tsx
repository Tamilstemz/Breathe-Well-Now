import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarCheck, CalendarSearch, CheckCircle, RefreshCcw, X, Info} from "lucide-react";
import doctorImage from "@assets/newpic1_1749587017199.png";
import { useNavigate } from "react-router-dom";
import { environment } from "../../../environment/environment";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CryptoJS from "crypto-js";



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
  Newslot?: any; // Optional: Add any other fields you need from the object
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
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [searchType, setSearchType] = useState("referenceId");
  const [contactType, setContactType] = useState("mobile");

  const [searchValue, setSearchValue] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);

  const [otpButtontype, setotpButtontype] = useState('Reschedule')
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");


  const [errors, setErrors] = useState<{
    searchValue?: string;
    contactValue?: string;
  }>({});

  // const handleTrackBooking = () => {
  //   setOpenModal(false);
  // };





  useEffect(() => {
    const encrypted = localStorage.getItem("Newslot");

    if (encrypted) {
      try {
        const decrypted = CryptoJS.AES.decrypt(
          encrypted,
          environment.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);

        const parsedData = JSON.parse(decrypted);
        console.log('parsedData--------', parsedData);

        setAppointmentData(parsedData)
        setShowAppointmentModal(true)
        setotpButtontype('Reschedule')
        setOtpVisible(true);
        setOtp("998999");
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
    setShowAppointmentModal(false)
    setAppointmentData([])
    setOpenModal(true)
  }





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





  const handlecancelAppointmentDetails = () => {
    setotpButtontype('cancel')
    setOtpVisible(true);
    setOtp("998999");
    setOtpError("");
  }

  const handleConfirmReschedule = async (item: any) => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

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
      } else {
        setOtpError(result.message || "Cancellation failed. Try again.");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      setOtpError("Something went wrong. Please try again.");
    }
  };


  const handleCancelAppointment = async (item: any) => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

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

      console.log('111111---', result);

      if (result.status === 1) {
        toast({
          title: "Cancelled",
          description: "Your appointment has been cancelled successfully.",
          variant: "success",
          duration: 4000,
        });
        // Optionally close modal or refresh data here
        setShowAppointmentModal(false);
        setAppointmentData([])
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
      newErrors.searchValue = `${searchType === "passport" ? "Passport Number" : "Reference ID"} is required.`;
    } else if (searchType === "passport" && !/^[A-Z0-9]{6,12}$/.test(searchValue)) {
      newErrors.searchValue = "6-12 characters, uppercase letters/numbers only.";
    }

    // Validate Mobile or Email
    if (!contactValue.trim()) {
      newErrors.contactValue = `${contactType === "email" ? "Email ID" : "Mobile Number"} is required.`;
    } else if (
      contactType === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contactValue)
    ) {
      newErrors.contactValue = "Enter a valid email (e.g., name@example.com)";
    } else if (
      contactType === "mobile" &&
      !/^\d{10}$/.test(contactValue)
    ) {
      newErrors.contactValue = "Enter a valid 10-digit mobile number.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Stop if validation fails

    try {
      const getAppointment = 'yes'
      const formData = new FormData();
      formData.append('application', '1');
      formData.append('getAppointment', getAppointment);
      formData.append('searchType', searchType);
      formData.append('searchValue', searchValue);
      formData.append('contactType', contactType);
      formData.append('contactValue', contactValue);


      const response = await fetch(environment.APPOINMENT_REPORT_API, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log('vvvvvv----0000', data);
      if (data?.message === "success" && data?.detail?.legend !== 0) {
        setAppointmentData(data?.detail);
        handleClear()
        setOpenModal(false)
        setShowAppointmentModal(true);
      }
      else {
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
    <section id="home" className="hero-gradient py-16 lg:py-24 relative overflow-hidden">
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
              Welcome to ND Diagnostics India Private Limited, your trusted partner for comprehensive medical examinations required for Australia visa applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <Button
                onClick={() => {
                  navigate(`${environment.BASE_PATH}AppointmentBooking`);
                  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
                }}
                size="lg"
                className="card-gradient-blue text-white font-semibold text-lg transition-all duration-300 hover:scale-105 border-0"
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                Schedule Examination
              </Button>

              {/* <Button
                onClick={() => setOpenModal(true)}
                variant="outline"
                size="lg"
                className="border-2 border-brand-green text-brand-green hover:bg-orange-500 hover:text-white hover:border-transparent font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                <CalendarSearch className="mr-2 h-5 w-5" />
                Track Appointment
              </Button> */}

            <Button
            onClick={() => scrollToSection("about")}
            variant="outline"
            size="lg"
            className="border-2 border-brand-orange text-brand-orange hover:card-gradient-orange hover:text-white hover:border-transparent font-semibold text-lg transition-all duration-300 hover:scale-105"
          >
            <Info className="mr-2 h-5 w-5" />
            Learn More
          </Button>
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
              <label className="block mb-1 text-sm font-medium">Select ID Type</label>
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
              <label className="block mb-1 text-sm font-medium">{searchType === "hap" ? "HAP ID" : searchType === "passport" ? "Passport Number" : "Reference ID"}</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your ID"
                value={searchValue}
                onChange={(e) => setSearchValue(searchType === "passport" ? e.target.value.toUpperCase() : e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Mobile Number</label>
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



      {showAppointmentModal &&
        appointmentData.length > 0 && (
          <Dialog open={true} onOpenChange={() => setShowAppointmentModal(false)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>Your appointment information and options</DialogDescription>
              </DialogHeader>

              {appointmentData.map((item, index) => (
                <div key={index} className="space-y-4 mt-2 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Appointment Details</div>
                    <div className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> {bookingStatusMap[parseInt(item.booking_status)] || "Unknown"}
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

                  {item && item?.Newslot &&
                    <>
                      <div className="flex justify-between items-center">
                        <div className="font-semibold">Reschedule Appointment Details</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-500">Date</div>
                          <div className="font-medium">
                            {new Date(item?.Newslot?.slotItem?.slot?.date).toLocaleDateString("en-US", {
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
                  }

                  {!otpVisible ? (
                    parseInt(item.booking_status) === 1 ? (
                      <div className="flex justify-between gap-2 pt-4">
                        <Button variant="outline" className="w-full" onClick={() => handleRescheduleClick(item)}>
                          <RefreshCcw className="w-4 h-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button variant="destructive" className="w-full" onClick={handlecancelAppointmentDetails}>
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    ) : null
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Enter the OTP sent to your mobile number to {otpButtontype === 'Reschedule' ? "reschedule your booking:" : "Cancel your booking:"}
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
                        {otpError && <div className="text-red-600 text-xs mt-1">{otpError}</div>}
                      </div>

                      <div className="flex justify-between gap-2 pt-3">
                        <Button variant="outline" className="w-full" onClick={otpButtontype === 'Reschedule' ? () => {navigate(`${environment.BASE_PATH}AppointmentBooking`)} : () => setOtpVisible(false)}>
                          Back
                        </Button>
                        {otpButtontype === 'Reschedule' ? <Button
                          className="w-full bg-orange-500 text-white font-semibold"
                          disabled={!/^\d{6}$/.test(otp)}
                          onClick={() =>handleConfirmReschedule(item)}
                        >
                          Confirm Reschedule
                        </Button> :
                          <Button
                            className="w-full bg-orange-500 text-white font-semibold"
                            disabled={!/^\d{6}$/.test(otp)}
                            onClick={() => handleCancelAppointment(item)}
                          >
                            Cancel Appointment
                          </Button>}
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
          </Dialog>)}




    </section>
  );
}
