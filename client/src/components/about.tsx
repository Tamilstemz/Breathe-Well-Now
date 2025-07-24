import { Building, IdCard, Laptop } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/5 via-brand-blue/5 to-brand-orange/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                <span className="text-brand-black">
                  Your Trusted Medical Partner
                </span>
                <br />
                <span className="text-brand-orange">
                  for Australia Immigration
                </span>
              </h2>
              <div className="text-lg text-brand-black leading-relaxed space-y-4">
                <p>
                  Welcome to ND DIAGNOSTICS INDIA PRIVATE LIMITED, specialists
                  in Medical Examinations for Australia Visa Applicants.
                </p>

                <p>
                  We are an accredited medical centre authorized to conduct visa
                  medical exams for Australia. We comply with the Department of
                  Home Affairs requirements.
                </p>

                <p>
                  Our clinic is purpose-built for Australia's health assessment
                  needs, meeting strict medical, IT, and privacy protocols.
                </p>

                <p>
                  With experienced physicians, modern diagnostics, and
                  multilingual support, we ensure top care without delays or
                  confusion.
                </p>

                <p>
                  We are committed to professionalism, privacy, and patient
                  comfort.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 card-gradient-blue rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <IdCard className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-black mb-2 group-hover:text-brand-orange transition-colors">
                    Government Accredited
                  </h3>
                  <p className="text-brand-black leading-relaxed">
                    We maintain full compliance with all government requirements
                    and undergo regular audits to ensure the highest standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 card-gradient-green rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Laptop className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-black mb-2 group-hover:text-brand-orange transition-colors">
                    Digital Excellence
                  </h3>
                  <p className="text-brand-black leading-relaxed">
                    Our advanced IT systems ensure secure data handling and
                    seamless integration with Australian immigration processes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 card-gradient-purple rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Building className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-black mb-2 group-hover:text-brand-orange transition-colors">
                    Purpose-Built Facility
                  </h3>
                  <p className="text-brand-black leading-relaxed">
                    Our clinic is specifically designed for Australia's health
                    assessment needs, meeting strict medical, IT, and privacy
                    protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="glass-effect p-8 rounded-2xl shadow-lg border border-white/20">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="group">
                  <div className="text-3xl font-bold text-brand-orange group-hover:scale-110 transition-transform">15+</div>
                  <div className="text-sm text-brand-black font-medium">Years Experience</div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-brand-orange group-hover:scale-110 transition-transform">25,000+</div>
                  <div className="text-sm text-brand-black font-medium">Patients Served</div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-brand-orange group-hover:scale-110 transition-transform">99.8%</div>
                  <div className="text-sm text-brand-black font-medium">Success Rate</div>
                </div>
              </div>
            </div> */}
          </div>

          <div className="space-y-6">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
              alt="Professional medical team in modern clinic setting"
              className="rounded-xl shadow-lg w-full"
            />

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
                alt="Modern diagnostic equipment in medical facility"
                className="rounded-lg shadow-md w-full h-32 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
                alt="Clean medical examination room"
                className="rounded-lg shadow-md w-full h-32 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
