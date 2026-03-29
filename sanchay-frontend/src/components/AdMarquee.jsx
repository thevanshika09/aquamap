// src/components/AdMarquee.jsx
export default function AdMarquee() {
  const ads = [
    '../assets/react.svg',
    
   
    // Add more ad image URLs here
  ];

  return (
    <div className="w-full overflow-hidden bg-black py-4">
      <div className="flex animate-marquee space-x-12">
        {ads.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`ad-${index}`}
            className="h-12 w-auto object-contain"
          />
        ))}

        {/* Duplicate set of ads for seamless loop */}
        {ads.map((src, index) => (
          <img
            key={`clone-${index}`}
            src={src}
            alt={`ad-clone-${index}`}
            className="h-12 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  );
}
