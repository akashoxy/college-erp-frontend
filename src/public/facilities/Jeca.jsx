import React, { useEffect, useState } from "react";

import tihlogo from "../../assets/images/tih-logo.png";
import ragging from "../../assets/images/ragging.png";
import wifi from "../../assets/images/wifi.png";

import api from "../../services/api";
import LogoStrip from "../../styles/Logostrip";

export default function Jeca() {
const [jecaData, setJecaData] = useState(null);

const [loading, setLoading] = useState(true);

  // FETCH DATA

 const loadData = async () => {

  try {

    setLoading(true);

    const { data } =
      await api.get("/jeca");

    setJecaData(data.data);

  } catch {

    setJecaData(null);

  } finally {

    setLoading(false);

  }

};

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {

  return (

    <div className="min-h-screen flex justify-center items-center bg-base-200">

      <span className="loading loading-spinner loading-lg text-primary"></span>

    </div>

  );

}
if (!jecaData) {

  return (

    <div className="hero min-h-screen bg-base-200">

      <div className="hero-content">

        <div className="text-center">

          <h2 className="text-4xl font-bold">

            No JECA Information Available

          </h2>

        </div>

      </div>

    </div>

  );

}


  return (
    <>

      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* HEADER */}

          <div className="flex items-center justify-between mb-8">
            <div
              className="
                w-24 h-24
                rounded-full
                overflow-hidden
                border border-base-300
                bg-base-100
                shadow-md
              "
            >
              <img
                src={tihlogo}
                alt="TIH Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-5xl font-bold text-primary text-center">
              JECA
            </h1>

            <div
              className="
                w-24 h-24
                rounded-full
                overflow-hidden
                border border-base-300
                bg-base-100
                shadow-md
              "
            >
              <img
                src={tihlogo}
                alt="TIH Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* DYNAMIC CONTENT */}

          <div className="mb-10">
            <div
              key={jecaData._id}
              className="mb-10"
            >
              {/* BANNER IMAGE */}

              {jecaData.bannerImage && (
                <div className="mb-8">
                  <div
                    className="
                      overflow-hidden
                      rounded-3xl
                      shadow-xl
                      border border-base-300
                    "
                  >
                    <img
                      src={jecaData.bannerImage}
                      alt="JECA Banner"
                      className="w-full h-112.5 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* DESCRIPTION */}

              {jecaData.paragraph && (
                <div
                  className="
                    card
                    bg-base-100
                    border border-base-300
                    shadow-xl
                  "
                >
                  <div
                    className="
                      card-body
                      text-justify
                      leading-relaxed
                      text-base-content
                    "
                  >
                    <h2 className="text-3xl font-bold mb-5">

                    About JECA

                  </h2>
                    <p
                      style={{
                        whiteSpace:
                          "pre-line",
                      }}
                    >
                      {jecaData.paragraph}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* OFFICIAL WEBSITE */}

          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-base-content mb-4">
              To Know More, Visit the
              Official Website
            </h2>

           <a
  href="https://wbjeeb.nic.in/jeca/"
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-primary px-8"
>
  CLICK HERE
</a>
          </div>

          {/* INFO ICONS */}

         <div className="flex justify-center gap-16 mb-10">
  <div
    className="
      w-24 h-24
      rounded-full
      overflow-hidden
      border border-base-300
      bg-base-100
      shadow-md
      flex items-center justify-center
    "
  >
    <img
      src={ragging}
      alt="Anti Ragging"
      className="w-32 h-32 object-cover rounded-full"
    />
  </div>

  <div
    className="
      w-24 h-24
      rounded-full
      overflow-hidden
      border border-base-300
      bg-base-100
      shadow-md
      flex items-center justify-center
    "
  >
    <img
      src={wifi}
      alt="WiFi"
      className="w-full h-full object-contain p-2"
    />
  </div>
</div>

        </div>
      </div>
    <LogoStrip/>
    </>
  );
}