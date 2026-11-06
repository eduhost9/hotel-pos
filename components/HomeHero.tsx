"use client";

import { useEffect, useState } from "react";

export default function HomeHero() {
  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
  ];

  const [current, setCurrent] =
    useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === images.length - 1
          ? 0
          : prev + 1
      );
    }, 6000);

    return () =>
      clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[550px] overflow-hidden rounded-xl">

      {images.map((image, index) => (

        <img
          key={index}
          src={image}
          alt=""
          className={`
            hero-image
            absolute inset-0
            w-full h-full
            object-cover
            transition-all
            duration-1000
            ease-in-out

            ${
              current === index
                ? "translate-x-0 opacity-100 scale-100"
                : index < current
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
            }
          `}
        />

      ))}

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">

        <h1 className="text-6xl font-bold drop-shadow-lg">
          Point Of Sale
        </h1>

        <p className="mt-4 text-2xl">
          Powerful Hotel Management Solution
        </p>

      </div>

    </div>
  );
}