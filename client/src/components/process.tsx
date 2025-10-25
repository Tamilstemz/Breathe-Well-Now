const processSteps = [
  {
    number: "1",
    title: "Book Appointment",
    description:
      "Schedule your examination online or by phone. We'll provide all necessary forms and instructions.",
    bgColor: "card-gradient-orange",
  },
  {
    number: "2",
    title: "Arrive & Register",
    description:
      "Arrive at our facility with required documents. Our staff will guide you through the registration process.",
    bgColor: "card-gradient-blue",
  },
  {
    number: "3",
    title: "Complete Examination",
    description:
      "Undergo comprehensive medical examination including physical assessment, imaging, and laboratory tests.",
    bgColor: "card-gradient-green",
  },
  {
    number: "4",
    title: "Results Submission",
    description: "Results are directly submitted to the eMedical system.",
    bgColor: "card-gradient-purple",
  },
];

export default function Process() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal/10 via-brand-blue/8 to-brand-orange/6"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-brand-black">Simple 4-Step</span>
            <br />
            <span className="text-brand-orange">Examination Process</span>
          </h2>
          <p className="text-xl text-brand-black max-w-3xl mx-auto">
            Our streamlined process ensures your visa medical examination is
            completed efficiently and professionally.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center group">
              <div
                className={`w-24 h-24 ${step.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-8 text-white text-3xl font-bold shadow-colorful transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 animate-bounce-slow animate-rainbow`}
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-4 group-hover:text-brand-orange transition-colors">
                {step.title}
              </h3>
              <p className="text-brand-black leading-relaxed group-hover:text-brand-orange transition-colors">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 text-center">
          <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto border border-white/20 shadow-colorful animate-glow">
            <h3 className="text-2xl font-bold text-brand-black mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-brand-black mb-6">
              Book your appointment today and complete your Medical visa medical examination with confidence.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById("contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="card-gradient-blue text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-neon-blue transition-all duration-300 hover:scale-110 hover:shadow-colorful border-0 animate-bounce-slow"
            >
              Schedule Now
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
}
