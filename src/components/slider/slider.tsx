import { useState, useEffect } from "react";
import krakedevLetters from "../../assets/krakedev-letters.png";
import interschool_3 from "../../assets/interschool-3.png";

const slides = [krakedevLetters, interschool_3];

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

  const buttonSliderClassname =
    "absolute top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 w-10 rounded-full hover:bg-opacity-75";

  return (
    <article className="relative w-full h-full overflow-hidden flex justify-center items-center">
      <ul
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <li
            key={slide + "_" + index}
            className="absolute top-0 left-0 w-full h-full"
            style={{
              transform: `translateX(${index * 100}%)`,
            }}
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </li>
        ))}
      </ul>

      <button onClick={handlePrev} className={buttonSliderClassname + " left-4"}>
        &#8249;
      </button>
      <button onClick={handleNext} className={buttonSliderClassname + " right-4"}>
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
