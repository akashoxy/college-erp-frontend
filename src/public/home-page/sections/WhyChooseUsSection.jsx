import { motion } from "framer-motion";
import {
  FaUniversity,
  FaLaptopCode,
  FaUsers,
  FaBriefcase,
  FaRocket,
  FaLightbulb,
  FaCheck,
} from "react-icons/fa";

const EASE = [0.22, 1, 0.36, 1];

const items = [
  {
    key: "university",
    title: "Industry Exposure",
    desc: "Hands-on collaboration with active industry partners and live projects.",
    icon: <FaUniversity />,
  },
  {
    key: "laptop",
    title: "Modern Infrastructure",
    desc: "Contemporary campus, labs and learning spaces built for the future.",
    icon: <FaLaptopCode />,
  },
  {
    key: "users",
    title: "Expert Faculty",
    desc: "Mentorship from experienced academicians and industry practitioners.",
    icon: <FaUsers />,
  },
  {
    key: "briefcase",
    title: "Placement Assistance",
    desc: "Dedicated support connecting students to leading recruiters.",
    icon: <FaBriefcase />,
  },
  {
    key: "rocket",
    title: "Research Culture",
    desc: "An environment that encourages inquiry, publication and discovery.",
    icon: <FaRocket />,
  },
  {
    key: "bulb",
    title: "Innovation Ecosystem",
    desc: "Incubation and ideation spaces for entrepreneurial thinking.",
    icon: <FaLightbulb />,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 md:py-28 bg-base-200">
      <style>
        {`
          /* ---------- University: wax-seal stamp + shockwave ring ---------- */
          @keyframes wcu-seal {
            0%   { transform: rotate(0deg) scale(1); }
            35%  { transform: rotate(-12deg) scale(0.9); }
            55%  { transform: rotate(6deg) scale(1.15); }
            100% { transform: rotate(0deg) scale(1); }
          }
          @keyframes wcu-ring {
            0%   { transform: scale(0.5); opacity: 0.9; }
            100% { transform: scale(1.9); opacity: 0; }
          }

          /* ---------- Laptop: typing bounce + blinking cursor ---------- */
          @keyframes wcu-code {
            0%   { transform: translateY(0) rotate(0deg); }
            20%  { transform: translateY(-4px) rotate(-6deg); }
            40%  { transform: translateY(0) rotate(5deg); }
            60%  { transform: translateY(-3px) rotate(-4deg); }
            80%  { transform: translateY(0) rotate(2deg); }
            100% { transform: translateY(0) rotate(0deg); }
          }
          @keyframes wcu-cursor {
            0%, 100% { opacity: 0; }
            15%, 85% { opacity: 1; }
          }

          /* ---------- Users: team huddling in from the sides ---------- */
          @keyframes wcu-nod {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.12); }
          }
          @keyframes wcu-teammate-left {
            0%   { opacity: 0; transform: translate(0, 0) scale(0.5); }
            40%  { opacity: 0.9; transform: translate(-11px, 2px) scale(0.85); }
            100% { opacity: 0; transform: translate(-16px, 2px) scale(0.7); }
          }
          @keyframes wcu-teammate-right {
            0%   { opacity: 0; transform: translate(0, 0) scale(0.5); }
            40%  { opacity: 0.9; transform: translate(11px, 2px) scale(0.85); }
            100% { opacity: 0; transform: translate(16px, 2px) scale(0.7); }
          }

          /* ---------- Briefcase: opens, deal-closed badge pops ---------- */
          @keyframes wcu-briefcase {
            0%   { transform: rotate(0deg) translateY(0); }
            25%  { transform: rotate(-14deg) translateY(-3px); }
            55%  { transform: rotate(12deg) translateY(-3px); }
            80%  { transform: rotate(-4deg) translateY(0); }
            100% { transform: rotate(0deg) translateY(0); }
          }
          @keyframes wcu-badge {
            0%   { opacity: 0; transform: scale(0) rotate(-45deg); }
            55%  { opacity: 1; transform: scale(1.3) rotate(8deg); }
            75%  { opacity: 1; transform: scale(0.9) rotate(-4deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }

          /* ---------- Rocket: launch, tilt, fade + twinkling stars ---------- */
          @keyframes wcu-rocket {
            0%   { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
            55%  { transform: translate(3px, -14px) rotate(6deg) scale(1.08); opacity: 1; }
            100% { transform: translate(6px, -30px) rotate(10deg) scale(0.85); opacity: 0; }
          }
          @keyframes wcu-exhaust {
            0%   { opacity: 0; transform: scaleY(0.2) translateY(0); }
            30%  { opacity: 0.9; }
            100% { opacity: 0; transform: scaleY(1.6) translateY(10px); }
          }
          @keyframes wcu-star {
            0%   { opacity: 0; transform: translateY(4px) scale(0.4); }
            50%  { opacity: 1; transform: translateY(-6px) scale(1); }
            100% { opacity: 0; transform: translateY(-16px) scale(0.4); }
          }

          /* ---------- Bulb: glow + radiating rays ---------- */
          @keyframes wcu-bulb {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(251,191,36,0)); }
            50%      { transform: scale(1.15); filter: drop-shadow(0 0 12px rgba(251,191,36,0.85)); }
          }
          @keyframes wcu-ray {
            0%, 100% { opacity: 0; transform: scale(0.6); }
            50%      { opacity: 1; transform: scale(1.35); }
          }

          .wcu-card:hover .wcu-icon-university { animation: wcu-seal 0.7s ease; }
          .wcu-card:hover .wcu-ring-university { animation: wcu-ring 0.8s ease-out; }

          .wcu-card:hover .wcu-icon-laptop  { animation: wcu-code 0.9s ease; }
          .wcu-card:hover .wcu-cursor       { animation: wcu-cursor 0.9s steps(1) 2; }

          .wcu-card:hover .wcu-icon-users     { animation: wcu-nod 0.7s ease-in-out infinite; }
          .wcu-card:hover .wcu-mate-left      { animation: wcu-teammate-left 1s ease infinite; }
          .wcu-card:hover .wcu-mate-right     { animation: wcu-teammate-right 1s ease infinite; }

          .wcu-card:hover .wcu-icon-briefcase { animation: wcu-briefcase 0.7s ease; }
          .wcu-card:hover .wcu-badge          { animation: wcu-badge 0.6s cubic-bezier(.34,1.56,.64,1) 0.15s both; }

          .wcu-card:hover .wcu-icon-rocket { animation: wcu-rocket 0.75s ease forwards; }
          .wcu-card:hover .wcu-exhaust     { animation: wcu-exhaust 0.75s ease forwards; }
          .wcu-card:hover .wcu-star-1      { animation: wcu-star 0.9s ease 0.1s infinite; }
          .wcu-card:hover .wcu-star-2      { animation: wcu-star 0.9s ease 0.4s infinite; }

          .wcu-card:hover .wcu-icon-bulb { animation: wcu-bulb 0.9s ease-in-out infinite; }
          .wcu-card:hover .wcu-ray       { animation: wcu-ray 1.1s ease-in-out infinite; }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-3 text-primary font-semibold text-xs tracking-[0.35em] uppercase">
            <span className="h-px w-8 bg-primary/50" />
            The Institution
            <span className="h-px w-8 bg-primary/50" />
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-5 tracking-tight">
            Why Choose Us
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
              className="wcu-card group bg-base-100 rounded-2xl p-8 border border-base-300/60 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="relative w-14 h-14 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary text-xl mb-6 overflow-visible group-hover:bg-primary group-hover:text-primary-content transition-colors duration-500">
                {/* ---- University: expanding stamp ring ---- */}
                {item.key === "university" && (
                  <span className="wcu-ring-university pointer-events-none absolute inset-0 rounded-full border-2 border-amber-400 opacity-0" />
                )}

                {/* ---- Laptop: blinking cursor ---- */}
                {item.key === "laptop" && (
                  <span className="wcu-cursor pointer-events-none absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-400 opacity-0" />
                )}

                {/* ---- Users: teammates sliding in from the sides ---- */}
                {item.key === "users" && (
                  <>
                    <span className="wcu-mate-left pointer-events-none absolute w-2.5 h-2.5 rounded-full bg-primary/40 opacity-0" />
                    <span className="wcu-mate-right pointer-events-none absolute w-2.5 h-2.5 rounded-full bg-primary/40 opacity-0" />
                  </>
                )}

                {/* ---- Briefcase: deal-closed badge ---- */}
                {item.key === "briefcase" && (
                  <span className="wcu-badge pointer-events-none absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[10px] opacity-0 shadow-md">
                    <FaCheck />
                  </span>
                )}

                {/* ---- Rocket: exhaust trail + twinkling stars ---- */}
                {item.key === "rocket" && (
                  <>
                    <span className="wcu-exhaust pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 w-1.5 h-6 rounded-full bg-linear-to-b from-amber-400 via-orange-400 to-transparent opacity-0 origin-top" />
                    <span className="wcu-star-1 pointer-events-none absolute left-2 top-1 w-1 h-1 rounded-full bg-amber-300 opacity-0" />
                    <span className="wcu-star-2 pointer-events-none absolute right-2 top-3 w-1 h-1 rounded-full bg-amber-300 opacity-0" />
                  </>
                )}

                {/* ---- Bulb: radiating rays ---- */}
                {item.key === "bulb" && (
                  <>
                    <span className="wcu-ray pointer-events-none absolute inset-0 rounded-full border border-amber-400/60 opacity-0" style={{ transform: "rotate(0deg)" }} />
                    <span className="wcu-ray pointer-events-none absolute inset-0 rounded-full border border-amber-400/40 opacity-0" style={{ animationDelay: "0.25s" }} />
                  </>
                )}

                <span className={`relative inline-flex wcu-icon-${item.key}`}>
                  {item.icon}
                </span>
              </div>

              <h3 className="font-serif font-semibold text-xl text-base-content">
                {item.title}
              </h3>

              <p className="text-base-content/60 text-sm mt-3 leading-relaxed">
                {item.desc}
              </p>

              <div className="mt-5 h-px w-8 bg-primary/40 group-hover:w-16 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}