import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

const FlipCard = ({ image, message }) => {
  const [flipped, setFlipped] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      onClick={() => setFlipped(!flipped)}
      className="w-40 h-56 mx-auto cursor-pointer [perspective:1000px]"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front Side */}
        <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full bg-emerald-800 text-white text-sm rounded-lg p-2 flex items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p>{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FlipCard;
