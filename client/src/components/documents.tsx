import { FileText, IdCard, Heart, Clipboard, Shield, CheckCircle } from "lucide-react";

export default function Documents() {
  const requiredDocuments = [
    {
      category: "Identity Documents",
      icon: IdCard,
      color: "card-gradient-blue",
      shadowColor: "shadow-neon-blue",
      documents: [
        "Valid passport with at least 6 months validity",
        "Birth certificate (original or certified copy)",
        "Marriage certificate (if applicable)",
        "Divorce decree (if applicable)",
        "Change of name certificate (if applicable)"
      ]
    },
    {
      category: "Medical History",
      icon: Heart,
      color: "card-gradient-pink",
      shadowColor: "shadow-neon-pink",
      documents: [
        "Previous medical examination reports",
        "Vaccination records and certificates",
        "Prescription medications list",
        "Surgical history documentation",
        "Specialist reports (if any chronic conditions)"
      ]
    },
    {
      category: "Visa Application",
      icon: Clipboard,
      color: "card-gradient-orange",
      shadowColor: "shadow-neon-orange",
      documents: [
        "eMedical referral letter from immigration",
        "HAP ID (Health Assessment Program ID)",
        "Visa application receipt",
        "Migration agent authorization (if applicable)",
        "Family unit applications (if group booking)"
      ]
    },
    {
      category: "Additional Requirements",
      icon: Shield,
      color: "card-gradient-purple",
      shadowColor: "shadow-neon-purple",
      documents: [
        "Photo identification (driver's license)",
        "Recent passport-sized photographs",
        "Contact details of Australian sponsor",
        "Emergency contact information",
        "Payment for examination fees"
      ]
    }
  ];

  const importantNotes = [
    "All documents must be original or certified copies",
    "Documents in languages other than English must be translated",
    "Bring your eMedical referral letter for examination",
    "Arrive 15 minutes early for your appointment",
    "Fasting required for blood tests (8-12 hours)",
    "Bring comfortable clothing for chest X-ray"
  ];

  return (
    <section id="documents" className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-brand-blue/5 to-brand-purple/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-brand-black">Documents Required</span><br/>
            </h2>
          <p className="text-xl text-brand-black max-w-3xl mx-auto">
            Please ensure you bring the following documents for your Australia visa medical examination. Having all required documents will ensure a smooth and efficient process.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {requiredDocuments.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="glass-effect border border-white/20 rounded-2xl p-8 hover:shadow-colorful transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-glow">
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-6 ${category.shadowColor} group-hover:animate-rainbow`}>
                  <IconComponent className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-4 group-hover:text-brand-orange transition-colors">{category.category}</h3>
                <ul className="space-y-3 text-sm text-brand-black">
                  {category.documents.map((document, docIndex) => (
                    <li key={docIndex} className="flex items-start group-hover:text-brand-orange transition-colors">
                      <div className="w-5 h-5 card-gradient-green rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <CheckCircle className="text-white h-3 w-3" />
                      </div>
                      {document}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        
        <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto border border-white/20 shadow-colorful animate-glow">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 card-gradient-teal rounded-xl flex items-center justify-center mr-4 shadow-neon-teal">
              <FileText className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-brand-black">Important Notes</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {importantNotes.map((note, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-5 h-5 card-gradient-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="text-white h-3 w-3" />
                </div>
                <span className="text-brand-black leading-relaxed">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}