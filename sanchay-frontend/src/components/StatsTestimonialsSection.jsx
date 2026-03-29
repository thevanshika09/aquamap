import { Droplets, ShieldCheck, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: <Droplets className="w-6 h-6" style={{ color: "#38bdf8" }} />,
    title: "Track Every Source",
    desc: "Map and monitor thousands of water bodies in real time — rivers, lakes, reservoirs, and groundwater — all in one place.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" style={{ color: "#38bdf8" }} />,
    title: "Early Warning System",
    desc: "Get alerted before droughts, floods, or contamination events occur. AI models predict risks weeks in advance.",
  },
  {
    icon: <Globe2 className="w-6 h-6" style={{ color: "#38bdf8" }} />,
    title: "Built for Scale",
    desc: "From village panchayats to national governments — AquaMap scales seamlessly across regions and jurisdictions.",
  },
];

export default function ClosingSection() {
  return (
    <section
      className="relative py-24 px-6 md:px-24 overflow-hidden text-white"
      style={{ background: "linear-gradient(160deg, #040d1a 0%, #061626 50%, #071e2e 100%)" }}
    >
      {/* Grid dot overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(56,189,248,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient glow blobs */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,116,144,0.16) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(3,105,161,0.14) 0%, transparent 70%)" }}
      />

      {/* ── Ticker bar ── */}
      <div
        className="relative overflow-hidden mb-20 rounded-2xl"
        style={{
          border: "1px solid rgba(6,182,212,0.12)",
          background: "rgba(4,13,26,0.7)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* pulse line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #22d3ee, transparent)" }}
        />
        <div className="h-16 flex items-center overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap text-xs font-semibold tracking-widest uppercase"
            style={{ color: "rgba(103,232,249,0.55)" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            {[
              "Water Conservation", "GIS Mapping", "Real-Time Monitoring",
              "AI Prediction", "Flood Alerts", "Sustainable Future",
              "AquaMap Platform", "Water Security", "Smart Analytics",
              "Government Support", "Water Conservation", "GIS Mapping",
              "Real-Time Monitoring", "AI Prediction", "Flood Alerts",
              "Sustainable Future", "AquaMap Platform", "Water Security",
            ].map((item, i) => (
              <span key={i} className="mx-10">
                <span style={{ color: "rgba(103,232,249,0.25)", marginRight: "40px" }}>·</span>
                {item}
              </span>
            ))}
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)" }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="h-px w-8" style={{ background: "rgba(6,182,212,0.6)" }} />
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#67e8f9" }}>
            Why AquaMap
          </p>
          <span className="h-px w-8" style={{ background: "rgba(6,182,212,0.6)" }} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          The Planet's Water Needs{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #38bdf8, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Intelligent
          </span>{" "}
          Guardians
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-16"
        >
          AquaMap gives communities, researchers, and governments the tools to
          monitor, protect, and preserve water resources — before it's too late.
        </motion.p>

        {/* Benefit cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl text-left transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(6,182,212,0.12)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid rgba(6,182,212,0.38)";
                e.currentTarget.style.background = "rgba(6,182,212,0.06)";
                e.currentTarget.style.boxShadow = "0 0 28px rgba(6,182,212,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "1px solid rgba(6,182,212,0.12)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="mb-4 p-3 inline-flex rounded-xl"
                style={{
                  background: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.2)",
                }}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Final CTA block ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-10 md:p-16 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(6,182,212,0.15)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.1) 0%, transparent 65%)",
            }}
          />
          {/* top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)" }}
          />

          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#67e8f9" }}>
              Get Started Today
            </p>
            <h3
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Every Drop Counts.{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #38bdf8, #67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Start Mapping.
              </span>
            </h3>
            <p className="text-slate-400 max-w-xl mx-auto mb-10 text-base leading-relaxed">
              Join thousands of water conservation teams already using AquaMap to
              safeguard the world's most precious resource.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(6,182,212,0.5)" }}
                  whileTap={{ scale: 0.96 }}
                  className="px-9 py-3.5 rounded-full text-white font-semibold text-sm transition-all"
                  style={{
                    background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #06b6d4 100%)",
                    boxShadow: "0 0 20px rgba(6,182,212,0.28)",
                  }}
                >
                  Start Monitoring →
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.07)" }}
                  whileTap={{ scale: 0.96 }}
                  className="px-9 py-3.5 rounded-full font-semibold text-sm text-slate-200 transition-all"
                  style={{
                    border: "1px solid rgba(148,163,184,0.25)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Footer line ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C5.5 1.5 2.5 4.5 2.5 8C2.5 11.5 5 14.5 8 14.5C11 14.5 13.5 11.5 13.5 8C13.5 4.5 10.5 1.5 8 1.5Z" stroke="white" strokeWidth="1.2"/>
                <path d="M8 5V9M6 7H10" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ color: "rgba(148,163,184,0.5)" }}>© 2025 AquaMap. All rights reserved.</span>
          </div>
          <div className="flex gap-6" style={{ color: "rgba(148,163,184,0.4)" }}>
            {["Privacy", "Terms", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="hover:text-slate-300 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Syne font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />
    </section>
  );
}