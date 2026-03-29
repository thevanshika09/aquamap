import { motion } from "framer-motion";
import { Waves, Users, MapPin, BrainCircuit } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20"
    >
      {/* Static image background — matches the "SAVE WATER !!" Spline scene */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/water.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay — light enough to let the image show clearly */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(4,13,26,0.52) 0%, rgba(6,22,38,0.28) 50%, rgba(4,13,26,0.60) 100%)",
        }}
      />

      {/* Ambient glow blobs */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(14,116,144,0.18) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(3,105,161,0.14) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left column — empty, image text "SAVE WATER !!" fills left side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2 w-full"
          />

          {/* Right Column — Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8" style={{ background: "rgba(6,182,212,0.6)" }} />
              <p
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#67e8f9" }}
              >
                About AquaMap
              </p>
              <span className="h-px w-8" style={{ background: "rgba(6,182,212,0.6)" }} />
            </div>

            {/* Heading */}
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Protecting{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #38bdf8, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Every Drop
              </span>
              ,{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #0ea5e9, #7dd3fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Every Source
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              AquaMap is more than a mapping platform — it's an intelligent water
              conservation companion. Built for governments, researchers, and communities,
              it combines{" "}
              <span className="text-slate-100">GIS mapping</span>,{" "}
              <span className="text-slate-100">real-time IoT sensor data</span>, and{" "}
              <span className="text-slate-100">AI-driven predictions</span> to track,
              monitor, and protect water resources before scarcity strikes.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                {
                  icon: <Waves className="w-5 h-5" style={{ color: "#38bdf8" }} />,
                  title: "Live Water Tracking",
                  desc: "Real-time monitoring of rivers, lakes, and groundwater levels via IoT sensors.",
                },
                {
                  icon: <Users className="w-5 h-5" style={{ color: "#38bdf8" }} />,
                  title: "Community Reporting",
                  desc: "Crowdsourced water issue reports with verified community insights.",
                },
                {
                  icon: <MapPin className="w-5 h-5" style={{ color: "#38bdf8" }} />,
                  title: "GIS Mapping",
                  desc: "Precise geographic mapping of all water bodies and distribution networks.",
                },
                {
                  icon: <BrainCircuit className="w-5 h-5" style={{ color: "#38bdf8" }} />,
                  title: "AI Prediction",
                  desc: "Machine learning models to forecast droughts, floods, and contamination risks.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-5 rounded-2xl transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(6,182,212,0.12)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(6,182,212,0.35)";
                    e.currentTarget.style.background = "rgba(6,182,212,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(6,182,212,0.12)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{
                        background: "rgba(6,182,212,0.1)",
                        border: "1px solid rgba(6,182,212,0.2)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-white mb-1 text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(6,182,212,0.45)" }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-3 rounded-full text-white font-semibold text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #06b6d4 100%)",
                boxShadow: "0 0 20px rgba(6,182,212,0.25)",
              }}
            >
              Learn More About Our Mission
            </motion.button>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24 rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(6,182,212,0.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="h-px w-full mb-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)" }}
          />
         
          <div
            className="h-px w-full mt-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)" }}
          />
        </motion.div>
      </div>

      {/* Syne font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />
    </section>
  );
};

export default About;