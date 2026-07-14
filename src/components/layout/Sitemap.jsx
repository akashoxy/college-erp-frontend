import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  GraduationCap,
  Building2,
  Users,
  HeartHandshake,
  BookOpen,
  Camera,
} from "lucide-react";

const sitemap = [
  {
    title: "Home",
    icon: Home,
    links: [
      { name: "About Us", path: "/about-us" },
      { name: "Vision & Mission", path: "/vision-mission" },
      { name: "Circular & Notices", path: "/circular-notice" },
      { name: "Awards", path: "/awards" },
    ],
  },

  {
    title: "Academics",
    icon: GraduationCap,
    links: [
      { name: "MCA", path: "/mca-main" },
      { name: "BBA", path: "/bba-main" },
      { name: "BCA", path: "/bca-main" },
      { name: "Research", path: "/faculty-research" },
      { name: "Academic Calendar", path: "/aca-calendar" },
      { name: "List of Holidays", path: "/list-holidays" },
    ],
  },

  {
    title: "Facilities",
    icon: Building2,
    links: [
      { name: "Anti Ragging Cell", path: "/anti-ragging" },
      { name: "Computer Laboratory", path: "/computer-laboratory" },
      { name: "Central Library", path: "/central-library" },
      { name: "Common Room", path: "/common" },
      { name: "College Canteen", path: "/canteen" },
      { name: "Journals", path: "/journals" },
      { name: "JECA", path: "/jeca-main" },
      { name: "CET", path: "/cet-main" },
      { name: "Radio TIH", path: "/radio-main" },
      { name: "Web Magazine", path: "/web-magazine" },
    ],
  },

  {
    title: "Student",
    icon: Users,
    links: [
      {
        name: "Previous Year Question Papers",
        path: "/previous-question",
      },
      {
        name: "Syllabus",
        path: "/syllabus",
      },
      {
        name: "Fees Payment",
        path: "/fees-payment",
      },
    ],
  },

  {
    title: "Life At TIH",
    icon: HeartHandshake,
    links: [
      {
        name: "Recent Academic Works",
        path: "/aca-works",
      },
      {
        name: "Verbena Festival",
        path: "/verbena",
      },
      {
        name: "Spark Quest",
        path: "/spark-quest",
      },
      {
        name: "Annual Sports Meet",
        path: "/sports",
      },
    ],
  },

  {
    title: "Admission",
    icon: BookOpen,
    links: [
      {
        name: "Admission Procedure",
        path: "/admission-procedure",
      },
      {
        name: "Fees Structure",
        path: "/fees-structure",
      },
      {
        name: "Admission Form",
        path: "/admission-form",
      },
    ],
  },

  {
    title: "Campus Tour",
    icon: Camera,
    links: [
      {
        name: "Campus Placement",
        path: "/campus-placement",
      },
      {
        name: "Photo Gallery",
        path: "/photo-gallery",
      },
      {
        name: "Video Gallery",
        path: "/video-gallery",
      },
      {
        name: "Virtual Tour",
        path: "/virtual-tour",
      },
    ],
  },
];

export default function Sitemap() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}

      <section className="bg-base-200 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-base-content"
          >
            Website Sitemap
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-2xl mx-auto text-base-content/70"
          >
            Navigate to every public page of the Techno India Hooghly website.
          </motion.p>
        </div>
      </section>

      {/* Sitemap */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {sitemap.map((section, index) => {

            const Icon = section.icon;

            return (
              <motion.div
                key={section.title}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -6,
                }}
                className="card bg-base-200 border border-base-300 shadow hover:shadow-xl transition-all"
              >
                <div className="card-body">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">

                      <Icon
                        className="text-primary"
                        size={22}
                      />

                    </div>

                    <h2 className="card-title text-base-content">
                      {section.title}
                    </h2>

                  </div>

                  <ul className="space-y-2">

                    {section.links.map((link) => (

                      <li key={link.path}>

                        <Link
                          to={link.path}
                          className="
                            flex
                            items-start
                            gap-2
                            text-base-content/75
                            hover:text-primary
                            transition-colors
                          "
                        >

                          <span className="text-primary mt-1">
                            •
                          </span>

                          <span>
                            {link.name}
                          </span>

                        </Link>

                      </li>

                    ))}

                  </ul>

                </div>

              </motion.div>
            );

          })}

        </div>

      </section>
    </div>
  );
}