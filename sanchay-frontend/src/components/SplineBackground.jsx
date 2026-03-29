// src/components/SplineBackground.jsx
import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Spline scene="https://prod.spline.design/8cRTKZQXG5Efkz39/scene.splinecode" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
    </div>
  );
};

export default SplineBackground;
