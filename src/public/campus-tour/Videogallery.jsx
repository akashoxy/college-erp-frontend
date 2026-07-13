import React, { useEffect, useState } from "react";
import api from "../../services/api";


import tihlogo from "../../assets/images/tih-logo.png";
import LogoStrip from "../../styles/Logostrip";

export default function Videogallery() {
  const [videoData, setVideoData] = useState({
    bannerVideo: "",
    promoVideo: "",
    paragraph: "",
    alumniTalks: [],
  });

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get(
  "/videogallery"
);

      if (res.data.data) {
        setVideoData(res.data.data);
      }
    } catch (error) {
      setVideoData({
  bannerVideo: "",
  promoVideo: "",
  paragraph: "",
  alumniTalks: [],
});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getEmbedUrl = (url) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.pathname.includes("/embed/")) {
      return url;
    }

    if (parsed.pathname.startsWith("/shorts/")) {
      const id = parsed.pathname.split("/shorts/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (parsed.pathname.startsWith("/live/")) {
      const id = parsed.pathname.split("/live/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }

    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }

    return "";
  } catch {
    return "";
  }
};

  if (loading) {
    return (
      <>

        <div className="min-h-screen bg-base-200 flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>

      </>
    );
  }

  return (
    <>

      <div className="min-h-screen bg-base-200">
        {/* HERO SECTION */}

        <section className="px-4 lg:px-10 pt-10">
          <div
            className="
              relative
              overflow-hidden
              rounded-4xl
              bg-linear-to-r
              from-primary
              via-secondary
              to-accent
              text-primary-content
              shadow-2xl
            "
          >
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="relative z-10 py-16 px-8">
              <div className="flex flex-col items-center text-center">
                <div
                  className="
                    w-32 h-32
                    rounded-full
                    bg-base-100
                    p-3
                    shadow-xl
                    mb-6
                  "
                >
                  <img
                    src={tihlogo}
                    alt="TIH Logo"
                    className="w-28 h-28 object-cover rounded-full"
                  />
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Video Gallery
                </h1>

                <p className="mt-6 text-lg md:text-xl max-w-4xl leading-relaxed">
                  Explore memorable moments,
                  institutional achievements,
                  student activities, campus
                  events, and inspiring alumni
                  interactions through our
                  curated collection of videos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED VIDEO */}

        {videoData.bannerVideo && (
          <section className="px-4 lg:px-10 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-base-content">
                  Featured Video
                </h2>

                <p className="text-base-content/70 mt-2">
                  Watch our highlighted
                  institutional presentation
                </p>
              </div>

              <div
                className="
                  overflow-hidden
                  rounded-4xl
                  shadow-xl
                  bg-base-100
                  border border-base-300
                  p-3
                "
              >
                <iframe
                  src={getEmbedUrl(
                    videoData.bannerVideo
                  )}
                  title="Featured Video"
                  className="w-full h-162.5 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        {/* ABOUT VIDEO GALLERY */}

        {videoData.paragraph && (
          <section className="px-4 lg:px-10 pb-12">
            <div className="max-w-6xl mx-auto">
              <div
                className="
                  bg-base-100
                  border border-base-300
                  rounded-4xl
                  shadow-xl
                  p-8 lg:p-12
                "
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-base-content">
                    About Our Video Gallery
                  </h2>

                  <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
                </div>

                <p
                  className="
                    text-lg
                    leading-relaxed
                    text-base-content/80
                    text-justify
                    whitespace-pre-wrap
                  "
                >
                  {videoData.paragraph}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CAMPUS HIGHLIGHTS */}

        {videoData.promoVideo && (
          <section className="px-4 lg:px-10 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-base-content">
                  Campus Highlights
                </h2>

                <p className="text-base-content/70 mt-2">
                  Discover the vibrant campus
                  culture and achievements
                </p>
              </div>

              <div
                className="
                  overflow-hidden
                  rounded-4xl
                  shadow-xl
                  bg-base-100
                  border border-base-300
                  p-3
                "
              >
                <iframe
                  src={getEmbedUrl(
                    videoData.promoVideo
                  )}
                  title="Campus Highlights"
                  className="w-full h-162.5 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        {/* ALUMNI TALKS */}

        {videoData.alumniTalks?.length > 0 && (
          <section className="px-4 lg:px-10 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-base-content">
                  Meet Our Alumni
                </h2>

                <p className="text-base-content/70 mt-4 text-lg">
                  Inspiring journeys,
                  experiences, and success
                  stories
                </p>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-8
                "
              >
                {videoData.alumniTalks.map(
                  (talk, index) => (
                    <div
                      key={index}
                      className="
                        bg-base-100
                        border border-base-300
                        rounded-4xl
                        overflow-hidden
                        shadow-xl
                        hover:shadow-2xl
                        hover:-translate-y-2
                        transition-all
                        duration-300
                      "
                    >
                      <div className="p-6">
                        <h3
                          className="
                            text-xl
                            font-bold
                            text-base-content
                            text-center
                            mb-5
                            min-h-15
                            flex
                            items-center
                            justify-center
                          "
                        >
                          {talk.title}
                        </h3>

                        {talk.videoUrl && (
                          <div className="overflow-hidden rounded-2xl">
                            <iframe
                              src={getEmbedUrl(
                                talk.videoUrl
                              )}
                              title={talk.title}
                              className="w-full h-62.5 rounded-2xl"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* YOUTUBE CTA */}

        <section className="px-4 lg:px-10 py-16">
          <div className="max-w-6xl mx-auto">
            <div
              className="
                bg-linear-to-r
                from-primary
                via-secondary
                to-accent
                rounded-4xl
                shadow-2xl
                overflow-hidden
              "
            >
              <div className="p-10 lg:p-16 text-center text-primary-content">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Explore More Videos
                </h2>

                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 opacity-95">
                  Stay connected with campus
                  life, academic activities,
                  student achievements,
                  cultural events, alumni talks,
                  and institutional milestones
                  through our official YouTube
                  channel.
                </p>

                <button
                  className="
                    btn
                    btn-lg
                    btn-primary
                    bg-base-100
                    text-primary
                    border-base-100
                    hover:bg-base-200
                  "
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/channel/UCG--_dyMbfKGX97zs2D796A",
                      "_blank"
                    )
                  }
                >
                  Visit Official YouTube
                  Channel →
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
                  <LogoStrip/>
    </>
  );
}