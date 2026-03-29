import { motion } from "framer-motion";
import { Waves, Satellite, MapPinned, CloudRain, FlaskConical, BrainCircuit } from "lucide-react";
import SplineBackground from "./SplineBackground";
import FlipCard from "../components/FlipCard";

const FeatureCard = ({ icon, title, desc, delay, origin }) => (
  <motion.div
    initial={{ rotateY: 90, opacity: 0, [origin]: -100 }}
    whileInView={{ rotateY: 0, opacity: 1, [origin]: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="p-6 rounded-2xl transition-all duration-300 shadow-xl group"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(6,182,212,0.12)",
      backdropFilter: "blur(10px)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.border = "1px solid rgba(6,182,212,0.4)";
      e.currentTarget.style.background = "rgba(6,182,212,0.06)";
      e.currentTarget.style.boxShadow = "0 0 24px rgba(6,182,212,0.12)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.border = "1px solid rgba(6,182,212,0.12)";
      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div className="flex items-start gap-4">
      <div
        className="p-3 rounded-xl flex-shrink-0"
        style={{
          background: "rgba(6,182,212,0.1)",
          border: "1px solid rgba(6,182,212,0.2)",
        }}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white mb-1.5">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  </motion.div>
);

const FeatureSection = () => {
  const features = [
    {
      icon: <Waves className="w-7 h-7" style={{ color: "#38bdf8" }} />,
      title: "Real-Time Water Monitoring",
      desc: "Live tracking of river flow, lake levels, and groundwater depth via IoT sensor networks.",
      origin: "x",
    },
    {
      icon: <Satellite className="w-7 h-7" style={{ color: "#38bdf8" }} />,
      title: "Satellite GIS Mapping",
      desc: "High-resolution satellite imagery layered with hydrological data for precise source mapping.",
      origin: "y",
    },
    {
      icon: <MapPinned className="w-7 h-7" style={{ color: "#38bdf8" }} />,
      title: "Source Geolocation",
      desc: "Pin and track every water body — wells, rivers, reservoirs — with GPS-accurate coordinates.",
      origin: "x",
    },
    {
      icon: <CloudRain className="w-7 h-7" style={{ color: "#38bdf8" }} />,
      title: "Flood & Drought Alerts",
      desc: "Early warning system for extreme water events using predictive atmospheric models.",
      origin: "y",
    },
    {
      icon: <FlaskConical className="w-7 h-7" style={{ color: "#38bdf8" }} />,
      title: "Water Quality Analysis",
      desc: "Continuous monitoring of pH, turbidity, and contamination levels across all mapped sources.",
      origin: "x",
    },
    {
      icon: <BrainCircuit className="w-7 h-7" style={{ color: "#38bdf8" }} />,
      title: "AI Prediction Engine",
      desc: "Machine learning models forecasting scarcity, demand shifts, and contamination risks.",
      origin: "y",
    },
  ];

  return (
    <section
      id="features"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24"
      style={{ background: "linear-gradient(160deg, #040d1a 0%, #061626 50%, #071e2e 100%)" }}
    >
      {/* Spline background */}
      <SplineBackground />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(4,13,26,0.78) 0%, rgba(6,22,38,0.55) 50%, rgba(4,13,26,0.85) 100%)",
        }}
      />

      {/* Grid dot overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(56,189,248,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient blobs */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(14,116,144,0.16) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(3,105,161,0.14) 0%, transparent 70%)" }}
      />

      <FlipCard />

      {/* Content */}
      <div className="container mx-auto px-6 z-10 relative">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="h-px w-8" style={{ background: "rgba(6,182,212,0.6)" }} />
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#67e8f9" }}
            >
              Platform Capabilities
            </p>
            <span className="h-px w-8" style={{ background: "rgba(6,182,212,0.6)" }} />
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span
              style={{
                background: "linear-gradient(90deg, #38bdf8, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI-Powered
            </span>{" "}
            Water Intelligence
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            A multi-layered platform combining real-time sensors, satellite GIS data, and
            machine learning to safeguard every water source.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>

      <FlipCard />

      {/* Syne font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />
    </section>
  );
};

export default FeatureSection;