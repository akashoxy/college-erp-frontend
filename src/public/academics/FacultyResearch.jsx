import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Library,
  Award,
  Search,
  BookOpen,
  ChevronDown,
  Mail,
  Phone,
} from "lucide-react";
import LogoStrip from "../../styles/Logostrip";

/* ==========================================================
   ACCENT MAP
   Static class strings (never interpolated) so Tailwind's
   scanner can always find them.
========================================================== */

const ACCENT = {
  primary: {
    text: "text-primary",
    border: "border-primary/30",
    badge: "badge-primary",
    btn: "btn-primary",
    ring: "focus-visible:outline-primary",
  },
  secondary: {
    text: "text-secondary",
    border: "border-secondary/30",
    badge: "badge-secondary",
    btn: "btn-secondary",
    ring: "focus-visible:outline-secondary",
  },
  accent: {
    text: "text-accent",
    border: "border-accent/30",
    badge: "badge-accent",
    btn: "btn-accent",
    ring: "focus-visible:outline-accent",
  },
};

/* ==========================================================
   CATALOG TAG — every record gets an accession number,
   the same convention the Library section already uses
   for its own shelves.
========================================================== */

function CatalogTag({ prefix, index, accentClass }) {
  return (
    <span
      className={`font-mono text-[11px] tracking-widest ${accentClass}`}
    >
      {prefix}&mdash;{String(index + 1).padStart(3, "0")}
    </span>
  );
}

/* ==========================================================
   LEDGER ROW — label / dotted leader / value, the
   card-catalog way of setting a fact.
========================================================== */

function LedgerRow({ label, value, icon: Icon }) {
  if (!value) return null;

  return (
    <div className="flex items-baseline gap-2 text-sm py-0.5">
      <span className="whitespace-nowrap text-base-content/50 inline-flex items-center gap-1.5">
        {Icon && <Icon size={13} />}
        {label}
      </span>
      <span className="flex-1 border-b border-dotted border-base-300 translate-y-[-3px]" />
      <span className="font-medium text-right break-all">{value}</span>
    </div>
  );
}

/* ==========================================================
   PERSON CARD — a single directory record. Only name,
   designation, and department show by default; everything
   else lives behind "Open record" so the card genuinely
   opens and closes rather than just linking to a modal.
========================================================== */

function PersonCard({ person, index, prefix, accent }) {
  const [open, setOpen] = useState(false);
  const c = ACCENT[accent];

  const hasResearch = person.researchInterests?.length > 0;
  const hasPublications = person.publications?.length > 0;
  const hasSocials =
    person.scholarLink || person.orcidLink || person.linkedinLink;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.08 }}
      className={`card bg-base-100 border ${c.border} overflow-hidden`}
    >
      <figure className="relative h-72 overflow-hidden">
        <img
          src={person.photo || "https://via.placeholder.com/600x600"}
          alt={person.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {person.featured && (
          <div className="absolute top-4 right-4">
            <div className={`badge ${c.badge} gap-1`}>
              <Award size={12} />
              Featured
            </div>
          </div>
        )}
      </figure>

      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-1">
          <CatalogTag prefix={prefix} index={index} accentClass={c.text} />
        </div>

        <h3 className="fr-display text-2xl font-semibold leading-tight">
          {person.name}
        </h3>

        <p className={`font-semibold ${c.text}`}>{person.designation}</p>

        {person.department && (
          <p className="text-base-content/60 text-sm">{person.department}</p>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`btn btn-sm btn-outline ${c.btn} mt-5 w-full justify-between font-normal`}
        >
          {open ? "Close record" : "Open record"}
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Expand/collapse via CSS grid-rows — no layout jump,
           no JS height measurement. */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          aria-hidden={!open}
        >
          <div className="overflow-hidden">
            <div className="pt-5 mt-5 border-t border-base-300 space-y-4">
              <div className="space-y-1">
                <LedgerRow label="Qualification" value={person.qualification} />
                <LedgerRow label="Experience" value={person.experience} />
                <LedgerRow label="Email" value={person.email} icon={Mail} />
                <LedgerRow label="Phone" value={person.phone} icon={Phone} />
              </div>

              {hasResearch && (
                <div>
                  <h4 className="text-xs uppercase tracking-[0.15em] text-base-content/50 mb-2">
                    Research Interests
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {person.researchInterests.map((item, idx) => (
                      <span key={idx} className="badge badge-outline">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasPublications && (
                <div>
                  <h4 className="text-xs uppercase tracking-[0.15em] text-base-content/50 mb-2">
                    Publications &middot; {person.publications.length}
                  </h4>

                  <ul className="space-y-1.5">
                    {person.publications.map((pub, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <BookOpen size={14} className={`mt-0.5 shrink-0 ${c.text}`} />
                        <span className="text-base-content/80">{pub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasSocials && (
                <div>
                  <h4 className="text-xs uppercase tracking-[0.15em] text-base-content/50 mb-2">
                    Academic Profiles
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {person.scholarLink && (
                      <a
                        href={person.scholarLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`btn btn-xs ${c.btn}`}
                      >
                        Google Scholar
                      </a>
                    )}

                    {person.orcidLink && (
                      <a
                        href={person.orcidLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-xs btn-outline"
                      >
                        ORCID
                      </a>
                    )}

                    {person.linkedinLink && (
                      <a
                        href={person.linkedinLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-xs btn-outline"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================
   SECTION HEADING
========================================================== */

function SectionHeading({ eyebrow, accent, title, description }) {
  const c = ACCENT[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-14"
    >
      <div className={`badge ${c.badge} badge-lg mb-4`}>{eyebrow}</div>

      <h2 className="fr-display text-4xl md:text-5xl font-semibold">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base-content/70 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}

/* ==========================================================
   MAIN PAGE
========================================================== */

export default function FacultyResearch() {
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFacultyData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/faculty-research");

      setFacultyData(res.data?.data || []);
    } catch (error) {
      console.error("Faculty Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const facultyMembers = facultyData.filter(
    (item) => item.category === "faculty"
  );

  const labStaff = facultyData.filter((item) => item.category === "lab");

  const libraryStaff = facultyData.filter(
    (item) => item.category === "library"
  );

  const stats = useMemo(() => {
    const publicationCount = facultyMembers.reduce(
      (acc, faculty) => acc + (faculty.publications?.length || 0),
      0
    );

    return {
      faculty: facultyMembers.length,
      lab: labStaff.length,
      library: libraryStaff.length,
      publications: publicationCount,
    };
  }, [facultyMembers, labStaff, libraryStaff]);

  const filteredFaculty = facultyMembers.filter((member) => {
    const query = searchTerm.toLowerCase();

    return (
      member.name?.toLowerCase().includes(query) ||
      member.designation?.toLowerCase().includes(query) ||
      member.department?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600;8..60,700;8..60,800&display=swap"
      />

      <style>{`
        .fr-display {
          font-family: "Source Serif 4", ui-serif, Georgia, serif;
        }
      `}</style>

      {/* ==================================
          HERO SECTION
      ================================== */}

      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-secondary blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="badge badge-primary badge-lg mb-6">
              Academic Directory
            </div>

            <h1 className="fr-display text-5xl md:text-7xl font-semibold text-base-content mb-6">
              Faculty &amp;
              <span className="text-primary"> Research</span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-base-content/70 leading-relaxed">
              A working directory of the faculty, laboratory
              professionals, and library staff who lead teaching,
              research, and academic support across the institute.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================================
          STATISTICS SECTION
      ================================== */}

      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GraduationCap,
                label: "Faculty Members",
                value: stats.faculty,
                accent: "primary",
              },
              {
                icon: Users,
                label: "Lab Staff",
                value: stats.lab,
                accent: "secondary",
              },
              {
                icon: Library,
                label: "Library Staff",
                value: stats.library,
                accent: "accent",
              },
              {
                icon: BookOpen,
                label: "Publications",
                value: stats.publications,
                accent: "primary",
              },
            ].map((s, i) => {
              const c = ACCENT[s.accent];
              const Icon = s.icon;

              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="stat bg-base-100 rounded-xl border border-base-300"
                >
                  <div className={`stat-figure ${c.text}`}>
                    <Icon size={32} />
                  </div>

                  <div className="stat-title">{s.label}</div>

                  <div className={`stat-value fr-display ${c.text}`}>
                    {s.value}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================
          SEARCH SECTION
      ================================== */}

      <section className="py-12 bg-base-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <label className="text-xs uppercase tracking-[0.2em] text-base-content/50 block mb-2 text-center">
              Search the directory
            </label>

            <div className="relative">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/50"
              />

              <input
                type="text"
                placeholder="Name, designation, or department…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered input-lg w-full pl-14 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================
          FACULTY MEMBERS
      ================================== */}

      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Academic Team"
            accent="primary"
            title="Faculty Members"
            description="Educators, researchers, and mentors leading coursework and academic research."
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap size={60} className="mx-auto opacity-30" />
              <p className="mt-4 text-base-content/60">
                No matching faculty records.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {filteredFaculty.map((member, index) => (
                <PersonCard
                  key={member._id}
                  person={member}
                  index={index}
                  prefix="FAC"
                  accent="primary"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================
          LAB STAFF SECTION
      ================================== */}

      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Laboratory Team"
            accent="secondary"
            title="Laboratory Staff"
            description="Laboratory professionals supporting practical learning, experimentation, and technical work."
          />

          {labStaff.length === 0 ? (
            <div className="text-center py-12">
              <Award size={60} className="mx-auto opacity-30" />
              <p className="mt-4 text-base-content/60">
                No laboratory staff available.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {labStaff.map((staff, index) => (
                <PersonCard
                  key={staff._id}
                  person={staff}
                  index={index}
                  prefix="LAB"
                  accent="secondary"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================
          LIBRARY STAFF SECTION
      ================================== */}

      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Library Team"
            accent="accent"
            title="Library Professionals"
            description="Information specialists providing access to research resources and academic support."
          />

          {libraryStaff.length === 0 ? (
            <div className="text-center py-12">
              <Library size={60} className="mx-auto opacity-30" />
              <p className="mt-4 text-base-content/60">
                No library staff available.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {libraryStaff.map((staff, index) => (
                <PersonCard
                  key={staff._id}
                  person={staff}
                  index={index}
                  prefix="LIB"
                  accent="accent"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================
          RESEARCH HIGHLIGHTS
      ================================== */}

      <section className="py-20 bg-primary text-primary-content">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="fr-display text-4xl md:text-5xl font-semibold mb-6">
              Research Excellence
            </h2>

            <p className="max-w-3xl mx-auto text-lg opacity-90">
              Faculty across the institute contribute to research,
              publications, conferences, and academic collaborations
              that shape the future of education and technology.
            </p>

            <div className="grid md:grid-cols-4 gap-6 mt-12">
              {[
                { label: "Faculty Members", value: stats.faculty },
                { label: "Publications", value: stats.publications },
                { label: "Lab Professionals", value: stats.lab },
                { label: "Library Experts", value: stats.library },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/20 p-6"
                >
                  <div className="fr-display text-4xl font-semibold">
                    {s.value}
                  </div>
                  <div className="opacity-80 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <LogoStrip/>
    </>
  );
}