import React, { useState, useRef, useEffect } from "react";
import { environment } from "../../../environment/environment";
import httpClient from "../../../api/httpClient";
import { array, string } from "zod";
// import Calendar from "react-calendar"; // for basic calendar
import FullCalendar from "@fullcalendar/react"; // for full-featured calendar
import "./AppointmentBooking.css";
import dummyqr from "../../assests/dummyqr.jpg";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "material-react-toastify";
import { showToast } from "../components/ToastContainer/Toast";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
// } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import Nddiagnostics_QR_Code_1 from "../../assests/Nddiagnostics QR Code_1.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { isSlotExpired } from "../components/commonfunctions";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Service = {
  id: number;
  name: string;
  code: string;
  price: string; // from your API, price is a string
};
type Slot = {
  // define relevant fields based on your API
  id: number;
  slot: {
    date: string;
    remaining: number;
    [key: string]: any;
  };
  [key: string]: any;
};

type TimeSlot = {
  id: number;
  slot: {
    id: number;
    center: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
      city: {
        id: number;
        name: string;
      };
      state: number;
      timezone: string;
      code: string;
    };
    date: string;
    status: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    created_by: number;
    modified_by: number | null;
    application: number;
    depart_detail: {
      id: number;
      name: string;
      code: string;
    }[];
    slottime: {
      start_time: string;
      end_time: string;
      available: number;
      remaining: number;
    }[];
    available: number;
    remaining: number;
  };
  department: {
    id: number;
    name: string;
    code: string;
    description: string | null;
    status: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    application: number;
    created_by: number;
    modified_by: number | null;
  };
  start_time: string;
  end_time: string;
  available: number;
  remaining: number;
  status: number;
  department_name: string;
  department_details: {
    department__name: string;
    department__id: number;
  }[];
  department_status: number;

  // These two are not in the sample data, so optional
  time?: string;
  booked?: boolean;
};
type SimpleSlot = {
  time: string;
  available: boolean;
  booked: boolean;
};

type SlotsDataMap = {
  [date: string]: SimpleSlot[];
};

type UpcomingDateSlot = {
  date: Date;
  slots: any[]; // Replace `any[]` with a specific type if you know the slot structure
};

type CalendarEvent = {
  date: string; // Example: "2025-06-14"
  timeSlot: string; // Example: "12:00 PM to 01:00 PM"
};

type FormDataType = {
  patientName: string;
  hapId: string;
  email: string;
  contactNumber: string;
  alternativeNumber: string;
  gender: string;
  age: string;
  visaCategory: string;
  passportNo: string;
  paymentPreference: string;
  paymentMethod: string;
  dob: string;
  TransactionId: string;
  servicecode: string[]; // ← Explicitly typed as string[]
  totalPrice: number;
  PaymentType: string;
};

const AppointmentBooking = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  console.log(selectedDate);
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("month");
  const [center, setcenter] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog1, setShowDialog1] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("NDK");
  const [selectedService, setSelectedService] = useState("");
  const [appointmentType, setAppointmentType] = useState("Self");
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [upcomingDatesWithSlots, setUpcomingDatesWithSlots] = useState<
    UpcomingDateSlot[]
  >([]);
  const nextFourNonSundays: string[] = [];
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    "item-0"
  );
  const [helperText, setHelperText] = useState("");

  const [Slots1, setSlots1] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookingType, setbookingType] = useState("self");
  const [slotsData, setSlotsData] = useState<SlotsDataMap>({});
  const calendarSlotMap: { [key: string]: any[] } = {};
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  console.log(timeSlots);
  const [membercount, setmembercount] = useState(0);
  const [bookedEvents, setBookedEvents] = useState<CalendarEvent[]>([]);
  const [dotDates, setDotDates] = useState<Set<string>>(new Set());
  const [slotsGroupedByDate, setSlotsGroupedByDate] = useState<
    Record<string, any[]>
  >({});
  const [stepIndex, setStepIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [selectedslottime, setselectedslottime] = useState("");
  const [invoiceUrls, setinvoiceUrls] = useState<any[]>([]);

  const [existingapplicantdata, setexistingapplicantdata] = useState<any>({});
  const [opennewdialog, setopennewdialog] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [shake, setShake] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    patientName: "",
    hapId: "",
    email: "",
    contactNumber: "",
    alternativeNumber: "",
    gender: "",
    age: "",
    visaCategory: "",
    passportNo: "",
    paymentPreference: "",
    paymentMethod: "OR",
    dob: "",
    TransactionId: "",
    servicecode: [],
    totalPrice: 0,
    PaymentType: "",
  });
  const [members, setMembers] = useState<any[]>([
    {
      patientName: "",
      hapId: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      age: "",
      visaCategory: "",
      passportNo: "",
      paymentPreference: "",
      paymentMethod: "OR",
      dob: "",
      TransactionId: "",
      servicecode: [],
      totalPrice: 0,
      slot_booking: [],
      PaymentType: "",
    },
  ]);

    console.log('formData[11111]',formData);




  const [memberValidated, setMemberValidated] = useState<boolean[]>(() =>
    Array(members.length).fill(false)
  );

  const [memberHasError, setMemberHasError] = useState<boolean[]>(() =>
    Array(members.length).fill(false)
  );
  console.log(formData);

  useEffect(() => {
    if (selectedCenter) {
      handleCenterChange({ target: { value: selectedCenter } });
    }
  }, []);

  useEffect(() => {
    if (showDialog) {
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "auto"; // Restore scroll
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDialog]);


  useEffect(() => {
  if (serviceList && serviceList.length === 1) {
    
    const oneCodes = serviceList[0];

    console.log('serviceList[0]',oneCodes);


    setFormData((prev) => ({
      ...prev,
      servicecode: [oneCodes?.code], // <-- fix here
      totalPrice: parseInt(oneCodes?.price),
    }));

  }
}, [serviceList]);

  const getMonthName = () => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  // const isCurrentMonth = (date: any) => {
  //   return date.getMonth() === currentDate.getMonth();
  // };

  // const today = new Date();
  const isCurrentMonth = (viewDate: Date) => {
    const current = new Date();
    const view = new Date(viewDate); // Convert string to Date

    return (
      view.getMonth() === current.getMonth() &&
      view.getFullYear() === current.getFullYear()
    );
  };

  const isToday = (date: any) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isServiceSelected = (code: any) => selectedServices.includes(code);
  const formatDateToYYYYMMDD = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const hasEvent = (day: Date) => {
    const dateStr = formatDateToYYYYMMDD(day);
    return dotDates.has(dateStr);
  };

  const totalcount = (day: Date) => {
    const dateStr = formatDateToYYYYMMDD(day);
    // console.log("Date:", dateStr);
    // console.log('timeSlots-----',timeSlots);

    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0]; // e.g., "2025-06-19"
    // console.log("Today:", formattedToday);

    if (dateStr >= formattedToday) {
      const matchedSlots = timeSlots.filter((i) => i.slot?.date === dateStr);

      let checktimeing = true;

      matchedSlots.forEach((ele, ind) => {
        // console.log('fffff1111', ele.slot.date);

        ele.slot.slottime.forEach((time: any) => {
          const timeRange = `${formatTo12Hour(
            time.start_time
          )} to ${formatTo12Hour(time.end_time)}`;
          // console.log('fffff2222', timeRange);

          // Check expiration for each time slot
          const isExpired = isSlotExpired(timeRange, ele.slot.date);

          if (isExpired) {
            // console.log('meeee---',timeRange, ele.slot.date);

            checktimeing = false;
          }
        });
      });

      // console.log("Matched Slots:", matchedSlots);

      const seenSlots = new Set<string>();
      let totalRemaining = 0;

      matchedSlots.forEach((item) => {
        const slottimes = item.slot?.slottime || [];

        slottimes.forEach((slot: any) => {
          const key = `${slot.start_time}-${slot.end_time}`;
          if (!seenSlots.has(key)) {
            seenSlots.add(key);
            totalRemaining += slot.remaining || 0;
          }
        });
      });

      // console.log("Total Remaining (No Duplicates):", totalRemaining);
      return !checktimeing ? 0 : totalRemaining;
    }
  };

  const isTimeSlotBooked = (date: Date, timeSlot: string): boolean => {
    const dateStr = formatDateToYYYYMMDD(date);

    return bookedEvents.some(
      (event) => event.date === dateStr && event.timeSlot === timeSlot
    );
  };

  const selectDate = (date: any) => {
    setSelectedDate(date);
    setSlots1([]);

    setUpcomingDatesWithSlots([]);

    for (let i = 0; i < 4; i++) {
      const day = new Date(date);
      day.setDate(date.getDate() + i);

      const dateStr = formatDateToYYYYMMDD(day);
      const slots = slotsData[dateStr] || [];

      const enrichedSlots = slots.map((slot) => ({
        ...slot,
        booked: isTimeSlotBooked(day, slot.time),
        date: day,
      }));

      upcomingDatesWithSlots.push({
        date: new Date(day),
        slots: enrichedSlots,
      });
    }
  };

  const goToPrevious = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNext = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const bookTimeSlot = (slot: any) => {
    setStepIndex(0);
    if (selectedServices.length === 0) {
      toast({
        title: "Warning",
        description: "Select Service.",
        variant: "warn",
        duration: 4000,
      });
      return;
    }

    if (appointmentType === "Group") {
      if (!membercount) {
        toast({
          title: "Warning",
          description: "Please enter Member's Count.",
          variant: "warn",
          duration: 4000,
        });
        return;
      }

      // ✅ Create N member objects if not already created
      if (members.length !== membercount) {
        const emptyMembers = Array.from({ length: membercount }, (_, i) => ({
          patientName: "",
          email: "",
          contactNumber: "",
          alternativeNumber: "",
          age: "",
          dob: "",
          passportNo: "",
          gender: "",
          slot_booking: [],
        }));
        setMembers(emptyMembers);
      }
    }

    if (!slot.available) return;
    const slotDateStr = slot.slotItem.slot.date; // "YYYY-MM-DD"
    const slotDateObj = new Date(slotDateStr);
    setSelectedDate(slotDateObj); // ✅ Update selected date on slot click

    const slotData = {
      action_date: formatDateToDDMMYYYY(selectedDate),
      booked_time: slot.time,
      booking_from: 3,
      booking_status: 1,
      date_booked: formatDateToYYYYMMDDNew(new Date()),
      department: "AU",
      description: "Test Service",
      service_code: formData.servicecode,
    };

    setselectedslottime(slot.time);
    setSelectedSlot(slot.slotItem);
    setShowDialog(true);

    // Update only if it's a group appointment
    if (appointmentType === "Group") {
      const updatedMembers = members.map((member) => ({
        ...member,
        slot_booking: [...member.slot_booking, slotData],
      }));
      setMembers(updatedMembers);
    }
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedSlot(null);
  };

  const scheduleAppointment = () => {
    console.log("Scheduling appointment:", {
      ...formData,
      slot: selectedSlot,
      date: selectedDate,
    });
    closeDialog();
  };

  const convertTo12HourFormat = (time24: string): string => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12; // Converts 0 -> 12 for midnight
    const hourFormatted = hour.toString().padStart(2, "0");

    return `${hourFormatted}:${minute} ${ampm}`;
  };

  const handleMemberNext = (index: number) => {
    const errors: { [key: string]: string } = {};
    let hasError = false;

    const commonErrors = validateCommonFields(members[index], index, errors);
    const primaryErrors =
      index === 0
        ? validatePrimaryFields(members[index], index, errors)
        : false;

    hasError = commonErrors || primaryErrors;

    const updatedErrorState = [...memberHasError];
    updatedErrorState[index] = hasError;
    setMemberHasError(updatedErrorState);
    setFormErrors((prev) => ({ ...prev, ...errors }));

    if (!hasError) {
      // Move to next accordion item
      if (index < members.length - 1) {
        setOpenAccordion(`item-${index + 1}`);
      } else {
        setOpenAccordion(undefined); // close all if it's last
      }
    }
  };

  const parseTimeSlotsFromData = (data: any[]) => {
    console.log("Slot data:", data);

    const parsedSlots: {
      [key: string]: { time: string; available: boolean; booked: boolean }[];
    } = {};

    data.forEach((entry) => {
      const dateStr = entry.slot.date;
      const slotInfos = entry.slot.slottime;

      if (!parsedSlots[dateStr]) {
        parsedSlots[dateStr] = [];
      }

      const existingTimes = new Set(
        parsedSlots[dateStr].map((slot) => slot.time)
      );

      slotInfos.forEach((timeSlot: any) => {
        const startTime12 = convertTo12HourFormat(
          timeSlot.start_time.slice(0, 5)
        );
        const endTime12 = convertTo12HourFormat(timeSlot.end_time.slice(0, 5));
        const formattedTime = `${startTime12} to ${endTime12}`;

        if (!existingTimes.has(formattedTime)) {
          parsedSlots[dateStr].push({
            time: formattedTime,
            available: timeSlot.available > 0,
            booked: false,
          });
          existingTimes.add(formattedTime);
        }
      });
    });

    // ✅ Update state
    setSlotsData(parsedSlots);
  };

  const processSlots = (data: any) => {
    data.forEach((entry: any) => {
      const date = entry.slot.date;
      if (!calendarSlotMap[date]) {
        calendarSlotMap[date] = [];
      }
      calendarSlotMap[date].push(entry);
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await httpClient.get(environment.AVAILABLE_CENTER_API);
        console.log(res.data.data);

        setcenter(res.data.data || []);
      } catch (err) {
        console.error("Error loading slots", err);
      }
    })();
  }, []);

  const handleCenterChange = async (event: any) => {
    const selectedCode = event.target.value;
    setSelectedCenter(selectedCode);
    setUpcomingDatesWithSlots([]);
    setFormData({
      patientName: "",
      hapId: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      age: "",
      visaCategory: "",
      passportNo: "",
      paymentPreference: "",
      paymentMethod: "QR",
      dob: "",
      TransactionId: "",
      servicecode: [environment.DEFAULT_SERVICE_CODE],
      totalPrice: 0,
      PaymentType: "",
    });
    setMembers([
      {
        patientName: "",
        hapId: "",
        email: "",
        contactNumber: "",
        alternativeNumber: "",
        gender: "",
        age: "",
        visaCategory: "",
        passportNo: "",
        paymentPreference: "",
        paymentMethod: "",
        dob: "",
        TransactionId: "",
        servicecode: [environment.DEFAULT_SERVICE_CODE],
        totalPrice: 0,
        slot_booking: [],
      },
    ]);
    setSelectedServices([]);
    setUpcomingDatesWithSlots([]);
    setSelectedDate(null);
    setselectedslottime("");
    setServiceList([]);

    const selectedCenter = center.find(
      (center: any) => center.code === selectedCode
    );

    try {
      const serviceApiUrl = `${environment.AVAILABLE_SERVIVCE_API}&center=${selectedCode}`;
      const res = await httpClient.get(serviceApiUrl);
      setServiceList(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    }

    try {
      const formData = new FormData();
      formData.append("application", "1");
      formData.append("center", selectedCode);

      const res = await httpClient.post(
        environment.AVAILABLE_SLOTS_API,
        formData
      );
      const Timeslot = res.data.data || [];

      // ✅ Update state
      setTimeSlots(Timeslot);

      // ✅ Green Dot Dates
      const slotDates = Timeslot.map((item: any) =>
        formatDateToYYYYMMDD(new Date(item.slot.date))
      );
      setDotDates(new Set(slotDates));

      // ✅ Initialize slot view directly (fix mismatch)
      const today = new Date();
      setSelectedDate(today);
      handleDateClick(today, Timeslot); // ✅ use fresh Timeslot
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (code: any) => selectedServices.includes(code);

  const isSelecteddate = (date: Date) =>
    selectedDate && date.toDateString() === selectedDate.toDateString();

  const isAllSelected = () => selectedServices.length === serviceList.length;

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCodes = serviceList.map((s) => s.code);
      const totalPrice = serviceList.reduce(
        (sum, s) => sum + parseFloat(s.price),
        0
      );

      setFormData((prev) => ({
        ...prev,
        servicecode: allCodes,
        totalPrice: totalPrice,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        servicecode: [environment.DEFAULT_SERVICE_CODE],
        totalPrice: 0,
      }));
    }
  };

  console.log(selectedServices);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    code: string,
    price: any
  ) => {
    let updatedSelected: string[];

    if (e.target.checked) {
      updatedSelected = Array.from(new Set([...selectedServices, code]));
    } else {
      updatedSelected = selectedServices.filter((c) => c !== code);
    }
    console.log(updatedSelected);

    setSelectedServices(updatedSelected);
    console.log(appointmentType);

    // Update all members if appointment type is Group
    if (appointmentType === "Group") {
      const updatedMembers = members.map((member) => ({
        ...member,
        servicecode: updatedSelected,
        totalPrice: updatedSelected.length * price, // each service has the same price
      }));
      setMembers(updatedMembers);
    } else {
      updateFormDataWithServices(updatedSelected);
    }
    console.log(members);
  };

  const updateFormDataWithServices = (selectedCodes: string[]) => {
    const uniqueCodes = Array.from(new Set(selectedCodes));

    const total = serviceList
      .filter((s) => uniqueCodes.includes(s.code))
      .reduce((sum, s) => sum + parseFloat(s.price), 0);

    setFormData((prev) => ({
      ...prev,
      servicecode: uniqueCodes,
      totalPrice: total,
    }));
  };

  const getSelectedServiceNames = () => {
    return serviceList
      .filter((s: any) => selectedServices.includes(s.code))
      .map((s) => s.name)
      .join(", ");
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    return date < today;
  };

  const formatTo12Hour = (time24: string): string => {
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  const handleDateClick = (day: Date, rawSlots: any[]) => {
    if (day && isPastDate(day)) return;
    console.log("ttttt----", day);

    setSelectedDate(day);

    console.log("Selected day:", day);

    const selectedDates: string[] = [];
    const selectedDateStringsSet = new Set<string>();

    let currentDate = new Date(day.getTime());
    let count = 0;

    // ✅ Skip Sundays and get next 4 valid days
    while (count < 4) {
      if (currentDate.getDay() !== 0) {
        // Skip Sunday
        const dateStr = formatDateToYYYYMMDD(currentDate);
        selectedDates.push(dateStr);
        selectedDateStringsSet.add(dateStr);

        console.log("Valid Date:", currentDate);
        count++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("Selected Dates Set:", selectedDateStringsSet);

    // Initialize grouped data
    const grouped: Record<string, any[]> = {};
    selectedDates.forEach((date) => {
      grouped[date] = [];
    });

    // Filter relevant slot data
    const filteredSlotData = rawSlots.filter((slotItem: any) =>
      selectedDateStringsSet.has(slotItem.slot.date)
    );

    console.log("Filtered Slot Data:", filteredSlotData);

    // Group and sort slots
    for (const slotItem of filteredSlotData) {
      const slotDate = slotItem.slot.date;

      const sortedTimes = [...slotItem.slot.slottime].sort((a, b) => {
        const toMinutes = (t: string) => {
          const [hours, minutes] = t.split(":").map(Number);
          return hours * 60 + minutes;
        };
        return toMinutes(a.start_time) - toMinutes(b.start_time);
      });

      for (const time of sortedTimes) {
        grouped[slotDate].push({
          time: `${formatTo12Hour(time.start_time)} to ${formatTo12Hour(
            time.end_time
          )}`,
          available: time.available,
          remaining: time.remaining,
          slotItem,
        });
      }
    }

    // Set grouped slots to state
    setSlotsGroupedByDate(grouped);
  };

  // Format date to yyyy-mm-dd
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // Calculate age from dob
  const calculateAge = (dob: string): string => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Calculate dob from age (returns yyyy-01-01)
  const calculateDOB = (age: string): string => {
    const numericAge = parseInt(age, 10);
    if (numericAge >= 10) {
      const birthYear = new Date().getFullYear() - numericAge;
      return `${birthYear}-01-01`;
    }
    return "";
  };

  const today = new Date().toISOString().split("T")[0];

  const downloadPDFsSilently = async (urls: string[]) => {
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: "GET",
          redirect: "follow",
        });

        if (!response.ok) {
          console.error(`Failed to fetch: ${url}`);
          continue;
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `invoice-${url.split("/").pop()}.pdf`; // e.g., invoice-4068.pdf
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
        await new Promise((r) => setTimeout(r, 500)); // slight delay to ensure one-by-one download
      } catch (error) {
        console.error("Error downloading PDF:", error);
      }
    }
  };

  const getFileNameFromUrl = (url: string) => {
    const id = url.split("/").pop();
    return `invoice-${id}.pdf`;
  };

  const getYesterdayDate = (): string => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Move back one day
    return today.toISOString().split("T")[0];
  };

  const validateCommonFields = (member: any, index: number, errors: any) => {
    const { patientName, age, dob, passportNo, gender } = member;
    let hasError = false;

    if (!patientName.trim()) {
      errors[`patientName_${index}`] = "Applicant Name is required.";
      hasError = true;
    }

    if (!dob) {
      errors[`dob_${index}`] = "Date of Birth is required.";
      hasError = true;
    }

    if (!age.trim()) {
      errors[`age_${index}`] = "Age is required.";
      hasError = true;
    }

    if (!passportNo.trim()) {
      errors[`passportNo_${index}`] = "Passport Number is required.";
      hasError = true;
    } else if (!/^[A-Z0-9]{6,9}$/.test(passportNo)) {
      errors[`passportNo_${index}`] =
        "6-9 characters, uppercase letters/numbers only.";
      hasError = true;
    }

    if (!gender.trim()) {
      errors[`gender_${index}`] = "Gender is required.";
      hasError = true;
    }

    return hasError;
  };

  const validatePrimaryFields = (member: any, index: number, errors: any) => {
    const { email, contactNumber, alternativeNumber, hapId, paymentMethod } =
      member;
    let hasError = false;

    if (!contactNumber.trim()) {
      errors[`contactNumber_${index}`] = "Contact Number is required.";
      hasError = true;
    } else if (!/^\d{10}$/.test(contactNumber)) {
      errors[`contactNumber_${index}`] = "Must be exactly 10 digits.";
      hasError = true;
    }

    if (!email.trim()) {
      errors[`email_${index}`] = "Email is required.";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.(com|net|org|io|in)$/.test(email)) {
      errors[`email_${index}`] = "Enter a valid email (e.g., name@example.com)";
      hasError = true;
    }

    if (alternativeNumber && !/^\d{10}$/.test(alternativeNumber)) {
      errors[`alternativeNumber_${index}`] = "Must be exactly 10 digits.";
      hasError = true;
    }

    if (!hapId.trim()) {
      errors[`hapId_${index}`] = "HAP ID is required.";
      hasError = true;
    } else if (!/^\d{8}$/.test(hapId)) {
      errors[`hapId_${index}`] = "Must be exactly 8 digits.";
      hasError = true;
    }

    if (!paymentMethod) {
      errors[`paymentMethod_${index}`] = "Payment Method is required.";
      hasError = true;
    }

    return hasError;
  };

  const validateSelf = (data: any, errors: any) => {
    let hasError = false;

    const {
      patientName,
      email,
      contactNumber,
      alternativeNumber,
      age,
      dob,
      passportNo,
      gender,
      hapId,
    } = data;

    if (!patientName.trim()) errors.patientName = "Applicant Name is required.";

    if (!contactNumber.trim()) {
      errors.contactNumber = "Contact Number is required.";
    } else if (!/^\d{10}$/.test(contactNumber)) {
      errors.contactNumber = "Must be exactly 10 digits.";
    }

    if (hapId && !/^\d{8}$/.test(hapId)) {
      errors.hapId = "Must be exactly 8 digits.";
    }

    if (!dob) errors.dob = "Date of Birth is required.";

    if (!age.trim()) {
      errors.age = "Age is required.";
    } else if (!/^\d+$/.test(age)) {
      errors.age = "Age must be a number.";
    } else {
      const numericAge = parseInt(age, 10);
      if (numericAge < 10 || numericAge > 99) {
        errors.age = "Age must be between 10 and 99.";
      }
    }

    if (!passportNo.trim()) {
      errors.passportNo = "Passport Number is required.";
    } else if (!/^[A-Z0-9]{6,12}$/.test(passportNo)) {
      errors.passportNo = "6-12 characters, uppercase letters/numbers only.";
    }

    if (alternativeNumber && !/^\d{10}$/.test(alternativeNumber)) {
      errors.alternativeNumber = "Must be exactly 10 digits.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errors.email = "Enter a valid email (e.g., name@example.com)";
    }

    if (!gender.trim()) errors.gender = "Gender is required.";

    hasError = Object.keys(errors).length > 0;
    return hasError;
  };

  const nextStep = () => {
    const errors: { [key: string]: string } = {};

    if (appointmentType === "Group") {
      const errors: { [key: string]: string } = {};
      let hasError = false;

      members.forEach((member, index) => {
        const {
          patientName,
          email,
          contactNumber,
          alternativeNumber,
          age,
          dob,
          passportNo,
          gender,
          paymentMethod
        } = member;

        if (!patientName.trim()) {
          errors[`patientName_${index}`] = "Applicant Name is required.";
          hasError = true;
        }

        if (!dob) {
          errors[`dob_${index}`] = "Date of Birth is required.";
          hasError = true;
        }

        if (!age.trim()) {
          errors[`age_${index}`] = "Age is required.";
          hasError = true;
        }

        if (!paymentMethod.trim()) {
          errors[`paymentMethod_${index}`] = "paymentMethod is required.";
          hasError = true;
        }

        if (!passportNo.trim()) {
          errors[`passportNo_${index}`] = "Passport Number is required.";
          hasError = true;
        } else if (!/^[A-Z0-9]{6,9}$/.test(passportNo)) {
          errors[`passportNo_${index}`] =
            "6-9 characters, uppercase letters/numbers only.";
          hasError = true;
        }

        if (index === 0) {
          if (!contactNumber.trim()) {
            errors[`contactNumber_${index}`] = "Contact Number is required.";
            hasError = true;
          } else if (!/^\d{10}$/.test(contactNumber)) {
            errors[`contactNumber_${index}`] = "Must be exactly 10 digits.";
            hasError = true;
          }
        }

        if (!gender.trim()) {
          errors[`gender_${index}`] = "Gender is required.";
          hasError = true;
        }
      });

      // ✅ Determine which member has errors
      const memberHasErrorArray: boolean[] = [];

      members.forEach((_, index) => {
        const hasErrorForMember = Object.keys(errors).some((key) =>
          key.endsWith(`_${index}`)
        );
        memberHasErrorArray[index] = hasErrorForMember;
      });

      setFormErrors(errors);
      setMemberHasError(memberHasErrorArray); // <--- This is critical

      if (!hasError && stepIndex < 1) {
        setStepIndex(stepIndex + 1);
      }
    } else if (appointmentType === "Self") {
      const {
        patientName,
        email,
        contactNumber,
        alternativeNumber,
        age,
        dob,
        passportNo,
        gender,
        hapId,
        paymentMethod

      } = formData;

      if (!paymentMethod.trim())
        errors.paymentMethod = "paymentMethod is required.";

      if (!patientName.trim())
        errors.patientName = "Applicant Name is required.";
      if (!contactNumber.trim())
        errors.contactNumber = "Contact Number is required.";
      else if (!/^\d{10}$/.test(contactNumber))
        errors.contactNumber = "Must be exactly 10 digits.";

      if (hapId && !/^\d{8}$/.test(hapId)) {
        errors.hapId = "Must be exactly 8 digits.";
      }

      if (!dob) errors.dob = "Date of Birth is required.";

      if (!age.trim()) errors.age = "Age is required.";

      if (!age.trim()) {
        errors.age = "Age is required.";
      } else if (!/^\d+$/.test(age)) {
        errors.age = "Age must be a number.";
      } else {
        const numericAge = parseInt(age, 10);
        if (numericAge < 10 || numericAge > 99) {
          errors.age = "Age must be between 10 and above and 99.";
        }
      }

      if (!passportNo.trim())
        errors.passportNo = "Passport Number is required.";
      else if (!/^[A-Z0-9]{6,12}$/.test(passportNo))
        errors.passportNo = "6-9 characters, uppercase letters/numbers only.";

      if (alternativeNumber && !/^\d{10}$/.test(alternativeNumber))
        errors.alternativeNumber = "Must be exactly 10 digits.";

      if (!email.trim()) errors.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
        errors.email = "Enter a valid email (e.g., name@example.com)";

      if (!gender.trim()) errors.gender = "Gender is required.";

      setFormErrors(errors);

      if (Object.keys(errors).length === 0 && stepIndex < 1) {
        setStepIndex(stepIndex + 1);
      }
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };
  const formatDateToDDMMYYYY = (date: string | Date | null): string => {
    if (!date) return "No date selected";

    const d = typeof date === "string" ? new Date(date) : date;

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatDateToYYYYMMDDNew = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const appointmentTypechnage = (e: any, type: string) => {
    setAppointmentType(type);
    setmembercount(0);
  };

  const getToday = () => {
    return new Date();
  };

  const getMinDOB = () => {
    const today = getToday();
    today.setFullYear(today.getFullYear() - 99); // Max age 99
    return today.toISOString().split("T")[0];
  };

  const getMaxDOB = () => {
    const today = getToday();
    today.setFullYear(today.getFullYear() - 10); // Min age 11
    return today.toISOString().split("T")[0];
  };

  const triggerShake = () => {
    setShake(true);
    setErrorMessage("Count must be between 2 and 5");

    setTimeout(() => {
      setShake(false);
      setErrorMessage(""); // clear message
    }, 1000); // display error for 2 seconds
  };

  const handleMemberCountChange = (e: any) => {
    const rawValue = e.target.value;

    // Reject decimals, zero, empty, or more than 2 digits
    if (
      rawValue.includes(".") ||
      rawValue === "0" ||
      rawValue === "" ||
      rawValue.length > 2
    ) {
      triggerShake();
      setmembercount(0);
      return;
    }

    const value = parseInt(rawValue, 10);

    if (!isNaN(value) && value >= 2 && value <= 5) {
      setmembercount(value);

      const servicedetail = members[0]?.servicecode;

      const updatedMembers = Array.from({ length: value }, () => ({
        patientName: "",
        hapId: "",
        email: "",
        contactNumber: "",
        alternativeNumber: "",
        gender: "",
        age: "",
        visaCategory: "",
        passportNo: "",
        paymentPreference: "",
        paymentMethod: "QR",
        dob: "",
        TransactionId: "",
        servicecode: servicedetail,
        totalPrice: 0,
        slot_booking: [],
      }));

      setMembers(updatedMembers);
    } else {
      triggerShake();
      setmembercount(0);
    }
  };

  const clear = () => {
    if (stepIndex === 0) {
      setFormData((prev) => ({
        ...prev,
        patientName: "",
        hapId: "",
        email: "",
        contactNumber: "",
        alternativeNumber: "",
        gender: "",
        age: "",
        visaCategory: "",
        passportNo: "",
        paymentPreference: "",
        paymentMethod: "QR",
        dob: "",
        // Keep servicecode and totalPrice
      }));

      setMembers((prevMembers) =>
        prevMembers.map((member) => ({
          ...member,
          patientName: "",
          hapId: "",
          email: "",
          contactNumber: "",
          alternativeNumber: "",
          gender: "",
          age: "",
          visaCategory: "",
          passportNo: "",
          paymentPreference: "",
          paymentMethod: "",
          dob: "",
        }))
      );
    } else if (stepIndex === 1) {
      setFormData((prev) => ({
        ...prev,
        TransactionId: "",
        // Keep servicecode and totalPrice
      }));

      setMembers((prevMembers) =>
        prevMembers.map((member) => ({
          ...member,
          TransactionId: "",
          // Keep servicecode, slot_booking, totalPrice
        }))
      );
    }
    setFormErrors({});

    setMemberHasError(Array(members.length).fill(false));

    // Clear only personal details in members (assumes 1 member initially)
  };

  const onSubmit = async () => {
    try {
      if (!selectedDate || !selectedSlot) {
        // toast.error("Please select a date and slot before submitting.");
        return;
      }

      if (!formData.TransactionId) {
        const errors: { [key: string]: string } = {};
        const { TransactionId } = formData;

        if (!TransactionId.trim())
          errors.TransactionId = "Applicant Name is required.";
        setFormErrors(errors);
        return;
      }

      let finalData;

      if (appointmentType === "Group") {
        finalData = members.map((member, index) => ({
          type: "I",
          applicant_number: "", // Can be filled if you have logic
          fullname: member.patientName,
          email: member.email,
          contact_number: member.contactNumber,
          alt_number: member.alternativeNumber,
          hap_id: member.hapId,
          relationship: index === 0 ? "Self" : "Family",
          reference_applicant_number: "",
          passport_number: member.passportNo,
          dob: formatDateToDDMMYYYY(member.dob),
          gender: member.gender,
          address: "123 Street, City",
          transaction_id: "3928564386583",
          payment_method: member.paymentMethod,
          transaction_amt: member.totalPrice,
          status: 1,
          created_by: 1,
          slot_booking: member.slot_booking.map((slot: any) => ({
            ...slot,
            servicecode: selectedService,
            action_date: formatDateToYYYYMMDDNew(new Date()),
            date_booked: formatDateToYYYYMMDDNew(selectedDate),
          })),
        }));
      } else {
        finalData = [
          {
            type: "I",
            applicant_number: "",
            fullname: formData.patientName,
            email: formData.email,
            contact_number: formData.contactNumber,
            alt_number: formData.alternativeNumber,
            hap_id: formData.hapId,
            relationship: "Self",
            reference_applicant_number: "",
            passport_number: formData.passportNo,
            dob: formatDateToDDMMYYYY(formData.dob),
            gender: formData.gender,
            address: "123 Street, City",
            transaction_id: formData.TransactionId,
            payment_method: formData.paymentMethod,
            transaction_amt: formData.totalPrice,
            status: 1,
            created_by: 1,
            slot_booking: [
              {
                action_date: formatDateToYYYYMMDDNew(new Date()),
                date_booked: formatDateToYYYYMMDDNew(selectedDate),

                booked_time: selectedslottime,
                booking_from: 3,
                booking_status: 1,

                department: "AU",
                description: "Test Service",
                service_code: formData.servicecode,
              },
            ],
          },
        ];
      }

      console.log(finalData);

      const res = await httpClient.post(
        environment.APPLICANT_WITH_APPT_API,
        finalData
      );

      const responseData = res.data.data;
      if (res.data.status === "success") {
        const invoiceUrls1: any[] = [];
        const allSuccessful = responseData.every((applicant: any) => {
          const appointments = applicant?.appointments;
          const booking = appointments?.bookings?.[0];

          if (
            appointments?.status === "success" &&
            appointments.errors?.length === 0 &&
            booking?.appointment_id
          ) {
            const appointmentId = booking.appointment_id;
            invoiceUrls1.push(
              `https://ndhealthcheck.com/appointment-service/transaction/invoice/pdf/${appointmentId}`
            );
            return true;
          }

          return false;
        });
        setinvoiceUrls(invoiceUrls1);
        downloadPDFsSilently(invoiceUrls1);
        if (allSuccessful) {
          const firstBooking = responseData[0]?.appointments?.bookings?.[0];
          const applicantNumber = responseData[0]?.applicant_number;
          const bookedDate = firstBooking?.date;
          const bookedTime = firstBooking?.time;

          const message = `Applicant ${applicantNumber} booked on ${bookedDate} at ${bookedTime}`;
          console.log(message);
          // showToast("success", message);
          toast({
            title: "success",
            description: message,
            variant: "success",
            duration: 4000,
          });
          setShowDialog(false);
          setStepIndex(0);

          setFormData({
            patientName: "",
            hapId: "",
            email: "",
            contactNumber: "",
            alternativeNumber: "",
            gender: "",
            age: "",
            visaCategory: "",
            passportNo: "",
            paymentPreference: "",
            paymentMethod: "QR",
            dob: "",
            TransactionId: "",
            servicecode: [environment.DEFAULT_SERVICE_CODE],
            totalPrice: 0,
            PaymentType: "",
          });
          setMembers([
            {
              patientName: "",
              hapId: "",
              email: "",
              contactNumber: "",
              alternativeNumber: "",
              gender: "",
              age: "",
              visaCategory: "",
              passportNo: "",
              paymentPreference: "",
              paymentMethod: "",
              dob: "",
              TransactionId: "",
              servicecode: [environment.DEFAULT_SERVICE_CODE],
              totalPrice: 0,
              slot_booking: [],
            },
          ]);
          setSelectedService("");
          setUpcomingDatesWithSlots([]);
          setSelectedDate(null);
          setselectedslottime("");
        } else {
          toast({
            title: "error",
            description: "Some applicant bookings failed",
            variant: "error",
            duration: 4000,
          });
        }
      } else {
        setShowDialog(false);
        setopennewdialog(true);
        setexistingapplicantdata(res.data.applicant_data);
      }

      // ✅ You can now use invoiceUrls wherever needed

      setShowDialog1(true);
    } catch (error) {
      console.error("Submission Error:", error);
      // toast.error("An error occurred while submitting the form.");
    }
  };

  const cancel = () => {
    setFormErrors({});
    setShowDialog(false);
    setMemberHasError([]);
    // Reset self form
    setFormData({
      patientName: "",
      hapId: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      age: "",
      visaCategory: "",
      passportNo: "",
      paymentPreference: "",
      paymentMethod: "QR",
      dob: "",
      TransactionId: "",
      servicecode: [environment.DEFAULT_SERVICE_CODE],
      totalPrice: 0,
      PaymentType: "",
    });

    // Dynamically generate membercount empty members
    const count = membercount || 1; // fallback to 1 if count not set
    const emptyMember = {
      patientName: "",
      hapId: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      age: "",
      visaCategory: "",
      passportNo: "",
      paymentPreference: "",
      paymentMethod: "QR",
      dob: "",
      TransactionId: "",
      servicecode: [environment.DEFAULT_SERVICE_CODE],
      totalPrice: 0,
      slot_booking: [],
    };

    const emptyMembersArray = Array.from({ length: count }, () => ({
      ...emptyMember,
    }));
    setMembers(emptyMembersArray);

    setStepIndex(0);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];

    if (!file) {
      setHelperText("");
      return;
    }
    console.log(file.type);

    const allowedTypes = [
      "image/png",
      "application/pdf",
      "image/jpeg",
      "image/jpg",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setHelperText("Only PNG and PDF files are allowed.");
      e.target.value = null;
    } else if (file.size > maxSize) {
      setHelperText("File size must be less than or equal to 5 MB.");
      e.target.value = null;
    } else {
      setHelperText("File is valid.");
    }
  };

  useEffect(() => {
    if (serviceList.length > 0 && selectedCenter) {
      // Check if APPT exists in the service list
      const exists = serviceList.some(
        (s) => s.code === environment?.DEFAULT_SERVICE_CODE
      );

      if (exists) {
        setSelectedServices([environment?.DEFAULT_SERVICE_CODE]);

        if (appointmentType === "Group") {
          const price = parseFloat(
            serviceList.find(
              (s) => s.code === environment?.DEFAULT_SERVICE_CODE
            )?.price || "0"
          );
          const updatedMembers = members.map((member) => ({
            ...member,
            servicecode: [environment?.DEFAULT_SERVICE_CODE],
            totalPrice: price,
          }));
          setMembers(updatedMembers);
        } else {
          updateFormDataWithServices([environment?.DEFAULT_SERVICE_CODE]);
        }
      }
    }
  }, [serviceList, selectedCenter]);

  const getDynamicPlaceholder = (field: string): string => {
    switch (field) {
      case "passportNo":
        return formErrors.passportNo
          ? "Format: A123456 or AB1234567"
          : "e.g. A123456";
      case "email":
        return formErrors.email
          ? "Format: name@example.com"
          : "e.g. john@example.com";
      case "contactNumber":
        return formErrors.contactNumber
          ? "10-digit mobile number"
          : "e.g. 9876543210";

      case "alternativeNumber":
        return formErrors.alternativeNumber
          ? "10-digit Alternate number"
          : "e.g. 9876543210";
      case "age":
        return formErrors.age
          ? "Age Must Be 10 and above"
          : "Age Must Be 10 and above";
      case "patientName":
        return formErrors.age && "Enter Name";
      case "hapId":
        return formErrors.hapId ? "8- digit" : "e.g. 98765432";
      default:
        return "";
    }
  };

  const getNextFourNonSundayDates = (startDate: Date): Date[] => {
    const resultDates: Date[] = [];
    let currentDate = new Date(startDate); // copy to avoid modifying original

    while (resultDates.length < 4) {
      if (currentDate.getDay() !== 0) {
        resultDates.push(new Date(currentDate));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return resultDates;
  };

  const isWithin90DaysFromToday = (date: Date): boolean => {
    const today = new Date();
    // console.log('meeeee-1111',today,'777777',date);

    const ninetyDaysLater = new Date();
    ninetyDaysLater.setDate(today.getDate() + 90);

    console.log("meeeee-2222", date, "eeeeee", date <= ninetyDaysLater);

    return date <= ninetyDaysLater;
  };

  const isBeyond90Days = (currentDate: Date) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);

    // Start of next month
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    return nextMonth > maxDate;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number // optional index for group members
  ) => {
    const { name, value } = e.target;


    if (appointmentType === "Self") {
      let updatedData = { ...formData, [name]: value };

      // If DOB is updated, auto-calculate age
      if (name === "dob" && value) {
        updatedData.age = calculateAge(value);
      }

      if (name === "patientName") {
        // Allow only letters and spaces
        const alphabetOnlyRegex = /^[A-Za-z\s]*$/;
        if (!alphabetOnlyRegex.test(value)) return; // Ignore invalid characters
      }

      // if (name === "age") {
      //   if (/^\d+$/.test(value)) {
      //     // Valid number entered → calculate DOB
      //     updatedData.dob = calculateDOB(value);
      //   } else if (value.trim() === "") {
      //     // If age is cleared → reset DOB too
      //     updatedData.dob = "";
      //   }
      // }

      if (name === "hapId" && !/^\d{8}$/.test(value)) {
        updatedData.hapId = value;
      }

      // console.log('updatedData-------',updatedData);

      setFormData(updatedData);

      // Clear error if present
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });

      // console.log('formData-----',formData);
    } else if (appointmentType === "Group" && typeof index === "number") {

      console.log('vvvvvv----222',value,'000----000',index);
      

      const updatedMembers = [...members];
      updatedMembers[index][name] = value;

      // Name validation: letters + space only
      if (name === "patientName") {
        const alphabetOnlyRegex = /^[A-Za-z\s]*$/;
        if (!alphabetOnlyRegex.test(value)) return; // stop if invalid
      }

      // Auto-calculate age from DOB
      if (name === "dob" && value) {
        updatedMembers[index].age = calculateAge(value);
      }

      // if (name === "age") {
      //   if (/^\d+$/.test(value)) {
      //     // Valid number entered → calculate DOB
      //     updatedMembers[index].dob = calculateDOB(value);
      //   } else if (value.trim() === "") {
      //     // If age is cleared → reset DOB too
      //     updatedMembers[index].dob = "";
      //   }
      // }

      setMembers(updatedMembers);

      // ✅ Clear error for this specific group field
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[`${name}_${index}`];
        return updatedErrors;
      });

      let updatedData = { ...formData, [name]: value };
      setFormData(updatedData);
      console.log(members);
    }
  };

  return (
    <div className="container-fluid p-3" style={{ marginTop: "10px" }}>
      <div className="row custom-main-layout">
        {/* Calendar Section */}
        <div className="calendar-section col-lg-5 col-md-12 mb-4">
          <div className="card border calendar-card">
            <div className="card-header bg-white border-0">
              <div className="d-flex justify-content-between align-items-center py-3">
                <h4
                  className="mb-0 text-dark fw-normal monthhead"
                  style={{ fontSize: "20px" }}
                >
                  {getMonthName()}
                </h4>
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <button
                    className="btn text-white d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#e67e22",
                      width: "40px",
                      height: "30px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      opacity: isCurrentMonth(currentDate) ? 0.5 : 1,
                      pointerEvents: isCurrentMonth(currentDate)
                        ? "none"
                        : "auto",
                    }}
                    onClick={goToPrevious}
                    disabled={isCurrentMonth(currentDate)}
                  >
                    ‹
                  </button>
                  <button
                    className="btn text-white px-4"
                    style={{
                      backgroundColor: "#e67e22",
                      height: "30px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    onClick={goToToday}
                  >
                    Today
                  </button>
                  <button
                    className="btn text-white d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#e67e22",
                      width: "40px",
                      height: "30px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "16px",
                      opacity: isBeyond90Days(currentDate) ? 0.5 : 1,
                      pointerEvents: isBeyond90Days(currentDate)
                        ? "none"
                        : "auto",
                    }}
                    onClick={goToNext}
                    disabled={isBeyond90Days(currentDate)}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div className="calendar-legend d-flex flex-row align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-danger rounded-circle"
                  style={{ width: "15px", height: "15px" }}
                ></div>
                <span className="text-muted small">Slot Closed</span>
              </div>
              <div className="d-flex align-items-center gap-2 ms-4">
                <div
                  className="slotNum-success rounded-circle"
                  style={{ width: "15px", height: "15px" }}
                ></div>
                <span className="text-muted small">Slot Available</span>
              </div>
            </div>

            <div className="calendarmainbody card-body p-4">
              {/* Weekday Headers */}
              <div className="d-flex lg:mb-4 sm:mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="flex-fill text-center">
                      <div className="fw-semibold text-dark dayfontsize">
                        {day}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="calendar-wrapper">
                <div
                  className={`calendar-grid ${selectedCenter ? "active" : ""}`}
                  style={{
                    opacity: !selectedCenter ? 0.5 : 1,
                    pointerEvents: !selectedCenter ? "none" : "auto",
                    cursor: !selectedCenter ? "not-allowed" : "pointer",
                  }}
                >
                  {getCalendarDays().map((day, index) => {
                    const isSunday = day.getDay() === 0;
                    const past = isPastDate(day) || isSunday;
                    const today = isToday(day);
                    const selected = isSelected(day);
                    const hasSlot = hasEvent(day);
                    const totaldaycount = totalcount(day);
                    // console.log('meeeeee-99999',day,hasSlot,'totaldaycount',totaldaycount);
                    console.log(totaldaycount);

                    const currentMonth = isCurrentMonth(day);
                    // console.log('totaldaycount---------',day,'day',totaldaycount);

                    const isDisabled =
                      isPastDate(day) || // Disable past
                      day.getDay() === 0 || // Disable Sundays
                      !isWithin90DaysFromToday(day) || // Disable if not in next 90 days
                      (totaldaycount === 0 && hasSlot); // Disable if no available slots

                    const dayStyle: React.CSSProperties = {
                      opacity: isDisabled ? 0.5 : 1,
                      border: isDisabled ? "1px solid #ccc" : "none",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      borderRadius: '5px',
                       background: today ? "orange": "",
                      // backgroundColor: today ? "#fe9647" : "transparent",
                      height: '35px'
                    };

                    return (
                      <div
                        key={index}
                        className="d-flex align-items-center justify-content-center position-relative calendardaybox"
                        style={{
                          pointerEvents: isDisabled ? "none" : "auto",
                         
                        }}
                        onClick={() => {
                          if (!isDisabled) {
                            handleDateClick(day, timeSlots);
                          }
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`calendardaystyle d-flex align-items-center justify-content-center rounded-square position-relative z-9999 ${
                                !isDisabled ? "calendar-day" : ""
                              } ${isSelecteddate(day) ? "selected" : ""}`}
                              style={dayStyle}
                            >
                              {day.getDate()}

                              {hasSlot && (
                                <div
                                  className="calendarAvalSlot"
                                  style={{
                                    backgroundColor:
                                      totaldaycount === 0
                                        ? "red"
                                        : "rgb(33 55 96)",
                                  }}
                                >
                                  {totaldaycount === 0 ? "" : totaldaycount}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {totaldaycount === 0 || totaldaycount === undefined
                              ? "No slot available"
                              : `Total Slots: ${totaldaycount}`}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    );
                  })}
                </div>

                {!selectedCenter && (
                  <div className="calendar-tooltip">
                    Please choose a center to enable calendar
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time Slots Panel */}
        </div>

        {/* Service Selection Section */}
        <div className="form-section col-lg-6 col-md-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-body Service-card-body">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold d-flex justify-content-between">
                    Centre
                  </label>
                  <select
                    className="form-select"
                    value={selectedCenter}
                    onChange={handleCenterChange}
                  >
                    <option value="">Select</option>
                    {Array.isArray(center) &&
                      center.map((item: any, index: number) => (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold d-flex justify-content-between">
                    Service
                  </label>

                  <div style={{ position: "relative" }} ref={dropdownRef}>
                    {/* Trigger */}
                    <div
                      className="form-select"
                      onClick={toggleDropdown}
                      style={{
                        cursor: "pointer",
                        paddingRight: "2rem", // space for arrow
                      }}
                    >
                      {getSelectedServiceNames() || "Select Service"}
                      <span style={{ float: "right" }}>&#9662;</span>
                    </div>

                    {dropdownOpen && (
                      <div className="dropdown-menu show custom-dropdown">
                        {selectedCenter && serviceList.length > 1 && (
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "10px",
                              padding: "5px",
                            }}
                          >
                            <input
                              type="checkbox"
                              // disabled={bookingType === "family"}
                              checked={isAllSelected()}
                              onChange={toggleSelectAll}
                            />
                            Select All
                          </label>
                        )}

                        {selectedCenter && serviceList.length === 0 && (
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "10px",
                              padding: "5px",
                            }}
                          >
                            <span style={{ color: "gray" }}>
                              No Service Available for selected Centre
                            </span>
                          </label>
                        )}

                        {serviceList.map(
                          (service) =>
                            selectedCenter && (
                              <label
                                key={service.code}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  gap: "10px",
                                  padding: "5px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  // disabled={bookingType === "family"}
                                  checked={selectedServices.includes(
                                    service.code
                                  )}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      service.code,
                                      service.price
                                    )
                                  }
                                />
                                <span>{service.name}</span>
                              </label>
                            )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-2">
                {/* Appointment Type */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Appointment Type
                  </label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="appointmentType"
                        id="self"
                        value="Self"
                        checked={appointmentType === "Self"}
                        onChange={(e) =>
                          appointmentTypechnage(e.target.value, "Self")
                        }
                        style={{
                          backgroundColor:
                            appointmentType === "Self"
                              ? "#e67e22"
                              : "transparent",
                          borderColor: "#e67e22",
                        }}
                      />
                      <label className="form-check-label" htmlFor="self">
                        Self
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="appointmentType"
                        id="group"
                        value="Group"
                        checked={appointmentType === "Group"}
                        onChange={(e) =>
                          appointmentTypechnage(e.target.value, "Group")
                        }
                        style={{
                          backgroundColor:
                            appointmentType === "Group"
                              ? "#e67e22"
                              : "transparent",
                          borderColor: "#e67e22",
                        }}
                      />
                      <label className="form-check-label" htmlFor="group">
                        Group
                      </label>
                    </div>
                  </div>
                </div>

                {/* Member Count (only shown if Group is selected) */}
                {appointmentType === "Group" && (
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold d-flex justify-content-between">
                      Member's Count
                    </label>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <input
                        type="number"
                        value={membercount}
                        onChange={handleMemberCountChange}
                        onKeyDown={(e) => {
                          if (["e", "E", ".", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                          }
                          const input = e.currentTarget;
                          if (
                            input.value.length >= 2 &&
                            ![
                              "Backspace",
                              "ArrowLeft",
                              "ArrowRight",
                              "Delete",
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        style={{
                          width: "120px",
                          border: shake ? "2px solid red" : undefined,
                          outline: shake ? "none" : undefined,
                        }}
                        className={`form-control ${shake ? "input-shake" : ""}`}
                        min={2}
                        max={5}
                      />
                      {errorMessage && (
                        <span style={{ color: "red", fontSize: "10px" }}>
                          {errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedDate && selectedCenter && (
              <div
                key={selectedDate.toString()}
                className="card shadow-sm mt-3 slot-slide-in position-relative"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* 🔴 Overlay if no service selected */}
                {selectedServices.length === 0 && (
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.85)",
                      zIndex: 10,
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    Please choose a service to book a slot
                  </div>
                )}

                {/* 🎯 Actual Slot Content */}
                <div className="card-body">
                  {(() => {
                    const selected = new Date(selectedDate);

                    const sortedSlotDates = getNextFourNonSundayDates(selected);

                    // console.log('slots------?????',sortedSlotDates,'777777',slotsGroupedByDate);

                    return sortedSlotDates.map((date) => {
                      const dateKey = Object.keys(slotsGroupedByDate).find(
                        (key) =>
                          new Date(key).toDateString() === date.toDateString()
                      );
                      // console.log('slots------?????-2222',dateKey);

                      const slots = dateKey
                        ? Array.from(
                            new Map(
                              slotsGroupedByDate[dateKey].map((slot: any) => [
                                slot.time,
                                slot,
                              ])
                            ).values()
                          )
                        : [];
                      // console.log('slots----------',slots);

                      return (
                        <div
                          key={dateKey}
                          className="mb-3"
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexDirection: "column",
                            border: "1px solid rgb(216, 188, 148)", // light orange border
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            boxShadow: `
                              0 2px 4px rgba(255, 255, 255, 0.7),     
                              0 4px 10px rgba(230, 126, 34, 0.3)   
                            `,
                          }}
                        >
                          <div
                            className="card-header bg-blue"
                            style={{ fontSize: "15px" }}
                          >
                            <h5 className="mb-0">
                              Available Slots from{" "}
                              {date.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </h5>
                          </div>

                          {slots.length > 0 &&
                          slots.some((ele) => ele?.remaining > 0) &&
                          slots.some(
                            (ele) =>
                              ele?.remaining > 0 &&
                              !isSlotExpired(
                                ele?.time,
                                ele?.slotItem?.slot?.date
                              )
                          ) ? (
                            <div
                              className="row g-3 px-2"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                padding: "10px 10px",
                              }}
                            >
                              {slots.map((slot: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="col-12 col-sm-6 col-md-4 mb-3 position-relative"
                                >
                                  <>
                                    <span
                                      className={`position-absolute badge ${
                                        slot.remaining < membercount
                                          ? "badge-disabled"
                                          : "slotNum-success"
                                      }`}
                                      style={{
                                        top: "-10px",
                                        left: "0px",
                                        zIndex: 1,
                                        borderRadius: "50%",
                                        padding: "0.4em 0.6em",
                                      }}
                                    >
                                      {slot.remaining}
                                    </span>

                                    <button
                                      className={`btn w-70 text-start btnclr ${
                                        slot.remaining < membercount
                                          ? "btn-outline-secondary"
                                          : "btn-outline-primary"
                                      }`}
                                      onClick={() => bookTimeSlot(slot)}
                                      disabled={
                                        slot.remaining < membercount ||
                                        selectedServices.length === 0
                                      }
                                      style={{
                                        borderRadius: "5px",
                                        background:
                                          slot.remaining < membercount
                                            ? "grey"
                                            : "",
                                        color:
                                          slot.remaining < membercount
                                            ? "white"
                                            : "",
                                        cursor:
                                          slot.remaining < membercount
                                            ? "not-allowed"
                                            : "pointer",
                                      }}
                                      aria-disabled={
                                        slot.remaining < membercount ||
                                        selectedServices.length === 0 ||
                                        isSlotExpired(
                                          slot?.time,
                                          slot?.slotItem?.slot?.date
                                        )
                                      }
                                      aria-label={
                                        slot.remaining < membercount
                                          ? "Not enough available slots"
                                          : "Select time slot"
                                      }
                                    >
                                      {slot.time}
                                    </button>
                                  </>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted fst-italic px-2 py-3">
                              No slots for this date
                            </p>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {showDialog && (
              <div
                className="modal show d-block"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header justify-content-between">
                      <h1
                        style={{ fontSize: "30px", fontWeight: "bold" }}
                        className="modal-title w-100 text-center"
                      >
                        Schedule New Appointment
                      </h1>
                      <button onClick={cancel} className="btn-custom-orange">
                        &#10006;
                      </button>
                    </div>

                    <>
                      <div className="info-section">
                        <div className="info-row">
                          <div className="info-item">
                            <label className="info-label">
                              Selected Date <span>:</span>
                            </label>
                            <span className="info-value">
                              {selectedDate ? `${formatDateToDDMMYYYY(selectedDate)}` : "No date selected"}
                            </span>
                          </div>

                          <div className="info-item">
                            <label className="info-label">
                              Applicant Name <span>:</span>
                            </label>
                            <span className="info-value">
                              {formData?.patientName}
                            </span>
                          </div>
                        </div>

                        {/* Row 2 */}
                        <div className="info-row">
                          <div className="info-item">
                            <label className="info-label">
                              Selected Slot <span>:</span>
                            </label>
                            <span className="info-value">
                              {selectedslottime}
                            </span>
                          </div>

                          <div className="info-item">
                            <label className="info-label">
                              Passport No <span>:</span>
                            </label>
                            <span className="info-value">
                              {formData?.passportNo}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="modal-body">
                        {stepIndex === 0 && (
                          <>
                            {appointmentType === "Group" && stepIndex === 0 ? (
                              <>
                                {" "}
                                <Accordion
                                  type="single"
                                  collapsible
                                  value={openAccordion}
                                  onValueChange={(val) => setOpenAccordion(val)}
                                  className="w-full"
                                >
                                  {members.map((member, i) => (
                                    <AccordionItem key={i} value={`item-${i}`}>
                                      <AccordionTrigger>
                                        <div
                                          className={`flex items-center gap-2 ${
                                            memberHasError[i]
                                              ? "bg-red-100 border-l-4 border-red-500 px-2 py-1 input-shake"
                                              : ""
                                          }`}
                                        >
                                          {i === 0 ? (
                                            <>
                                              Primary Member Details
                                              <span className="ml-2 rounded bg-green-600 px-2 py-0.5 text-xs text-white">
                                                Primary
                                              </span>
                                            </>
                                          ) : (
                                            `Member ${i + 1} Details`
                                          )}
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <form>
                                          <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                              <label
                                                htmlFor={`patientName_${i}`}
                                                className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                
                                              >
                                                Name:
                                              </label>
                                              <input
                                                type="text"
                                                className={`form-control ${
                                                  formErrors[`patientName_${i}`]
                                                    ? "is-invalid input-shake"
                                                    : ""
                                                }`}
                                                id={`patientName_${i}`}
                                                name="patientName"
                                                value={member.patientName}
                                                onChange={(e) => handleChange(e, i)}
                                                autoComplete="off"
                                                placeholder={getDynamicPlaceholder(
                                                  "patientName"
                                                )}
                                              />
                                            </div>
                                            </div>
                                            
                                            <div className="col-md-6 mb-3">
                                              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                                <label
                                                  htmlFor={`contactNumber_${i}`}
                                                  className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                  
                                                >
                                                  Contact Number:
                                                </label>
                                                <input
                                                  type="text"
                                                  className={`form-control ${
                                                    formErrors[`contactNumber_${i}`]
                                                      ? "is-invalid input-shake"
                                                      : ""
                                                  }`}
                                                  id={`contactNumber_${i}`}
                                                  name="contactNumber"
                                                  value={member.contactNumber}
                                                  maxLength={10}
                                                  onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) {
                                                      handleChange(e, i);
                                                    }
                                                  }}
                                                  placeholder={getDynamicPlaceholder(
                                                    "contactNumber"
                                                  )}
                                                  autoComplete="off"
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                              <label
                                                htmlFor={`gender_${i}`}
                                                className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                
                                              >
                                                Gender:
                                              </label>
                                              <select
                                                className={`form-control ${
                                                  formErrors[`gender_${i}`]
                                                    ? "is-invalid input-shake"
                                                    : ""
                                                }`}
                                                name="gender"
                                                id={`gender_${i}`}
                                                value={member.gender}
                                                onChange={(e) => handleChange(e, i)}
                                              >
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                              </select>
                                            </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                                <label
                                                  htmlFor={`dob_${i}`}
                                                  className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                  
                                                >
                                                  DOB:
                                                </label>
                                                <input
                                                  type="date"
                                                  className={`form-control ${
                                                    formErrors[`dob_${i}`]
                                                      ? "is-invalid input-shake"
                                                      : ""
                                                  }`}
                                                  id="dob"
                                                  name="dob"
                                                  value={member.dob}
                                                  min={getMinDOB()}
                                                  max={getMaxDOB()}
                                                  onChange={(e) => handleChange(e, i)}
                                                  style={{
                                                    cursor: "pointer",
                                                    backgroundColor: "#fff",
                                                  }}
                                                  onKeyDown={(e) => e.preventDefault()}
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                              <label
                                                htmlFor={`age_${i}`}
                                                className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                
                                              >
                                                Age:
                                              </label>
                                              <input
                                                type="text"
                                                className={`form-control ${
                                                  formErrors[`age_${i}`]
                                                    ? "is-invalid input-shake"
                                                    : ""
                                                }`}
                                                id={`age_${i}`}
                                                name="age"
                                                value={member.age}
                                                maxLength={2}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (/^\d*$/.test(value)) {
                                                    handleChange(e, i);
                                                  }
                                                }}
                                                placeholder={getDynamicPlaceholder(
                                                  "age"
                                                )}
                                                autoComplete="off"
                                              />
                                            </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                              <label
                                                htmlFor={`passportNo_${i}`}
                                                className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                
                                              >
                                                Passport No:
                                              </label>
                                        
                                                <input
                                                  type="text"
                                                  className={`form-control ${
                                                    formErrors[`passportNo_${i}`]
                                                      ? "is-invalid input-shake"
                                                      : ""
                                                  }`}
                                                  id={`passportNo_${i}`}
                                                  name="passportNo"
                                                  value={member.passportNo}
                                                  onChange={(e) => handleChange(e, i)}
                                                  maxLength={12}
                                                  placeholder={getDynamicPlaceholder(
                                                    "passportNo"
                                                  )}
                                                  autoComplete="off"
                                                />
                                              </div>
                                        
                                            </div>
                                          </div>

                                          {i === 0 && (
                                            <>
                                              <div className="row mb-3">
                                                <div className="col-md-6 mb-3">
                                                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                                    <label
                                                      htmlFor={`email_${i}`}
                                                      className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                      
                                                    >
                                                      Email:
                                                    </label>
                                                    <input
                                                      type="email"
                                                      id={`email_${i}`}
                                                      className={`form-control ${
                                                        formErrors[`email_${i}`]
                                                          ? "is-invalid input-shake"
                                                          : ""
                                                      }`}
                                                      name="email"
                                                      value={members[i].email}
                                                      onChange={(e) =>
                                                        handleChange(e, i)
                                                      }
                                                      placeholder={getDynamicPlaceholder(
                                                        "email"
                                                      )}
                                                      autoComplete="off"
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                                    <label
                                                      className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                      
                                                    >
                                                      HAP ID:
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className={`form-control ${
                                                        formErrors[`hapId_${i}`]
                                                          ? "is-invalid input-shake"
                                                          : ""
                                                      }`}
                                                      id={`hapId_${i}`}
                                                      inputMode="numeric"
                                                      pattern="\d*"
                                                      name="hapId"
                                                      value={members[i].hapId}
                                                      onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*$/.test(value)) {
                                                          handleChange(e, i);
                                                        }
                                                      }}
                                                      maxLength={8}
                                                      placeholder={getDynamicPlaceholder(
                                                        "hapId"
                                                      )}
                                                      autoComplete="off"
                                                    />
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="row mb-3">
                                                <div className="col-md-6 mb-3">
                                                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                                    <label
                                                      htmlFor={`alternativeNumber_${i}`}
                                                      className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                      
                                                    >
                                                      Alternative Number:
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className={`form-control ${
                                                        formErrors[
                                                          `alternativeNumber_${i}`
                                                        ]
                                                          ? "is-invalid input-shake"
                                                          : ""
                                                      }`}
                                                      id={`alternativeNumber_${i}`}
                                                      name="alternativeNumber"
                                                      value={
                                                        members[i].alternativeNumber
                                                      }
                                                      maxLength={10}
                                                      onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*$/.test(value)) {
                                                          handleChange(e, i);
                                                        }
                                                      }}
                                                      placeholder={getDynamicPlaceholder(
                                                        "alternativeNumber"
                                                      )}
                                                      autoComplete="off"
                                                    />
                                                  </div>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                                    <label
                                                      htmlFor={`paymentMethod_${i}`}
                                                      className="form-label label-fixed me-md-2 mb-1 mb-md-0"
                                                      
                                                    >
                                                      Payment Method:
                                                    </label>
                                                    <select
                                                      className={`form-control ${
                                                        formErrors[`paymentMethod_${i}`]
                                                          ? "is-invalid input-shake"
                                                          : ""
                                                      }`}
                                                      id={`paymentMethod_${i}`}
                                                      name="paymentMethod"
                                                      value={members[i].paymentMethod}
                                                      onChange={(e) =>
                                                        handleChange(e, i)
                                                      }
                                                    >
                                                      <option value="">Select</option>
                                                      <option value="QR">QR</option>
                                                    </select>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </form>
                                      </AccordionContent>
                                    </AccordionItem>
                                  ))}
                                </Accordion>
                              </>
                            ) : (
                              <form>
                                <div className="row mb-3">
                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="patientName" className="form-label label-fixed me-md-2 mb-1 mb-md-0">Name</label>
                                      <input
                                        type="text"
                                        className={`form-control ${formErrors.patientName ? "is-invalid input-shake" : ""}`}
                                        id="patientName"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        placeholder={getDynamicPlaceholder("patientName")}
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="hapId" className="form-label label-fixed me-md-2 mb-1 mb-md-0">HAP ID</label>
                                      <input
                                        type="text"
                                        className={`form-control ${formErrors.hapId ? "is-invalid input-shake" : ""}`}
                                        id="hapId"
                                        name="hapId"
                                        value={formData.hapId}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) handleChange(e);
                                        }}
                                        placeholder={getDynamicPlaceholder("hapId")}
                                        maxLength={8}
                                        inputMode="numeric"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="row mb-3">
                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="email" className="form-label label-fixed me-md-2 mb-1 mb-md-0">Email</label>
                                      <input
                                        type="email"
                                        className={`form-control ${formErrors.email ? "is-invalid input-shake" : ""}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder={getDynamicPlaceholder("email")}
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="contactNumber" className="form-label label-fixed me-md-2 mb-1 mb-md-0">Contact Number</label>
                                      <input
                                        type="text"
                                        className={`form-control ${formErrors.contactNumber ? "is-invalid input-shake" : ""}`}
                                        id="contactNumber"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) handleChange(e);
                                        }}
                                        maxLength={10}
                                        placeholder={getDynamicPlaceholder("contactNumber")}
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="row mb-3">
                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="alternativeNumber" className="form-label label-fixed me-md-2 mb-1 mb-md-0">Alternative Number</label>
                                      <input
                                        type="text"
                                        className={`form-control ${formErrors.alternativeNumber ? "is-invalid input-shake" : ""}`}
                                        id="alternativeNumber"
                                        name="alternativeNumber"
                                        value={formData.alternativeNumber}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) handleChange(e);
                                        }}
                                        maxLength={10}
                                        placeholder={getDynamicPlaceholder("alternativeNumber")}
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="gender" className="form-label label-fixed me-md-2 mb-1 mb-md-0">Gender</label>
                                      <select
                                        className={`form-control ${formErrors.gender ? "is-invalid input-shake" : ""}`}
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                      >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="row mb-3">
                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="dob" className="form-label label-fixed me-md-2 mb-1 mb-md-0">DOB</label>
                                      <input
                                        type="date"
                                        className={`form-control ${formErrors.dob ? "is-invalid" : ""}`}
                                        id="dob"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        min={getMinDOB()}
                                        max={getMaxDOB()}
                                        onKeyDown={(e) => e.preventDefault()}
                                        style={{ backgroundColor: "#fff", cursor: "pointer" }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="age" className="form-label label-fixed me-md-2 mb-1 mb-md-0">Age</label>
                                      <input
                                        type="text"
                                        className={`form-control ${formErrors.age ? "is-invalid input-shake" : ""}`}
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (/^\d*$/.test(value)) handleChange(e);
                                        }}
                                        maxLength={2}
                                        placeholder={getDynamicPlaceholder("age")}
                                        autoComplete="off"
                                        disabled
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="row mb-3">
                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="passportNo" className="form-label label-fixed me-md-2 mb-1 mb-md-0">Passport No</label>
                                      <input
                                        type="text"
                                        className={`form-control ${formErrors.passportNo ? "is-invalid input-shake" : ""}`}
                                        id="passportNo"
                                        name="passportNo"
                                        value={formData.passportNo}
                                        onChange={handleChange}
                                        maxLength={12}
                                        placeholder={getDynamicPlaceholder("passportNo")}
                                        autoComplete="off"
                                      />
                                    </div>
                                    {formErrors.passportNo && (
                                      <small className="text-danger mt-1 d-block text-end">eg: A123456 or AB1234567</small>
                                    )}
                                  </div>

                                  <div className="col-md-6 mb-3">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                      <label htmlFor="paymentMethod" className="form-label label-fixed me-md-2 mb-1 mb-md-0">Payment Method</label>
                                      <select
                                        className={`form-control ${formErrors.paymentMethod ? "is-invalid input-shake" : ""}`}
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                      >
                                        <option value="">Select</option>
                                        <option value="QR">QR</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </form>

                            )}
                          </>
                        )}

                        {stepIndex === 1 && (
                          <div className="payment-section container">
                            {/* Header Section */}
                            <div className="d-flex flex-column flex-md-row justify-content-start align-items-start gap-3 mb-4">
                              <h1 className="h5 fw-bold mb-2 mb-md-0">Price Details :</h1>
                              <h1 className="h5 fw-bold">Scan the QR code to pay</h1>
                            </div>


                            {/* Main Content Section */}
                            <div className="row">
                              {/* Left Column */}
                              <div className="col-12 col-lg-6 mb-4">
                                <div className="d-flex flex-column gap-3">

                                  {/* Price */}
                                  <div className="d-flex flex-column">
                                    <label className="fw-bold mb-1">Price:</label>
                                    <span className="form-control">&#8377; {formData?.totalPrice}</span>
                                  </div>

                                  {/* Payment Type */}
                                  <div className="d-flex flex-column">
                                    <label htmlFor="PaymentType" className="fw-bold mb-1">Payment Type:</label>
                                    <select
                                      id="PaymentType"
                                      name="PaymentType"
                                      className={`form-control ${formErrors.PaymentType ? "is-invalid input-shake" : ""}`}
                                      value={formData.PaymentType}
                                      onChange={handleChange}
                                      autoComplete="off"
                                    >
                                      <option value="Select">Select</option>
                                      <option>Gpay</option>
                                      <option>PhonePay</option>
                                      <option>Paytm</option>
                                    </select>
                                  </div>

                                  {/* Transaction File Upload */}
                                  <div className="d-flex flex-column">
                                    <label className="fw-bold mb-1">Upload Transaction File:</label>
                                    <Input
                                      type="file"
                                      accept=".png,.pdf"
                                      disabled={!formData.PaymentType}
                                      onChange={handleFileChange}
                                      className="form-control"
                                      style={{
                                        cursor:
                                          !formData.PaymentType || formData.PaymentType === ""
                                            ? "not-allowed"
                                            : "pointer",
                                      }}
                                    />
                                  </div>

                                  {/* Transaction ID */}
                                  <div className="d-flex flex-column">
                                    <label htmlFor="TransactionId" className="fw-bold mb-1">Transaction ID:</label>
                                    <input
                                      id="TransactionId"
                                      name="TransactionId"
                                      className={`form-control ${formErrors.TransactionId ? "is-invalid input-shake" : ""}`}
                                      value={formData.TransactionId}
                                      onChange={handleChange}
                                      autoComplete="off"
                                      placeholder={getDynamicPlaceholder("TransactionId")}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Right Column - QR Code */}
                              <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center">
                                <img
                                  src={Nddiagnostics_QR_Code_1}
                                  alt="QR Code"
                                  className="img-fluid"
                                  style={{ maxWidth: "250px", maxHeight: "280px", width: "100%", height: "auto" }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </>

                    <div className="modal-footer d-flex justify-content-end gap-2">
                      <button className="btn-custom-orange" onClick={clear}>
                        Clear
                      </button>
                      <button className="btn-custom-orange" onClick={cancel}>
                        Cancel
                      </button>
                      {stepIndex > 0 && (
                        <button className="btn-custom-orange" onClick={prevStep}>
                          Prev
                        </button>
                      )}
                      {stepIndex === 0 && (
                        <button className="btn-custom-orange" onClick={nextStep}>
                          Next
                        </button>
                      )}
                      {stepIndex === 1 && (
                        <button className="btn-custom-orange" onClick={onSubmit}>
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default AppointmentBooking;
