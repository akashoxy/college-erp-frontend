import React, { useEffect, useState } from "react";
import api from "../../services/api";


import accreditation from "../../assets/images/accreditation-3.png";
import tihlogo from "../../assets/images/tih-logo.png";
import LogoStrip from "../../styles/Logostrip";

const ListOfHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
   try {
  const res = await api.get("/holidays");

  setHolidays(
    Array.isArray(res.data?.data)
      ? res.data.data
      : []
  );
} catch {
  setHolidays([]);
} finally {
  setLoading(false);
}
  };

  if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
}

  return (
    <>

      {/* HERO SECTION */}
      <section className="bg-primary text-primary-content py-12">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-center justify-between flex-wrap gap-6">

            <img
              src={accreditation}
              alt="Accreditation"
              className="w-32 h-32 object-cover rounded-full"
            />

            <div className="text-center">

              <h1 className="text-4xl md:text-5xl font-bold">
                Academic Holiday Calendar
              </h1>

              <p className="mt-3 opacity-90">
                List of Approved Holidays
              </p>

            </div>

            <img
              src={tihlogo}
              alt="TIH Logo"
              className="w-32 h-32 object-cover rounded-full"
            />

          </div>

        </div>

      </section>

      {/* MAIN CONTENT */}
      <section className="bg-base-100 py-16 min-h-screen">

        <div className="max-w-7xl mx-auto px-6">
                    {/* STATISTICS */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">

            <div className="bg-base-100 border border-base-300 rounded-3xl shadow p-6">

              <p className="text-base-content/70">
                Total Holidays
              </p>

              <h2 className="text-4xl font-bold text-primary">
                {holidays.length}
              </h2>

            </div>

          </div>

          {/* HOLIDAY LIST CARD */}
          <div className="bg-base-100 border border-base-300 rounded-3xl shadow overflow-hidden">

            <div className="p-6 border-b border-base-300">

              <h2 className="text-2xl font-bold text-base-content">
                Holiday List
              </h2>

            </div>
                        <div className="holiday-scroll overflow-y-auto overflow-x-auto max-h-125 border-2 border-base-300 rounded-xl">

              <table className="w-full border-collapse">

                <thead className="sticky top-0 z-20 bg-primary text-primary-content">

                  <tr>

                    <th className="border border-base-300 px-4 py-3">
                      Date
                    </th>

                    <th className="border border-base-300 px-4 py-3">
                      Day
                    </th>

                    <th className="border border-base-300 px-4 py-3">
                      Holiday
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {holidays.map((holiday) => (

                    <tr
                      key={holiday._id}
                      className="hover:bg-base-200 transition-colors"
                    >

                      <td className="border border-base-300 px-4 py-3 text-base-content">

                        {new Date(holiday.date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}

                      </td>

                      <td className="border border-base-300 px-4 py-3 text-base-content">

                        {holiday.day}

                      </td>

                      <td className="border border-base-300 px-4 py-3 font-medium text-primary">

                        {holiday.particular}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
                    {/* MAKAUT NOTICE CARD */}
          <div className="bg-base-100 border border-base-300 rounded-3xl shadow mt-10 p-8">

            <h2 className="text-2xl font-bold mb-3 text-base-content">
              MAKAUT Published Holidays
            </h2>

            <p className="text-base-content/70 mb-6">
              View official holiday notifications
              published by MAKAUT.
            </p>

            <a
              href="https://makautwb.ac.in/page.php?id=212"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Open MAKAUT Notice
            </a>

          </div>

        </div>

      </section>
      <LogoStrip/>
    </>
  );
};

export default ListOfHolidays;