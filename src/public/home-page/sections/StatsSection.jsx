// import {
//   FaGraduationCap,
//   FaUsers,
//   FaBriefcase,
//   FaAward,
// } from "react-icons/fa";

// export default function StatsSection() {
//   const stats = [
//     {
//       value: "20+",
//       label: "Years of Excellence",
//       icon: <FaAward />,
//     },
//     {
//       value: "5000+",
//       label: "Students",
//       icon: <FaUsers />,
//     },
//     {
//       value: "100+",
//       label: "Faculty",
//       icon: <FaGraduationCap />,
//     },
//     {
//       value: "95%",
//       label: "Placement Support",
//       icon: <FaBriefcase />,
//     },
//   ];

//   return (
//     <section className="py-16 bg-base-100">
//       <div className="max-w-7xl mx-auto px-6">

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

//           {stats.map((item, index) => (
//             <div
//               key={index}
//               className="card bg-base-100 rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition-all"
//             >
//               <div className="text-primary text-4xl mb-4 flex justify-center">
//                 {item.icon}
//               </div>

//               <h3 className="text-4xl font-bold">
//                 {item.value}
//               </h3>

//               <p className="text-base-content/70 mt-2">
//                 {item.label}
//               </p>
//             </div>
//           ))}

//         </div>

//       </div>
//     </section>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaGraduationCap,
  FaUsers,
  FaBriefcase,
  FaAward,
} from "react-icons/fa";

const EASE = [0.22, 1, 0.36, 1];

function useCountUp(target, inView, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const numeric = parseInt(String(target).replace(/\D/g, ""), 10) || 0;
    let start = null;

    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * numeric));
      if (progress < 1) requestAnimationFrame(step);
    };

    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  const suffix = String(target).replace(/[0-9]/g, "");
  return `${value}${suffix}`;
}

function StatCard({ item, index, inView }) {
  const display = useCountUp(item.value, inView, 1400 + index * 150);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
      className="group bg-base-100 rounded-2xl border border-base-300/70 p-8 text-center hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
    >
      <div className="w-14 h-14 mx-auto rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary text-xl mb-5 group-hover:bg-primary group-hover:text-primary-content transition-all duration-500">
        {item.icon}
      </div>

      <h3 className="font-serif text-4xl font-semibold text-base-content tabular-nums">
        {display}
      </h3>

      <p className="text-base-content/55 mt-2 text-xs tracking-widest uppercase">
        {item.label}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const stats = [
    { value: "20+", label: "Years of Excellence", icon: <FaAward /> },
    { value: "5000+", label: "Students", icon: <FaUsers /> },
    { value: "100+", label: "Faculty", icon: <FaGraduationCap /> },
    { value: "95%", label: "Placement Support", icon: <FaBriefcase /> },
  ];

  return (
    <section ref={ref} className="py-16 md:py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <StatCard key={item.label} item={item} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}