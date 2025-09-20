import { motion } from 'framer-motion';
import FloatingShape from '../components/FloatingShape';

const CtaSection = () => (
 <section 
      id="cta" 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden py-20"
    >
      {/* Floating background shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="10%" left="5%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="60%" left="75%" delay={0.5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="30%" left="85%" delay={0.8} />
    <div className="container mx-auto px-6 text-center">
      <motion.div 
        initial={{ scale: 0.95 }}
        whileInView={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gray-800/30 backdrop-blur-lg p-12 rounded-3xl border border-emerald-500/20 inline-block"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to <span className="text-emerald-300">Secure</span> Your Finances?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            Get Started Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-transparent border-2 border-emerald-500 text-white font-medium rounded-full hover:bg-emerald-900/30 transition-all"
          >
            See How It Works
          </motion.button>
        </div>
        <p className="text-gray-400 mt-6">
          Join 10,000+ protected users today
        </p>
      </motion.div>
    </div>
  </section>
);

export default CtaSection;