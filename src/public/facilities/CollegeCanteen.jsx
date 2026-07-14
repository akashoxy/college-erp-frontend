import React from "react";
import { motion } from "framer-motion";
import heroImg from "../../assets/calendar/canteen.png";
import menuImg from "../../assets/calendar/canteen.png";
import ragging from "../../assets/images/ragging.png";
import radio from "../../assets/images/radio.png";
import wifi from "../../assets/images/wifi.png";
import LogoStrip from "../../styles/Logostrip";


const menuCategories = [
  {
    emoji: "☕",
    title: "Hot Beverages",
    items: ["Coffee", "Tea"],
  },
  {
    emoji: "🍜",
    title: "Quick Meals",
    items: ["Maggi", "Noodles"],
  },
  {
    emoji: "🥪",
    title: "Snacks & Rolls",
    items: ["Sandwich", "Roll", "Snacks"],
  },
];

const facilities = [
  {
    image: wifi,
    title: "WiFi Campus",
    description:
      "Stay connected while enjoying your meals with campus-wide internet access.",
  },
  {
    image: radio,
    title: "Radio TIH",
    description:
      "Student-led radio entertainment and campus engagement activities.",
  },
  {
    image: ragging,
    title: "Anti-Ragging Cell",
    description:
      "Safe, supportive and student-friendly campus environment.",
  },
];

const favorites = [
  "Maggi",
  "Chicken Roll",
  "Veg Sandwich",
  "Coffee",
  "Tea",
  "Noodles",
];

const CollegeCanteen = () => {
  return (
    <>
      {/* HERO */}
      <section className="hero min-h-[75vh] bg-linear-to-br from-primary/10 via-base-100 to-secondary/10 overflow-hidden">
        <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-7xl">
          <motion.div
  className="
    relative
    w-40
    h-40
    md:w-46
    md:h-46
    rounded-full
    bg-base-100
    border-8
    border-base-100
    shadow-2xl
    overflow-hidden
  "
  animate={{ y: [0, -15, 0] }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />

  <img
    src={heroImg}
    alt="College Canteen"
    className="relative z-10 w-full h-full object-cover rounded-full"
  />
</motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge badge-primary badge-lg mb-4">
              Student Facility
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              College
              <span className="block text-primary">Canteen</span>
            </h1>

            <p className="py-6 text-lg max-w-xl text-base-content/80">
              Fresh meals, hygienic preparation, affordable prices and a vibrant
              space where students can relax, socialize and recharge between
              classes.
            </p>

            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
              <div className="stat">
                <div className="stat-title">Starting Price</div>
                <div className="stat-value text-primary">₹20+</div>
              </div>

              <div className="stat">
                <div className="stat-title">Food Quality</div>
                <div className="stat-value text-secondary">100%</div>
                <div className="stat-desc">Freshly Prepared</div>
              </div>

              <div className="stat">
                <div className="stat-title">Options</div>
                <div className="stat-value">Veg & Non-Veg</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card bg-base-100 shadow-2xl border border-base-300"
        >
          <div className="card-body">
            <h2 className="card-title text-3xl text-primary mb-4">
              About Our Canteen
            </h2>

            <p className="leading-8 text-lg text-base-content/80 text-justify">
              The canteen at Techno India Hooghly Campus provides a clean,
              hygienic and student-friendly environment where students can enjoy
              affordable and freshly prepared meals. With prices starting from
              approximately ₹20, the canteen caters to diverse tastes through
              vegetarian and non-vegetarian options. It also serves as a popular
              social hub where students relax, collaborate and recharge between
              classes.
            </p>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-center text-4xl font-bold mb-12">
          Why Students Love It
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Affordable Pricing",
            "Freshly Prepared Meals",
            "Vegetarian & Non-Vegetarian Options",
            "Clean Dining Area",
            "Student Friendly Environment",
            "Quick Service",
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="card bg-base-100 shadow-lg border border-base-300"
            >
              <div className="card-body">
                <h3 className="font-bold text-lg">{feature}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MENU */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-center text-4xl font-bold mb-12">Food Menu</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuCategories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.04,
                y: -10,
              }}
              className="card bg-base-100 shadow-xl border border-base-300"
            >
              <div className="card-body">
                <h3 className="card-title text-2xl">
                  {category.emoji} {category.title}
                </h3>

                <ul className="space-y-3 mt-4">
                  {category.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* <div className="text-center mt-10">
          <button
            className="btn btn-primary btn-lg"
            onClick={() =>
              document.getElementById("menu_modal").showModal()
            }
          >
            View Complete Menu
          </button>
        </div> */}
      </section>

      {/* FAVORITES */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center">
            <h2 className="text-3xl font-bold mb-6">
              Student Favorites ⭐
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
              {favorites.map((item, index) => (
                <div
                  key={index}
                  className="badge badge-primary badge-lg p-4"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="hero bg-primary text-primary-content rounded-3xl">
          <div className="hero-content text-center py-16">
            <div>
              <h2 className="text-4xl font-bold">
                Enjoy Quality Food on Campus
              </h2>

              <p className="py-6 text-lg">
                Fresh, affordable and student-friendly dining experience.
              </p>

              <button
                className="btn btn-secondary"
                onClick={() =>
                  document.getElementById("menu_modal").showModal()
                }
              >
                View Full Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <dialog id="menu_modal" className="modal">
        <div className="modal-box max-w-4xl">
          <form method="dialog">
            <button className="btn btn-circle btn-sm btn-ghost absolute right-4 top-4">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-3xl mb-6">
            College Canteen Menu
          </h3>

          <div className="alert alert-info mb-6">
            <span>
              Menu items may vary depending on availability.
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <img
              src={menuImg}
              alt="Menu"
              className="rounded-xl shadow-lg w-full"
            />

            <div>
              <ul className="space-y-4 text-lg">
                <li>☕ Coffee</li>
                <li>🍵 Tea</li>
                <li>🍜 Maggi</li>
                <li>🍝 Noodles</li>
                <li>🥪 Sandwich</li>
                <li>🌯 Roll</li>
                <li>🍟 Snacks</li>
              </ul>
            </div>
          </div>
        </div>
      </dialog>

                <LogoStrip/>
    </>
  );
};

export default CollegeCanteen;