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

/* ─── Scan line ───────────────────────────── */
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

/* ─── Stat card ─────────────────────────── */
function StatCard({ value, to, suffix, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="flex flex-col items-center px-6 py-4 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm"
    >
      <span className="text-3xl font-bold text-white">
        {to !== undefined ? <Counter to={to} suffix={suffix} /> : value}
      </span>
      <span className="text-xs text-cyan-400/70 mt-1 uppercase">{label}</span>
    </motion.div>
  );
}

/* ─── Hero ──────────────────────────────── */
const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      
      <RippleCanvas />
      <ScanLine />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Future of Water
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 mb-10"
        >
          Smart water monitoring using AI & GIS
        </motion.p>

        {/* ✅ FIXED BUTTON */}
        <div className="flex gap-4">
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 bg-cyan-500 text-white rounded-full"
            >
              Start Monitoring →
            </motion.button>
          </Link>

          <Link to="/about">
            <button className="px-8 py-3 border border-white text-white rounded-full">
              About
            </button>
          </Link>
        </div>

        <div className="flex gap-6 mt-16">
          <StatCard to={10} suffix="K+" label="Sources" />
          <StatCard value="24/7" label="Monitoring" />
          <StatCard to={98} suffix="%" label="Accuracy" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;