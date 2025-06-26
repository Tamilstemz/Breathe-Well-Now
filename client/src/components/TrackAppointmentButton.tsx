import React from "react";
import { useNavigate } from "react-router-dom";
import { environment } from "../../../environment/environment";

const TrackAppointmentButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${environment.BASE_PATH}TrackAppointment`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="fixed top-60 right-6 z-50 group">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-3 py-2 text-white rounded-full shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
      >
        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm6-7l2 2 4-4"
          />
        </svg>

        {/* Hidden text, shown on hover */}
        <span className="overflow-hidden max-w-0 group-hover:max-w-[200px] group-hover:ml-1 transition-all duration-300 whitespace-nowrap">
          Track Appointment
        </span>
      </button>
    </div>
  );
};

export default TrackAppointmentButton;
