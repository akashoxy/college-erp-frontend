import React, { useEffect, useState } from "react";
import api from "../../../../services/api";

const RecruitersSection = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiters();
  }, []);

const fetchRecruiters = async () => {
  try {
    setLoading(true);

    const { data } = await api.get("/recruiters");

    const recruiters =
      data?.data?.recruiters ||
      (Array.isArray(data?.data)
        ? data.data
        : []) ||
      data?.recruiters ||
      (Array.isArray(data)
        ? data
        : []);

    setRecruiters(recruiters);
  } catch {
    setRecruiters([]);
  } finally {
    setLoading(false);
  }
};

  // Duplicated once so the strip can loop seamlessly at translateX(-50%)
  const loop = Array.isArray(recruiters) ? [...recruiters, ...recruiters] : [];

  return (
    <section className="py-20 bg-base-100">
      <style>{`
        @keyframes cp-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .cp-marquee-track {
          animation: cp-marquee 32s linear infinite;
        }
        .cp-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .cp-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-5">
        {/* SECTION HEADER */}
        <div className="text-center mb-14">
          <p className="f-mono text-xs tracking-[0.25em] uppercase text-accent">
            Our Partners in Placement
          </p>
          <h2 className="f-display mt-2 text-4xl md:text-5xl font-medium text-base-content">
            Recruiters
          </h2>
          <p className="text-base-content/70 text-lg mt-4 max-w-3xl mx-auto">
            Leading companies recruiting talented students from our institution.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-accent"></span>
          </div>
        ) : recruiters.length === 0 ? (
          <div className="text-center text-base-content/60">
            No recruiters available.
          </div>
        ) : (
          <div
            className="relative overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }}
          >
            <div className="cp-marquee-track flex w-max gap-6">
              {loop.map((recruiter, i) => (
                <div
                  key={`${recruiter._id}-${i}`}
                  className="w-56 shrink-0 bg-base-100 border border-base-300 rounded-sm p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  {/* LOGO */}
                  <div className="h-24 flex items-center justify-center  rounded-sm">
                    <img
                      src={
                        recruiter.logo?.trim()
                          ? recruiter.logo
                          : "https://placehold.co/300x200?text=Company+Logo"
                      }
                      alt={recruiter.companyName}
                      loading="lazy"
                      draggable="false"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* COMPANY NAME */}
                  <h3 className="text-center font-medium text-sm mt-5 text-base-content">
                    {recruiter.companyName}
                  </h3>

                  {/* WEBSITE */}
                  {recruiter.website && (
                    <div className="text-center mt-2">
                      <a
                        href={recruiter.website}
                        target="_blank"
                        rel="noreferrer"
                        className="link link-primary text-xs font-medium"
                      >
                        Visit website
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecruitersSection;