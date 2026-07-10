import React from "react";
import { FaCalendarAlt, FaFilePdf, FaDownload } from "react-icons/fa";

export default function StudentNoticeSection({ notices = [], getStatus }) {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <p className="f-mono text-[11px] uppercase tracking-widest text-success">
          Audience: Students
        </p>
        <h2 className="f-display text-3xl font-medium text-base-content mt-2">
          Student Notices
        </h2>
      </div>

      <div className="max-h-175 overflow-y-auto pr-2 space-y-4">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div
              key={notice._id}
              className="border border-base-300 bg-base-100 rounded-sm p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="badge badge-success rounded-sm">
                      {notice.category}
                    </span>

                    <span
                      className={`badge rounded-sm ${
                        getStatus(notice.expiryDate) === "Active"
                          ? "badge-primary"
                          : "badge-error"
                      }`}
                    >
                      {getStatus(notice.expiryDate)}
                    </span>
                  </div>

                  <h3 className="f-display text-xl font-medium text-base-content mb-2">
                    {notice.title}
                  </h3>

                  <p className="text-base-content/70 leading-relaxed mb-4">
                    {notice.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-base-content/50 f-mono">
                    <FaCalendarAlt />
                    Published on {new Date(notice.noticeDate).toLocaleDateString()}
                  </div>
                </div>

                {notice.pdfFile && (
                  <div className="flex flex-wrap gap-3 shrink-0">
                    <a
                      href={notice.pdfFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm rounded-sm gap-2"
                    >
                      <FaFilePdf />
                      View Notice
                    </a>

                    <a
                      href={notice.pdfFile}
                      download
                      className="btn btn-outline btn-sm rounded-sm gap-2"
                    >
                      <FaDownload />
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-base-content/60">
            No student notices found.
          </div>
        )}
      </div>
    </section>
  );
}