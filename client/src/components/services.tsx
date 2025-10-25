import { Stethoscope, X as XRay, TestTube, FileText, UserRound, Languages, Check } from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Physical Examination",
    description: "Comprehensive physical assessment including cardiovascular, respiratory, and neurological examinations by experienced physicians.",
    features: ["General Health Assessment", "Vital Signs Monitoring", "Medical History Review"],
    bgColor: "bg-light-blue",
    iconColor: "text-white",
    cardGradient: "card-gradient-blue"
  },
  {
    icon: XRay,
    title: "Diagnostic Imaging",
    description: "State-of-the-art imaging equipment for chest X-rays and other required diagnostic procedures.",
    features: ["Digital Chest X-Ray", "High-Resolution Imaging", "Immediate Results"],
    bgColor: "bg-light-orange",
    iconColor: "text-white",
    cardGradient: "card-gradient-orange"
  },
  {
    icon: TestTube,
    title: "Laboratory Tests",
    description: "Comprehensive blood and urine tests conducted in our fully equipped laboratory with rapid processing.",
    features: ["Blood Chemistry Panel", "Infectious Disease Screening", "Urinalysis"],
    bgColor: "bg-light-purple",
    iconColor: "text-white",
    cardGradient: "card-gradient-purple"
  },

  {
    icon: UserRound,
    title: "Expert Consultation",
    description: "Consultation with experienced physicians who specialize in immigration medical examinations.",
    features: ["Specialized Immigration Medicine", "Detailed Medical Reports", "Follow-up Support"],
    bgColor: "bg-light-pink",
    iconColor: "text-white",
    cardGradient: "card-gradient-pink"
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description: "Professional staff fluent in multiple languages to ensure clear communication throughout your examination.",
    features: ["English & Malayalam", "Hindi & Tamil", "Clear Communication"],
    bgColor: "bg-light-green",
    iconColor: "text-white",
    cardGradient: "card-gradient-green"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-16 gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-brand-purple/5 to-brand-teal/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-brand-black">Complete Medical Visa</span><br/>
            <span className="text-brand-orange">Medical Services</span>
          </h2>
          <p className="text-xl text-brand-black max-w-3xl mx-auto">
            Our comprehensive medical examination process ensures compliance with all Department of Home Affairs requirements while providing exceptional patient care.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="glass-effect border border-white/20 rounded-2xl p-8 hover:shadow-colorful transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-glow">
                <div className={`w-16 h-16 ${service.cardGradient} rounded-2xl flex items-center justify-center mb-6 shadow-neon-${index % 2 === 0 ? 'blue' : 'orange'} group-hover:animate-rainbow`}>
                  <IconComponent className={`${service.iconColor} text-2xl`} />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-4 group-hover:text-brand-orange transition-colors">{service.title}</h3>
                <p className="text-brand-black mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3 text-sm text-brand-black">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center group-hover:text-brand-orange transition-colors">
                      <div className="w-5 h-5 card-gradient-green rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="text-white h-3 w-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
