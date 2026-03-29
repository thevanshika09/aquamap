import React from "react";
import Spline from "@splinetool/react-spline";

const SplineAnimation = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Spline scene="https://prod.spline.design/WMlKSehlPFORpdHy/scene.splinecode" />
    </div>
  );
};

export default SplineAnimation;
