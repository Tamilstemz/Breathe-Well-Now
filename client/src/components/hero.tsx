import { Button } from "@/components/ui/button";
import { CalendarCheck, Info, Shield, Users, Clock, Award } from "lucide-react";
import doctorImage from "@assets/newpic1_1749587017199.png";
import { useLocation } from "wouter";
import { environment } from "../../../environment/environment";

export default function Hero() {
  const [, navigate] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
 <section id="home" className="hero-gradient py-16 lg:py-24 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-brand-purple/5 to-brand-teal/5" />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center"> {/* Changed */}
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
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 50);
            }}
            size="lg"
            className="card-gradient-blue text-white font-semibold text-lg transition-all duration-300 hover:scale-105 border-0"
          >
            <CalendarCheck className="mr-2 h-5 w-5" />
            Schedule Examination
          </Button>
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
</section>


  );
}
