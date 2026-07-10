import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { Link } from "react-router-dom";


function GlanceSection() {
  const [aboutData, setAboutData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await api.get("/about-us");
      setAboutData(res.data?.data || {});
    } catch (error) {
  setError("Unable to load About Us");
}
  };

  return (

<section className="py-24 bg-base-100 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">

    {/* Header */}

    <div className="text-center mb-14">

      <span className="text-primary font-semibold uppercase tracking-[0.2em]">
        Techno India Hooghly
      </span>

      <h2 className="text-5xl md:text-6xl font-black mt-4 text-base-content">
        At A Glance
      </h2>

      <div className="w-24 h-1 bg-primary mx-auto mt-5 rounded-full" />

    </div>

    {/* Hero Image */}

   <div className="relative">

  {/* Main Image */}
  <div className="relative overflow-hidden rounded-[36px] shadow-2xl">

    <img
      src={aboutData?.campusImage || "/placeholder-campus.jpg"}
      alt={aboutData?.campusTitle || "Campus"}
      className="w-full h-180 object-cover transition duration-700 hover:scale-105"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

    {/* Bottom Information Panel */}
    <div className="absolute bottom-0 left-0 right-0">

      <div className="bg-base-100/95 backdrop-blur-xl rounded-t-[36px] px-10 py-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* Left */}
          <div className="max-w-2xl">

            <p className="uppercase tracking-[0.35em] text-primary text-xs font-bold">
              TECHNO INDIA HOOGHLY
            </p>

            <h2 className="mt-3 text-4xl font-black text-base-content">
              {aboutData?.campusTitle}
            </h2>

            <p className="mt-4 text-base-content/70 leading-8 line-clamp-3">
              {aboutData?.campusDescription1}
            </p>

          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">

            <div>
              <h3 className="text-4xl font-black text-primary">20+</h3>
              <p className="text-xs uppercase mt-2 text-base-content/60">
                Years
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-primary">5000+</h3>
              <p className="text-xs uppercase mt-2 text-base-content/60">
                Students
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-primary">100+</h3>
              <p className="text-xs uppercase mt-2 text-base-content/60">
                Faculty
              </p>
            </div>

            <div>
              <Link
              to="/about-us"
              className="btn btn-primary rounded-full px-8 mt-2">
                Explore
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

  {/* Established Badge */}
  <div className="absolute top-8 left-8">

    <div className="bg-primary text-primary-content rounded-3xl px-8 py-5 shadow-xl">

      <p className="uppercase text-xs tracking-[0.25em] opacity-80">
        Since
      </p>

      <h3 className="text-4xl font-black">
        2002
      </h3>

    </div>

  </div>

</div>

  </div>
</section>
  );
}

export default GlanceSection;