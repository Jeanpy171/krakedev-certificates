import { useState, useEffect } from "react";

const slides = [
  "https://images-ng.pixai.art/images/thumb/624f290c-a319-44b4-a57f-741da2157ffe",
  "https://s1.zerochan.net/Ganyu.600.3926887.jpg",
  "https://i.ebayimg.com/images/g/IGEAAOSwuVJkvH79/s-l1200.png",
];

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = 7000;

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, slideInterval);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <article className="relative w-full h-full overflow-hidden flex justify-center items-center">
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide}
          alt={`Slide ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
      >
        &#8249;
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
      >
        &#8250;
      </button>

      <span className="absolute bottom-4 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </span>
    </article>
  );
}
