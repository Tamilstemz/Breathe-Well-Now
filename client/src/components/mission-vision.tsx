import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/5 via-brand-blue/5 to-brand-green/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-brand-black">Our Mission & Vision</span>
            </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="glass-effect p-8 rounded-2xl shadow-lg border border-white/20 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 card-gradient-blue rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Target className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-brand-black group-hover:text-brand-orange transition-colors">Mission</h3>
            </div>
            <p className="text-lg text-brand-black leading-relaxed">
              To provide authorized, accurate, and compassionate medical services tailored for Australia visa applicants with speed and professionalism.
            </p>
          </div>
          
          <div className="glass-effect p-8 rounded-2xl shadow-lg border border-white/20 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 card-gradient-purple rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Eye className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-brand-black group-hover:text-brand-orange transition-colors">Vision</h3>
            </div>
            <p className="text-lg text-brand-black leading-relaxed">
              To be the most trusted and efficient clinic recognized nationally for delivering hassle-free visa medical services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}