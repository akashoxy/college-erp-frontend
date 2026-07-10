import React, { useEffect, useState } from "react";


import radio from "../../assets/images/radio2.png";
import ragging from "../../assets/images/ragging.png";
import wifi from "../../assets/images/wifi.png";

import api from "../../services/api";

export default function RadioTih() {
  const [radioData, setRadioData] =
    useState(null);

    const [loading, setLoading] = useState(true);

  // LOAD DATA

 const loadData = async () => {

  try {

    setLoading(true);

    const { data } =
      await api.get("/radio-tih");

    setRadioData(data.data);

  } catch {

    setRadioData(null);

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

if (!radioData) {

  return (

    <div className="hero min-h-screen bg-base-200">

      <div className="hero-content">

        <div className="text-center">

          <h2 className="text-4xl font-bold">

            No Radio TIH Information Available

          </h2>

        </div>

      </div>

    </div>

  );

}


  // GET YOUTUBE VIDEO ID

  const getYoutubeId = (url) => {
    if (!url) return "";

    // SHORT URL

    if (url.includes("youtu.be/")) {
      return url
        .split("youtu.be/")[1]
        .split("?")[0];
    }

    // NORMAL URL

    if (url.includes("watch?v=")) {
      return url
        .split("watch?v=")[1]
        .split("&")[0];
    }

    return "";
  };

  return (
    <>

      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* HEADER */}

          <div className="flex items-center justify-center gap-6 mb-10">
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
                src={radio}
                alt="Radio Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-5xl font-bold text-primary">
              RADIO TIH
            </h1>
          </div>

          {/* VIDEO SECTION */}

          {radioData?.bannerVideo && (
            <div
              className="
                card
                bg-base-100
                border border-base-300
                shadow-xl
                mb-12
              "
            >
              <div className="card-body">
                <div
                    className="
                      w-full
                      h-125
                      overflow-hidden
                      rounded-2xl
                      border
                      border-base-300
                    "
                >
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYoutubeId(
                      radioData.bannerVideo
                    )}`}
                    title="Radio TIH Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}

          {/* PROGRAM LIST BUTTON */}

          {radioData?.programList
            ?.length > 0 && (
            <div className="text-center mb-14">
              <button
                className="btn btn-primary px-10"
                onClick={() =>
                  document
                    .getElementById(
                      "program_modal"
                    )
                    .showModal()
                }
              >
                View Program List
              </button>
            </div>
          )}

          {/* PROGRAM LIST MODAL */}

          <dialog
            id="program_modal"
            className="modal"
          >
            <div
              className="
                modal-box
                bg-base-100
                border border-base-300
                max-w-2xl
              "
            >
              <h3
                className="
                  font-bold
                  text-2xl
                  text-center
                  mb-6
                  text-base-content
                "
              >
                Radio TIH – Program
                List
              </h3>

              <ul
                className="
                  list-disc
                  list-inside
                  text-lg
                  space-y-3
                  max-h-[60vh]
                  overflow-y-auto
                  pr-2
                "
              >
                {radioData?.programList?.map(
                  (
                    program,
                    index
                  ) => (
                    <li key={index}>
                      {program}
                    </li>
                  )
                )}
              </ul>

              <div className="modal-action">
                <form method="dialog">
                  <button
                    className="
                      btn
                      btn-outline
                      btn-primary
                    "
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          </dialog>

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

    </>
  );
}