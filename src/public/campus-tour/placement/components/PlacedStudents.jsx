import React, { useEffect, useState } from "react";
import api from "../../../../services/api";

const PlacedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/placed-students");

      setStudents(data.data || []);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-base-200 py-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* SECTION HEADER */}
        <div className="text-center mb-14">
          <p className="f-mono text-xs tracking-[0.25em] uppercase text-accent">
            Success Stories
          </p>
          <h2 className="f-display mt-2 text-4xl md:text-5xl font-medium text-base-content">
            Placed Students
          </h2>
          <p className="text-base-content/70 text-lg mt-4 max-w-3xl mx-auto">
            Students successfully placed in reputed organizations.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-accent"></span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center text-base-content/60">
            No placed students found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {Array.isArray(students) &&
              students.map((student) => (
                <div
                  key={student._id}
                  className="bg-base-100 rounded-sm border border-base-300 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* STUDENT PHOTO — square, ID-card style */}
                  <div className="aspect-video w-full bg-base-200 border-b border-base-300 overflow-hidden ">
                    <img
                      src={
                        student.image ||
                        "https://placehold.co/300x300?text=Student"
                      }
                      alt={student.studentName}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-7">
                    <h3 className="f-display text-2xl font-medium text-base-content">
                      {student.studentName}
                    </h3>
                    <p className="f-mono text-xs uppercase tracking-widest text-accent mt-1">
                      {student.department}
                    </p>

                    <div className="divider my-4" />

                    <dl className="space-y-3 text-sm">
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-base-content/60">Company</dt>
                        <dd className="font-medium text-base-content text-right">
                          {student.company}
                        </dd>
                      </div>

                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-base-content/60">Designation</dt>
                        <dd className="font-medium text-base-content text-right">
                          {student.designation}
                        </dd>
                      </div>

                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-base-content/60">Package</dt>
                        <dd className="font-medium text-base-content text-right">
                          {student.package}
                        </dd>
                      </div>

                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-base-content/60">Placement Year</dt>
                        <dd className="font-medium text-base-content text-right">
                          {student.placementYear}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PlacedStudents;