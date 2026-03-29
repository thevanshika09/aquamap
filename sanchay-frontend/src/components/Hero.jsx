import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* ─── Animated counter ─────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    suffix === "K+" ? `${Math.round(v)}K+` : suffix ? `${v}${suffix}` : `${Math.round(v)}`
  );
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(count, to, { duration: 2, ease: "easeOut" });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, []);

  return <motion.span>{display}</motion.span>;
}

/* ─── Ripple canvas background ─────────────────────────── */
function RippleCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cols = 24;
      const rows = 12;
      const cw = width / cols;
      const rh = height / rows;

      for (let x = 0; x <= cols; x++) {
        for (let y = 0; y <= rows; y++) {
          const wave = Math.sin((x * 0.4 + t) * 1.1) * Math.cos((y * 0.4 + t) * 0.9);
          const px = x * cw;
          const py = y * rh + wave * 8;
          const alpha = 0.06 + Math.abs(wave) * 0.08;

          ctx.beginPath();
          ctx.arc(px, py, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56,189,248,${alpha})`;
          ctx.fill();
        }
      }
      t += 0.012;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

/* ─── Thin animated scan line ───────────────────────────── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none"
      initial={{ top: "0%" }}
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Stat card ─────────────────────────────────────────── */
function StatCard({ value, to, suffix, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="flex flex-col items-center px-6 py-4 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm"
    >
      <span className="text-3xl font-bold text-white tracking-tight tabular-nums">
        {to !== undefined ? <Counter to={to} suffix={suffix} /> : value}
      </span>
      <span className="text-xs text-cyan-400/70 mt-1 tracking-widest uppercase">{label}</span>
    </motion.div>
  );
}

/* ─── Hero ──────────────────────────────────────────────── */
const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg, #040d1a 0%, #061626 40%, #071e2e 100%)" }}
    >
      {/* Grid dot overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(56,189,248,0.07) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ripple dots canvas */}
      <RippleCanvas />

      {/* Scan line */}
      <ScanLine />

      {/* Ambient glow blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,116,144,0.18) 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(3,105,161,0.14) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-32 text-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium tracking-widest uppercase"
          style={{
            border: "1px solid rgba(6,182,212,0.3)",
            background: "rgba(6,182,212,0.07)",
            color: "#67e8f9",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Smart Water Intelligence · Live Now
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="text-white">Mapping the</span>{" "}
          <span style={{
            background: "linear-gradient(90deg, #38bdf8 0%, #22d3ee 40%, #67e8f9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Future
          </span>
          <br />
          <span className="text-white">of Our</span>{" "}
          <span style={{
            background: "linear-gradient(90deg, #0ea5e9 0%, #38bdf8 60%, #7dd3fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Water
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
        >
          Track, monitor, and protect water resources using{" "}
          <span className="text-slate-200">GIS mapping</span>, real-time data, and{" "}
          <span className="text-slate-200">AI-powered environmental insights</span> for a sustainable future.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <Link to="/Dashboard">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(6,182,212,0.45)" }}
              whileTap={{ scale: 0.96 }}
              className="px-9 py-3.5 rounded-full text-white font-semibold text-base transition-all"
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #06b6d4 100%)",
                boxShadow: "0 0 20px rgba(6,182,212,0.25)",
              }}
            >
              Start Monitoring →
            </motion.button>
          </Link>

          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.96 }}
              className="px-9 py-3.5 rounded-full font-semibold text-base text-slate-200 transition-all"
              style={{
                border: "1px solid rgba(148,163,184,0.25)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              See How It Works
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 justify-center">
          <StatCard to={10} suffix="K+" label="Sources Mapped" delay={0.5} />
          <StatCard value="24/7" label="Live Monitoring" delay={0.6} />
          <StatCard to={98} suffix="%" label="Prediction Accuracy" delay={0.7} />
          <StatCard to={140} suffix="+" label="Gov. Partners" delay={0.8} />
        </div>
      </div>

      {/* ── BOTTOM TICKER ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-14 flex items-center overflow-hidden"
        style={{
          borderTop: "1px solid rgba(6,182,212,0.12)",
          background: "rgba(4,13,26,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Pulse line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #22d3ee, transparent)" }} />

        <motion.div
          className="flex gap-0 whitespace-nowrap text-xs font-medium tracking-widest uppercase"
          style={{ color: "rgba(103,232,249,0.55)" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {[
            "Water Conservation", "GIS Mapping", "Real-Time Monitoring",
            "AI Prediction", "Environmental Intelligence", "Sustainable Future",
            "AquaMap Platform", "Water Security", "Smart Analytics",
            "Government Support", "Water Conservation", "GIS Mapping",
            "Real-Time Monitoring", "AI Prediction", "Environmental Intelligence",
            "Sustainable Future", "AquaMap Platform", "Water Security",
          ].map((item, i) => (
            <span key={i} className="mx-10">
              <span className="text-cyan-400/40 mr-10">·</span>
              {item}
            </span>
          ))}
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

export default HeroSection;