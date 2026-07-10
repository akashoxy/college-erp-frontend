import React, { useEffect, useState } from "react";
import api from "../../services/api";

import {
  CalendarDays,
  ExternalLink,
  FileText,
} from "lucide-react";

export const AcademicCalendar = () => {
  const [calendar, setCalendar] = useState(null);

  useEffect(() => {
    fetchCalendar();
  }, []);

 const fetchCalendar = async () => {
  try {
    const res = await api.get("/calendar");
    setCalendar(res.data?.data || null);
  } catch (error) {
    setCalendar(null);
  }
};

  return (
    <>
      
      {/* HERO */}
      <section className="bg-primary text-primary-content py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <CalendarDays
            size={60}
            className="mx-auto mb-4"
          />

          <h1 className="text-5xl font-bold">
            Academic Calendar
          </h1>

          <p className="mt-4 text-lg opacity-90">
            Academic Schedule & Important Dates
          </p>

        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-base-100 py-16">
        <div className="max-w-7xl mx-auto px-6">

          {calendar ? (
            <div className="bg-base-100 rounded-3xl shadow-xl overflow-hidden border border-base-300">

              {calendar.fileType === "image" ? (
                <a
                  href={calendar.redirectUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={calendar.fileUrl}
                    alt="Academic Calendar"
                    className="w-full hover:scale-105 transition-all duration-300 cursor-pointer"
                  />
                </a>
              ) : (
                <div className="p-6">

                  <iframe
                   src={calendar.fileUrl}
                    title="Academic Calendar PDF"
                    className="w-full h-225 rounded-2xl border border-base-300"
                  />

                  <div className="flex justify-center mt-6 gap-4">

                    <a
                      href={calendar.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      <FileText size={18} />
                      Open PDF
                    </a>

                    {calendar.redirectUrl && (
                      <a
                        href={calendar.redirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                      >
                        <ExternalLink size={18} />
                        Visit Link
                      </a>
                    )}

                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-20">

              <h2 className="text-2xl font-semibold text-base-content/60">
                No Academic Calendar Available
              </h2>

            </div>
          )}

        </div>
      </section>

    </>
  );
};