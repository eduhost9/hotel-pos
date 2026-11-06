"use client";

export default function HeroCarousel() {
  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
  ];

  return (
    <div className="space-y-4 mb-6">

      {/* First Row */}

      <div className="overflow-hidden rounded-xl">

        <div className="flex animate-scroll gap-4 w-max">

          {[...images, ...images].map(
            (img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-[450px] h-[220px] object-cover rounded-xl"
              />
            )
          )}

        </div>

      </div>

      {/* Second Row */}

      <div className="overflow-hidden rounded-xl">

        <div className="flex animate-scroll-reverse gap-4 w-max">

          {[...images, ...images].map(
            (img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-[450px] h-[220px] object-cover rounded-xl"
              />
            )
          )}

        </div>

      </div>

    </div>
  );
}