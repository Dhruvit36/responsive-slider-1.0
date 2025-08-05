import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";   // Fix for the swiper not working with images

const animationPresets = {
  fade: (el) => gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.6 }),
  slideIn: (el) =>
    gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.6 }),
  zoom: (el) =>
    gsap.fromTo(
      el,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, delay: 0.6 }
    ),
  kenburns: (el) => gsap.fromTo(el, { scale: 1.1 }, { scale: 1, duration: 3, delay: 0.6 }),
};

const App = () => {
  const [slides, setSlides] = useState([]);
  const [autoplay, setAutoplay] = useState({ enabled: true, delay: 5000 });

  useEffect(() => {
    fetch("/slides.json")
      .then((res) => res.json())
      .then(({ slides, autoplay }) => {
        setSlides(slides);
        setAutoplay(autoplay || { enabled: true, delay: 5000 });
      })
      .catch((error) => {
        console.error("Error loading slides:", error);
      });
  }, []);

  const animateSlide = () => {
    const current = document.querySelector(".swiper-slide-active");
    const anim = current?.getAttribute("data-animation") || "slideIn";
    animationPresets[anim]?.(current.querySelector(".title"));
    animationPresets[anim]?.(current.querySelector(".subtitle"));
    animationPresets[anim]?.(current.querySelector(".cta"));
  };

  return (
    <div className="w-full h-screen">
      {slides.length > 0 ? (
        <Swiper
          loop={true}
          modules={[Navigation, Pagination, Autoplay]}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={
            autoplay.enabled
              ? { delay: autoplay.delay, disableOnInteraction: false }
              : false
          }
          spaceBetween={0}
          slidesPerView={1}
          speed={600}
          touchRatio={1}
          touchAngle={45}
          simulateTouch={true}
          allowTouchMove={true}
          onSlideChangeTransitionStart={animateSlide}
          onSwiper={(swiper) => {}}
          className="w-full h-screen"
        >
          {slides.map((slide, i) => (
            <SwiperSlide
              key={i}
              className="flex items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
              data-animation={slide.animation || "slideIn"}
            >
              <div className="text-center px-6 md:px-12 max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 title">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-6 subtitle">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.buttonLink}
                  className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-md cta"
                >
                  {slide.buttonText}
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <p className="text-xl">Loading slides...</p>
        </div>
      )}
    </div>
  );
};

export default App;
