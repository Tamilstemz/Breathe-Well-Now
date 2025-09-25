import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Users, User, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BookingState {
  center: string;
  country: string;
  appointmentType: 'self' | 'group';
  groupSize: number;
  appointmentDate: Date | undefined;
  personalDetails: {
    name: string;
    hapId?: string; // For Australia
    nahrId?: string; // For New Zealand
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

const steps = [
  { id: 1, title: "Select Center", description: "Choose your examination center" },
  { id: 2, title: "Select Country", description: "Choose your visa destination" },
  { id: 3, title: "Appointment Details", description: "Select type and date" },
  { id: 4, title: "Personal Information", description: "Fill your details" }
];

export default function VisaMedicalBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingState>({
    center: "",
    country: "",
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

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateBookingData = (field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
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
          return baseFields && details.nahrId;
        }
        return baseFields;
      default:
        return false;
    }
  };

  const renderStepIndicator = () => (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep > step.id 
                ? 'bg-green-500 border-green-500 text-white' 
                : currentStep === step.id 
                  ? 'bg-brand-blue border-brand-blue text-white' 
                  : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              {currentStep > step.id ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{step.id}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-24 h-1 mx-4 transition-all duration-300 ${
                currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {steps.map((step) => (
          <div key={step.id} className="text-center" style={{ width: '120px' }}>
            <h3 className={`text-sm font-medium ${
              currentStep >= step.id ? 'text-brand-blue' : 'text-gray-500'
            }`}>
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
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
            bookingData.center === 'kochi' 
              ? 'border-brand-blue bg-blue-50' 
              : 'border-gray-200 hover:border-brand-blue hover:bg-gray-50'
          }`}
          onClick={() => updateBookingData('center', 'kochi')}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-black">Kochi Visa Medical Examination Center</h3>
              <p className="text-gray-600">Professional medical examinations for visa applications</p>
              <p className="text-sm text-brand-blue mt-2">📍 Kochi, Kerala, India</p>
            </div>
            {bookingData.center === 'kochi' && (
              <CheckCircle className="w-6 h-6 text-brand-blue ml-auto" />
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-6">
          <Button
            onClick={handleNext}
            disabled={!isStepValid(1)}
            className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3"
            data-testid="button-continue-step1"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
          <div 
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
              bookingData.country === 'australia' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-500 hover:bg-gray-50'
            }`}
            onClick={() => updateBookingData('country', 'australia')}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🇦🇺</div>
              <h3 className="text-lg font-semibold text-brand-black">Australia</h3>
              <p className="text-gray-600 text-sm mt-2">Medical examinations for Australian visa applications</p>
              {bookingData.country === 'australia' && (
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mt-3" />
              )}
            </div>
          </div>

          <div 
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
              bookingData.country === 'newzealand' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-500 hover:bg-gray-50'
            }`}
            onClick={() => updateBookingData('country', 'newzealand')}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🇳🇿</div>
              <h3 className="text-lg font-semibold text-brand-black">New Zealand</h3>
              <p className="text-gray-600 text-sm mt-2">Medical examinations for New Zealand visa applications</p>
              {bookingData.country === 'newzealand' && (
                <CheckCircle className="w-6 h-6 text-blue-500 mx-auto mt-3" />
              )}
            </div>
          </div>
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
          <Button
            onClick={handleNext}
            disabled={!isStepValid(2)}
            className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3"
            data-testid="button-continue-step2"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
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
            className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3"
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
              <Label htmlFor="nahrId">NAHR ID *</Label>
              <Input
                id="nahrId"
                value={bookingData.personalDetails.nahrId || ''}
                onChange={(e) => updatePersonalDetails('nahrId', e.target.value)}
                placeholder="Enter your NAHR ID"
                data-testid="input-nahr-id"
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
            Visa Medical Examination Booking
          </h1>
          <p className="text-xl text-gray-600">
            Book your medical examination in simple steps
          </p>
        </div>

        {renderStepIndicator()}
        {renderCurrentStep()}
      </div>
    </div>
  );
}