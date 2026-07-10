import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaQuoteRight, FaStar } from "react-icons/fa";
import api from "../../../services/api";

const EASE = [0.22, 1, 0.36, 1];

export default function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/google-reviews");
      setItems(res.data?.data || []);
    } catch (error) {
      console.error("Failed to load Google Reviews:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-28 bg-base-200">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-3 text-primary font-semibold text-xs tracking-[0.35em] uppercase">
            <span className="h-px w-8 bg-primary/50" />
            Google Reviews
            <span className="h-px w-8 bg-primary/50" />
          </span>

          <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-5 tracking-tight">
            What People Say About Us
          </h2>

          <p className="mt-4 max-w-3xl mx-auto text-base-content/60 text-sm md:text-base">
            Genuine reviews from our Google Profile.
          </p>
        </motion.div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">&#9733;</div>
            <h3 className="font-serif text-2xl font-semibold">
              No Google Reviews Found
            </h3>
            <p className="text-base-content/50 mt-3 text-sm">
              Reviews will appear here automatically once they are available.
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-16 md:w-24 bg-linear-to-r from-base-200 to-transparent z-10" />
            <div className="absolute right-0 top-0 h-full w-16 md:w-24 bg-linear-to-l from-base-200 to-transparent z-10" />

            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <motion.div
                className="flex gap-6 w-max"
                animate={paused ? {} : { x: ["0%", "-50%"] }}
                transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
              >
                {[...items, ...items].map((item, index) => {
                  const imageUrl =
                    item.profile_photo_url ||
                    "https://i.pravatar.cc/300?img=12";

                  return (
                    <div
                      key={`${index}-${item.author_name}`}
                      className="relative min-w-90 max-w-90 bg-base-100 border border-base-300/60 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-500"
                    >
                      <FaQuoteRight className="absolute top-6 right-6 text-primary/10 text-3xl" />

                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-1 ring-primary/20">
                          <img
                            src={imageUrl}
                            alt={item.author_name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                item.author_name
                              )}&background=random&color=fff`;
                            }}
                          />
                        </div>

                        <div>
                          <h3 className="font-serif font-semibold text-base">
                            {item.author_name}
                          </h3>

                          <div className="flex items-center gap-1 mt-1.5">
                            {Array.from({ length: item.rating || 0 }).map(
                              (_, i) => (
                                <FaStar key={i} className="text-amber-400 text-xs" />
                              )
                            )}
                          </div>

                          <p className="text-xs text-base-content/45 mt-1.5">
                            {item.relative_time_description}
                          </p>
                        </div>
                      </div>

                      <p className="mt-6 text-base-content/75 text-sm leading-relaxed line-clamp-6">
                        &ldquo;{item.text}&rdquo;
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}