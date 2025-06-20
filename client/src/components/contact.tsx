import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-16 gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-brand-teal/5 via-brand-orange/5 to-brand-purple/5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-snug">
            <span className="text-brand-black">Contact Us</span><br />
            <span className="text-brand-orange">Today</span>
          </h2>
          <p className="text-lg sm:text-xl text-brand-black max-w-3xl mx-auto px-2 sm:px-0">
            Ready to begin your Australia visa medical examination? Get in touch with our professional team for scheduling and information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-stretch">
          {/* Contact Info Column */}
          <div className="space-y-6 h-full flex flex-col">
            <div className="glass-effect p-4 sm:p-6 rounded-2xl shadow-lg border border-white/20 flex-1">
              <h3 className="text-base sm:text-xl font-bold text-brand-black mb-4">Get in Touch</h3>

              <div className="space-y-5">
                {/* Single Contact Item */}
                {[
                  {
                    icon: <MapPin className="text-white w-4 h-4 sm:w-5 sm:h-5" />,
                    title: "Location",
                    color: "orange",
                    text: `ND Diagnostics India Pvt. Ltd.\n2nd Floor,\nCoastal Chambers Building,\nMG Road, Ravipuram,\nKochi, Ernakulam,\nKerala – 682015, India.`,
                  },
                  {
                    icon: <Phone className="text-white w-4 h-4 sm:w-5 sm:h-5" />,
                    title: "Phone",
                    color: "blue",
                    text: `+91 9582-116116`,
                  },
                  {
                    icon: <Mail className="text-white w-4 h-4 sm:w-5 sm:h-5" />,
                    title: "Clinic Email",
                    color: "green",
                    text: `info@ndhealthcheck.com`,
                  },
                  {
                    icon: <Clock className="text-white w-4 h-4 sm:w-5 sm:h-5" />,
                    title: "Operating Hours",
                    color: "purple",
                    text: `Mon - Sat: 9:00 AM - 5:00 PM\nSunday: Closed`,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-2 sm:space-x-4 group">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 card-gradient-${item.color} rounded-xl flex-shrink-0 flex items-center justify-center shadow-neon-${item.color} group-hover:scale-105 transition-transform`}
                    >
                      {item.icon}
                    </div>
                    <div className="text-xs sm:text-sm">
                      <h4 className="font-semibold text-gray-900 group-hover:text-brand-{{item.color}} transition-colors text-sm sm:text-base mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>



          {/* Map Column */}
          <div className="space-y-8 h-full flex flex-col">
            <div className="glass-effect p-6 sm:p-8 rounded-2xl shadow-lg border border-white/20 flex-1">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-brand-black mb-2">Find Us on the Map</h3>
                <p className="text-base sm:text-lg text-brand-black">Located in the heart of Kochi for your convenience</p>
              </div>

              <div className="relative w-full h-[300px] sm:h-96 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31437.638865785142!2d76.256562215625!3d9.958495600000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0872b942241c03%3A0x49c6225df7635b28!2sCoastal%20Chambers!5e0!3m2!1sen!2sin!4v1748511161065!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ND Diagnostics India Location Map"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}