


import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import CryptoJS from "crypto-js";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarIcon, CheckCircle, MapPin, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../api/httpClient";
import { API, environment } from "../../../environment/environment";
// import { API, environment } from "../../../environment/environment";

interface BookingState {
  center: string;
  country: string;
  appointmentType: 'self' | 'group';
  groupSize: number;
  application:string;
  country_code:string;
  appointmentDate: Date | undefined;
  personalDetails: {
    name: string;
    hapId?: string;
    nzhrId?: string;
    email: string;
    contactNumber: string;
    alternativeNumber: string;
    gender: string;
    dob: Date | undefined;
    age: string;
    passport: string;
    paymentMethod: string;
  };
}


interface Center {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  contact_number1?: string;
  city?: { id: number; name: string };
  state?: { id: number; name: string };
  country?: { id: number; name: string };
  application?: number; 
}


const steps = [
  { id: 1, title: "Select Center", description: "Choose your examination center" },
  { id: 2, title: "Select Country", description: "Choose your visa destination" },
  // { id: 3, title: "Appointment Details", description: "Select type and date" },
  // { id: 4, title: "Personal Information", description: "Fill your details" }
];

export default function VisaMedicals() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [center, setCenter] = useState<Center[]>([]);
  const [departmentlist,setDepartmentlist] = useState([])


  const [bookingData, setBookingData] = useState<BookingState>({
    center: "",
    country: "",
    country_code:'',
    application:'',
    appointmentType: 'self',
    groupSize: 1,
    appointmentDate: undefined,
    personalDetails: {
      name: "",
      email: "",
      contactNumber: "",
      alternativeNumber: "",
      gender: "",
      dob: undefined,
      age: "",
      passport: "",
      paymentMethod: ""
    }
  });
  const [bookings, setBookings] = useState<BookingState[]>([]);

    console.log('center?????',center);

    console.log('bookingData?????',bookingData);

    console.log('departmentlist-----',departmentlist);
    

useEffect(() => {
  (async () => {
    try {
      const res = await httpClient.get(API.AVAILABLE_CENTER_API);
      console.log(res.data.data);

      const filteredData = res.data.data.filter(
        (item: any) => item.status !== "2"
      );

      console.log("filteredData????---", filteredData);

      setCenter(filteredData || []); // ✅ FIXED CAPITALIZATION
    } catch (err) {
      console.error("Error loading slots", err);
    }
  })();
}, []);



useEffect(() => {
  if (bookingData?.center && bookingData?.center !=='') {
    (async () => {
      try {
        const res = await httpClient.get(
          `${API.DEPARTMENT_GET_API}?code=${bookingData?.center}`
        );

        console.log("yyyyyy?????", res?.data?.departmentlist);

        let departmentslist = res?.data?.departmentlist.filter((ele: any) => ele.name !== 'ALL') || [];

        setDepartmentlist(departmentslist);
      } catch (err) {
        console.error("Error loading slots", err);
      }
    })();
  }
}, [bookingData?.center]);


  
  const handleNext = () => {
    if (isStepValid(currentStep)) {
      // Log the current booking data to console
      console.log('Booking Data on Continue:', bookingData);
      // Store current booking data in array
      setBookings(prev => [...prev, { ...bookingData }]);
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };


  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

const updateBookingData = (field: string, value: any) => {
  if (field === "center") {
    setBookingData((prev) => ({
      ...prev,
      center: value.code,
      application: value.application,
    }));
  } else {
    setBookingData((prev) => {
      const updatedData = {
        ...prev,
        country: value.id,
        country_code: value.code,
      };

      // ✅ Call after we have the updated data
      handledotobooking(updatedData);

      return updatedData;
    });
  }

  console.log("Booking Data on Continue:", bookingData);

  // Store current booking data in array
  setBookings((prev) => [...prev, { ...bookingData }]);

  if (currentStep < steps.length) {
    setCurrentStep(currentStep + 1);
  }
};

const handledotobooking = (data: any) => {
  localStorage.removeItem("New_bookingData");

  // ✅ Use updated data passed as argument
  const reEncrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    environment.SECRET_KEY
  ).toString();

  localStorage.setItem("New_bookingData", reEncrypted);

  navigate(`${environment.BASE_PATH}AppointmentBooking`);
  window.scrollTo(0, 0);
};


  

  const updatePersonalDetails = (field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return bookingData.center !== "";
      case 2:
        return bookingData.country !== "";
      case 3:
        return bookingData.appointmentDate !== undefined;
      case 4:
        const details = bookingData.personalDetails;
        const baseFields = details.name && details.email && details.contactNumber &&
          details.gender && details.dob && details.passport && details.paymentMethod;
        if (bookingData.country === "australia") {
          return baseFields && details.hapId;
        } else if (bookingData.country === "newzealand") {
          return baseFields && details.nzhrId;
        }
        return baseFields;
      default:
        return false;
    }
  };





  const renderStepIndicator = () => (
  <div className="w-full mb-8">
    {/* Step Circles */}
    <div className="flex items-center justify-center gap-6 max-w-3xl mx-auto">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep > step.id
                ? "bg-green-500 border-green-500 text-white"
                : currentStep === step.id
                ? "bg-orange-500 border-orange-500 text-white"
                : "bg-gray-200 border-gray-300 text-gray-500"
            }`}
          >
            {currentStep > step.id ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span className="font-semibold">{step.id}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 lg:w-12 h-1 mx-2 lg:mx-3 transition-all duration-300 ${
                currentStep > step.id ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>

    {/* Step Titles */}
    <div className="flex justify-center gap-12 mt-4 max-w-3xl mx-auto">
      {steps.map((step) => (
        <div key={step.id} className="text-center w-[100px]">
          <h3
            className={`text-sm font-medium ${
              currentStep >= step.id ? "text-brand-blue" : "text-gray-500"
            }`}
          >
            {step.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
);


  const renderStep1 = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-brand-blue">Select Examination Center</CardTitle>
        <CardDescription>Choose your preferred medical examination center</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${bookingData.center === 'kochi'
              ? 'border-brand-blue bg-blue-50'
              : 'border-gray-200 hover:border-brand-blue hover:bg-gray-50'
            }`}
        >
         {center.map((c) => {
          const isSelected = bookingData?.center === c.code;

          return (
            <div
              key={c.id}
              className={`flex items-center space-x-4 p-6 border-2 rounded-lg cursor-pointer transition-all duration-300
                ${isSelected
                  ? "border-green-500 bg-green-50" // selected
                  : "hover:border-orange-600 bg-orange-50" // default before selecting
                }
              `}
              onClick={() => updateBookingData("center", c)}
            >
              <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-black">{c.name}</h3>
                <p className="text-sm text-brand-blue mt-2">
                  📍 {c.city?.name}, {c.state?.name}, {c.country?.name}
                </p>
                {c.contact_number1 && (
                  <p className="text-sm text-gray-500 mt-1">📞 {c.contact_number1}</p>
                )}
              </div>

              {isSelected && (
                <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
              )}
            </div>
          );
        })}

        </div>

       
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-brand-blue">Select Country</CardTitle>
        <CardDescription>Choose your visa destination country</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departmentlist.map((dept: any) => {
            const isSelected = bookingData.country === dept.id;

            return (
              <div
                key={dept.id}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300
                  ${isSelected
                    ? "border-green-500 bg-green-50" // selected
                    : "hover:border-orange-600 bg-orange-50" // default
                  }`}
                onClick={() => updateBookingData("country", dept)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">
                    {dept.code === "AU"
                      ? "🇦🇺"
                      : dept.code === "NZ"
                      ? "🇳🇿"
                      : "🏥"}
                  </div>
                  <h3 className="text-lg font-semibold text-brand-black">{dept.name}</h3>
                  <p className="text-gray-600 text-sm mt-2">
                    Medical examinations for {dept.name} visa applications
                  </p>
                  {isSelected && (
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mt-3" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between pt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-8 py-3"
            data-testid="button-back-step2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-brand-blue">Appointment Details</CardTitle>
        <CardDescription>Select appointment type and preferred date</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Appointment Type</Label>
          <RadioGroup
            value={bookingData.appointmentType}
            onValueChange={(value: 'self' | 'group') => updateBookingData('appointmentType', value)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="self" id="self" />
              <Label htmlFor="self" className="flex items-center cursor-pointer">
                <User className="w-5 h-5 mr-2 text-brand-blue" />
                Self
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="group" id="group" />
              <Label htmlFor="group" className="flex items-center cursor-pointer">
                <Users className="w-5 h-5 mr-2 text-brand-blue" />
                Group
              </Label>
            </div>
          </RadioGroup>
        </div>

        {bookingData.appointmentType === 'group' && (
          <div>
            <Label htmlFor="groupSize" className="text-base font-medium mb-2 block">
              Number of Members
            </Label>
            <Select
              value={bookingData.groupSize.toString()}
              onValueChange={(value) => updateBookingData('groupSize', parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select group size" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} {size === 1 ? 'Member' : 'Members'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label className="text-base font-medium mb-4 block">Preferred Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !bookingData.appointmentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bookingData.appointmentDate ? format(bookingData.appointmentDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bookingData.appointmentDate}
                onSelect={(date) => updateBookingData('appointmentDate', date)}
                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-8 py-3"
            data-testid="button-back-step3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepValid(3)}
            className="bg-brand-blue text-brand-orange px-6 py-2"
            data-testid="button-continue-step3"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-brand-blue">Personal Information</CardTitle>
        <CardDescription>
          Fill your details for {bookingData.country === 'australia' ? 'Australia' : 'New Zealand'} visa medical examination
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={bookingData.personalDetails.name}
              onChange={(e) => updatePersonalDetails('name', e.target.value)}
              placeholder="Enter your full name"
              data-testid="input-name"
            />
          </div>

          {bookingData.country === 'australia' && (
            <div>
              <Label htmlFor="hapId">HAP ID *</Label>
              <Input
                id="hapId"
                value={bookingData.personalDetails.hapId || ''}
                onChange={(e) => updatePersonalDetails('hapId', e.target.value)}
                placeholder="Enter your HAP ID"
                data-testid="input-hap-id"
              />
            </div>
          )}

          {bookingData.country === 'newzealand' && (
            <div>
              <Label htmlFor="nzhrId">NZER ID *</Label>
              <Input
                id="nzhrId"
                value={bookingData.personalDetails.nzhrId || ''}
                onChange={(e) => updatePersonalDetails('nzhrId', e.target.value)}
                placeholder="Enter your NZER ID"
                data-testid="input-nzhr-id"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={bookingData.personalDetails.email}
              onChange={(e) => updatePersonalDetails('email', e.target.value)}
              placeholder="Enter your email"
              data-testid="input-email"
            />
          </div>

          <div>
            <Label htmlFor="contact">Contact Number *</Label>
            <Input
              id="contact"
              value={bookingData.personalDetails.contactNumber}
              onChange={(e) => updatePersonalDetails('contactNumber', e.target.value)}
              placeholder="Enter your contact number"
              data-testid="input-contact"
            />
          </div>

          <div>
            <Label htmlFor="altContact">Alternative Number</Label>
            <Input
              id="altContact"
              value={bookingData.personalDetails.alternativeNumber}
              onChange={(e) => updatePersonalDetails('alternativeNumber', e.target.value)}
              placeholder="Enter alternative number"
              data-testid="input-alt-contact"
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={bookingData.personalDetails.gender}
              onValueChange={(value) => updatePersonalDetails('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !bookingData.personalDetails.dob && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {bookingData.personalDetails.dob ? format(bookingData.personalDetails.dob, "PPP") : "Select date of birth"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={bookingData.personalDetails.dob}
                  onSelect={(date) => updatePersonalDetails('dob', date)}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={bookingData.personalDetails.age}
              onChange={(e) => updatePersonalDetails('age', e.target.value)}
              placeholder="Enter your age"
              data-testid="input-age"
            />
          </div>

          <div>
            <Label htmlFor="passport">Passport Number *</Label>
            <Input
              id="passport"
              value={bookingData.personalDetails.passport}
              onChange={(e) => updatePersonalDetails('passport', e.target.value)}
              placeholder="Enter passport number"
              data-testid="input-passport"
            />
          </div>

          <div>
            <Label htmlFor="payment">Payment Method *</Label>
            <Select
              value={bookingData.personalDetails.paymentMethod}
              onValueChange={(value) => updatePersonalDetails('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-8 py-3"
            data-testid="button-back-step4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            disabled={!isStepValid(4)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            data-testid="button-submit-booking"
          >
            Submit Booking <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <section id="visa-medicals" className="py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 via-brand-purple/5 to-brand-orange/5"></div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-50 border-4 border-brand-orange rounded-3xl flex items-center justify-center shadow-xl">
              <CalendarIcon className="w-12 h-12 text-brand-orange" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-brand-black">Visa Medical Examination</span><br />
            <span className="text-brand-orange">Booking</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book your medical examination in simple steps
          </p>
        </div>

        {renderStepIndicator()}
        {renderCurrentStep()}
      </div>
    </section>
  );
}