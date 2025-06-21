import { Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header"; // ✅ import here
import Footer from "@/components/footer"; // ✅ import here
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import AppointmentBooking from "./AppointmentBooking/AppointmentBooking";
import "bootstrap/dist/css/bootstrap.min.css";
// import { ToastContainer } from "react-toastify";
import { ToastContainer, toast } from "material-react-toastify";

import "material-react-toastify/dist/ReactToastify.css";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsofService";
import { environment } from "../../environment/environment";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="AppointmentBooking" element={<AppointmentBooking />} />
      <Route path="Privacy-Policy" element={<PrivacyPolicy />} />
      <Route path="Terms-Of-Use" element={<TermsOfUse />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* <Toaster /> */}
        <Toaster />
        <Header />
        <main className="min-h-screen bg-background">
          <Router />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </main>
        <Footer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
