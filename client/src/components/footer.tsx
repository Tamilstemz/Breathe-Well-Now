import { HeartPulse, MapPin, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import logoPath from "@assets/ND India Logo-01 (1)_1749586357933.png";
import { useLocation } from "wouter";
import { environment } from "../../../environment/environment";

export default function Footer() {
  const [, navigate] = useLocation();




   const scrollToSection = (sectionId: string) => {

    const getDynamicOffset = (id: string): number => {
      const header = document.getElementById(id); // updated to use ID
      if (header) {
        const computedStyle = getComputedStyle(header);
        const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
        return Math.round( marginBottom + paddingBottom + 70);
      }
      return 100; // fallback
    };

    const getElementPosition = (element: HTMLElement): number => {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const clientTop = document.documentElement.clientTop || 0;
      return rect.top + scrollTop - clientTop;
    };

    const scrollWithOffset = (id: string, retries = 10) => {
      const element = document.getElementById(id);
      const offset = getDynamicOffset(id);

      if (element) {
        const elementTop = getElementPosition(element);
        const offsetTop = Math.max(0, elementTop - offset);


        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      } else if (retries > 0) {
        console.log(`Element #${id} not found. Retrying... (${retries})`);
        setTimeout(() => scrollWithOffset(id, retries - 1), 300);
      } else {
        console.warn(`Failed to find section: #${id}`);
      }
    };

    if (window.location.pathname !== environment.BASE_PATH) {
      navigate(environment.BASE_PATH);
      setTimeout(() => {
        scrollWithOffset(sectionId);
      }, 500);
    } else {
      setTimeout(() => {
        scrollWithOffset(sectionId);
      }, 300);
      
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={logoPath}
                alt="ND Diagnostics India Logo"
                className="h-20 w-auto"
              />
              <div>
                <p className="text-gray-400">Australia Visa Medical Centre</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-lg">
              Your trusted partner for Australia visa medical examinations.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-0 sm:space-x-20">
              {/* Social Media Icons */}
              <div className="flex items-center space-x-4 justify-center sm:justify-start">
                <a
                  href="#"
                  className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
                >
                  <FaFacebookF className="text-sm sm:text-base" />
                </a>
                <a
                  href="#"
                  className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
                >
                  <FaTwitter className="text-sm sm:text-base" />
                </a>
                <a
                  href="#"
                  className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
                >
                  <FaLinkedinIn className="text-sm sm:text-base" />
                </a>
                <a
                  href="#"
                  className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors"
                >
                  <FaInstagram className="text-sm sm:text-base" />
                </a>
              </div>

              <div className="flex flex-col items-center sm:items-end">
                <span
                  style={{ whiteSpace: "nowrap" }}
                  className="text-xs font-semibold text-gray-400 mb-1"
                >
                  Location QR
                </span>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://maps.app.goo.gl/NkSRtp3rFNMoBDFQ6"
                  alt="Google Maps Location QR Code"
                  className="w-[60px] sm:w-[70px] h-[50px] sm:h-[60px] rounded-lg bg-white/10 p-1 hover:bg-white/20 transition-all duration-300"
                />
              </div>



            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
               <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </button>
              </li>


               <li>
                <button
                  onClick={() => scrollToSection("documents")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Documents Required
                </button>
              </li>
             
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate(`${environment.BASE_PATH}AppointmentBooking`);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 50);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Book Appointment
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-3">
               <li className="flex gap-3">
                <MapPin className="text-brand-orange h-6 w-6 flex-shrink-0" />
                <span className="text-gray-400">
                  ND Diagnostics India Pvt Ltd, 2nd Floor, Coastal Chambers
                  Building, MG Road, Ravipuram, Kochi Ernakulam,Kerala - 682015
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-orange h-6 w-6 flex-shrink-0" />
                <a href="tel:+919582116116" className="text-gray-400">
                  +91 9582-116116
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-orange h-6 w-6 flex-shrink-0" />
                <a
                  href="mailto:info@ndhealthcheck.com"
                  className="text-gray-400"
                >
                  info@ndhealthcheck.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex lg:flex-row md:flex-col md:gap-4 justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              ©2025 ND Diagnostics India Private Limited. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-6">
              <button
                onClick={() => {
                  navigate(`${environment.BASE_PATH}Privacy-Policy`);
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 50);
                }}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => {
                  navigate(`${environment.BASE_PATH}Terms-Of-Use`);
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 50);
                }}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </button>
              <a
                href="https://www.emedical.immi.gov.au/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
                target="_blank"
              >
                eMedical Portal
              </a>
              <a
                href="https://www.homeaffairs.gov.au/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
                target="_blank"
              >
                DHA
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
