"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const banners = [
  { id: 1, image: "/images/banner/1.webp" },
  { id: 2, image: "/images/banner/2.webp" },
  { id: 3, image: "/images/banner/3.webp" },
];

export default function Banner() {
  return (
    <div className="relative w-full h-[600px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        className="h-full w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative">
            <img
              src={banner.image}
              alt={`Banner ${banner.id}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

