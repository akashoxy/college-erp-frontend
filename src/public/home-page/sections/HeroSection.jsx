// import React from "react";
// import { Link } from "react-router-dom";
// import heroCampus from "../../../assets/images/College_image.jpg";


// function HeroSection() {
//   return (
//     <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-primary to-slate-900 text-white">

//       <div className="max-w-7xl mx-auto px-6 py-24">

//         <div className="grid lg:grid-cols-2 gap-16 items-center">

//           <div>

//             <span className="inline-block px-4 py-2 rounded-full bg-base-100/10 border   border-white/20 text-sm font-semibold mb-6">
//               Admissions Open 2030
//             </span>

//             <h1 className="text-5xl md:text-7xl font-black leading-tight">
//               Empowering
//               <span className="block text-amber-400">
//                 Future Innovators
//               </span>
//             </h1>

//             <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl">
//               Join one of West Bengal's leading institutions
//               dedicated to academic excellence, innovation,
//               leadership and career success.
//             </p>

//             <div className="flex flex-wrap gap-4 mt-8">
//               <Link
//                 to="/admission"
//                 className="btn btn-secondary"
//               >
//                 Apply Now
//               </Link>

//               <button className="btn btn-outline text-white">
//                 Explore Programs
//               </button>
//             </div>

//             <div className="grid grid-cols-3 gap-4 mt-12">

//               <div>
//                 <h3 className="text-3xl font-bold">20+</h3>
//                 <p className="text-white/70 text-sm">
//                   Years
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-3xl font-bold">5000+</h3>
//                 <p className="text-white/70 text-sm">
//                   Students
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-3xl font-bold">95%</h3>
//                 <p className="text-white/70 text-sm">
//                   Placement
//                 </p>
//               </div>

//             </div>

//           </div>

//           <div className="relative">

//             <img
//               src={heroCampus}
//               alt="Campus"
//               className="rounded-[40px] shadow-2xl"
//             />

//             {/* <div className="absolute -bottom-6 -left-6 bg-base-100 text-base-content rounded-3xl p-6 shadow-2xl">
//               <div className="flex gap-6">

//                 <div className="text-center">
//                   <FaGraduationCap className="text-primary text-2xl mx-auto" />
//                   <p className="text-xs mt-2">
//                     Education
//                   </p>
//                 </div>

//                 <div className="text-center">
//                   <FaUsers className="text-primary text-2xl mx-auto" />
//                   <p className="text-xs mt-2">
//                     Community
//                   </p>
//                 </div>

//                 <div className="text-center">
//                   <FaBriefcase className="text-primary text-2xl mx-auto" />
//                   <p className="text-xs mt-2">
//                     Career
//                   </p>
//                 </div>

//               </div>
//             </div> */}

//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }

// export default HeroSection;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroCampus from "../../../assets/images/College_image.jpg";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-primary to-slate-900 text-white">
      {/* subtle radial glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-130 h-130 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-105 h-105 rounded-full bg-white/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-3 mb-7"
            >
              <span className="h-px w-8 bg-amber-400" />
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-amber-400">
                Admissions Open 2026
              </span>
               <span className="h-px w-8 bg-amber-400" />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight"
            >
              Empowering
              <span className="block text-amber-400 italic">
                Future Innovators
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-7 text-white/70 leading-relaxed max-w-xl font-light text-[15px] md:text-base"
            >
              Join one of West Bengal's leading institutions, dedicated to
              academic excellence, innovation, leadership and career success.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-wrap gap-4 mt-9"
            >
              <Link
                to="/admission-form"
                className="btn btn-secondary rounded-full px-8 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                Apply Now
              </Link>
              <Link 
              to="/admission-procedure"
              className="btn btn-outline text-white border-white/30 hover:border-amber-400 hover:bg-transparent hover:text-amber-400 rounded-full px-8 transition-all duration-300">
                Explore Programs
              </Link>
            </motion.div>

      
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative"
          >
            {/* gold corner frame */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-amber-400/70 rounded-tl-3xl" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-amber-400/70 rounded-br-3xl" />

            <img
              src={heroCampus}
              alt="Campus"
              className="rounded-4xl shadow-2xl shadow-black/40 w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;