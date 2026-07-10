import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";



const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function VerbenaFest() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get("/verbena");

setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) {
    return (
      <>
       

        <div className="min-h-screen flex justify-center items-center bg-base-100">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>

       
      </>
    );
  }

  return (
    <>

      <div className="bg-base-100 overflow-hidden">

        {/* HERO */}

        <section className="relative min-h-screen flex items-center">

          {data.heroImage && (
            <img
              src={data.heroImage}
              alt="Verbena"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/65"></div>

          <div className="absolute top-0 left-0 h-96 w-96 bg-primary/20 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 right-0 h-96 w-96 bg-secondary/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-6 relative z-10 text-center">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <span
                className="
                  inline-block
                  px-6
                  py-2
                  rounded-full
                  bg-base-100/10
                  backdrop-blur
                  text-white
                  border
                  border-base-100/20
                "
              >
                Annual Cultural Festival
              </span>

              <h1
                className="
                  text-5xl
                  md:text-7xl
                  font-black
                  text-white
                  mt-6
                "
              >
                Verbena
              </h1>

              <p
                className="
                  text-xl
                  md:text-2xl
                  text-white/90
                  max-w-3xl
                  mx-auto
                  mt-6
                "
              >
                {data.heroSubtitle}
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  justify-center
                  gap-4
                  mt-10
                "
              >

                <div
                  className="
                    px-6
                    py-3
                    rounded-full
                    bg-base-100/10
                    backdrop-blur
                    border
                    border-base-100/20
                    text-white
                  "
                >
                  📅 {formatDate(data.startDate)} - {formatDate(data.endDate)}
                </div>

                <div
                  className="
                    px-6
                    py-3
                    rounded-full
                    bg-base-100/10
                    backdrop-blur
                    border
                    border-base-100/20
                    text-white
                  "
                >
                  📍 {data.venue}
                </div>

              </div>

              <a
                href={data.registerLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-lg mt-10"
              >
                Register Now
              </a>

            </motion.div>

          </div>

        </section>
                {/* ABOUT SECTION */}

        <section className="py-24 bg-base-100">
          <div className="container mx-auto px-6">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img
                  src={data.aboutImage}
                  alt={data.aboutTitle}
                  className="
                    w-full
                    h-125
                    object-cover
                    rounded-4xl
                    shadow-2xl
                  "
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >

                <span
                  className="
                    text-primary
                    font-bold
                    uppercase
                    tracking-[3px]
                  "
                >
                  About Verbena
                </span>

                <h2
                  className="
                    text-5xl
                    font-black
                    text-primary
                    mt-4
                  "
                >
                  {data.aboutTitle}
                </h2>

                <p
                  className="
                    text-lg
                    leading-9
                    text-base-content/80
                    mt-8
                  "
                >
                  {data.aboutDescription}
                </p>

              </motion.div>

            </div>

          </div>
        </section>

        {/* EVENT CATEGORIES */}

      <section className="py-24 bg-base-200 overflow-hidden">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <span
        className="
          text-primary
          font-bold
          uppercase
          tracking-[3px]
        "
      >
        Festival Attractions
      </span>

      <h2
        className="
          text-5xl
          font-black
          text-primary
          mt-4
        "
      >
        Event Categories
      </h2>

      <p
        className="
          text-base-content/80
          mt-4
          max-w-3xl
          mx-auto
        "
      >
        Explore exciting competitions,
        performances, workshops and
        cultural celebrations designed
        to showcase creativity and talent.
      </p>
    </div>

    <div className="overflow-hidden">
      <motion.div
        className="flex gap-8 w-max"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          ease: "linear",
          duration: 30,
          repeat: Infinity,
        }}
      >
        {[...(data.eventCategories || []), ...(data.eventCategories || [])].map(
          (item, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="
                w-85
                md:w-90
                xl:w-95
                shrink-0
                bg-base-100
                rounded-4xl
                overflow-hidden
                shadow-lg
                border
                border-base-300
                hover:shadow-2xl
                transition-all
                duration-300
              "
            >
              <img
                src={item.image}
                alt={item.title}
                className="
                  w-full
                  h-64
                  object-cover
                "
              />

              <div className="p-6">
                <h3
                  className="
                    text-2xl
                    font-bold
                    text-primary
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    text-base-content/80
                    mt-4
                    leading-7
                  "
                >
                  {item.description}
                </p>
              </div>
            </motion.div>
          )
        )}
      </motion.div>
    </div>
  </div>
</section>
                {/* WHY PARTICIPATE */}

      <section className="py-24 bg-base-100 overflow-hidden">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <span
        className="
          text-secondary
          font-bold
          uppercase
          tracking-[3px]
        "
      >
        Benefits
      </span>

      <h2
        className="
          text-5xl
          font-black
          text-primary
          mt-4
        "
      >
        Why Participate?
      </h2>

      <p
        className="
          text-base-content/80
          mt-4
          max-w-2xl
          mx-auto
        "
      >
        Verbena is more than a festival.
        It's an opportunity to express,
        connect, learn and create lasting
        memories.
      </p>
    </div>

    <div className="overflow-hidden">
      <motion.div
        className="flex gap-8 w-max"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          ease: "linear",
          duration: 28,
          repeat: Infinity,
        }}
      >
        {[
          ...(data.whyParticipate || []),
          ...(data.whyParticipate || []),
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
            className="
              w-[320px]
              md:w-87.5
              xl:w-92.5
              shrink-0
              bg-base-100
              rounded-4xl
              overflow-hidden
              shadow-xl
              border
              border-base-300
              hover:shadow-2xl
              transition-all
              duration-300
            "
          >
            <img
              src={item.image}
              alt={item.title}
              className="
                w-full
                h-60
                object-cover
              "
            />

            <div className="p-6">
              <h3
                className="
                  text-xl
                  font-bold
                  text-primary
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  mt-4
                  text-base-content/80
                  leading-7
                "
              >
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
</section>

        {/* FESTIVAL TIMELINE */}

        <section className="py-24 bg-base-200">

          <div className="container mx-auto px-6">

            <div className="text-center mb-16">

              <span
                className="
                  text-accent
                  font-bold
                  uppercase
                  tracking-[3px]
                "
              >
                Festival Schedule
              </span>

              <h2
                className="
                  text-5xl
                  font-black
                  text-primary
                  mt-4
                "
              >
                Festival Timeline
              </h2>

            </div>

            <div className="max-w-4xl mx-auto">

              {data.timeline?.map((item, index) => (

                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="
                    relative
                    pl-10
                    pb-10
                    border-l-4
                    border-primary
                  "
                >

                  <div
                    className="
                      absolute
                      -left-3.5
                      top-0
                      h-6
                      w-6
                      rounded-full
                      bg-primary
                    "
                  />

                  <span className="badge badge-primary">
                    {item.day}
                  </span>

                  <h3
                    className="
                      text-2xl
                      font-bold
                      text-primary
                      mt-4
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      text-base-content/80
                      mt-3
                      leading-7
                    "
                  >
                    {item.description}
                  </p>

                </motion.div>

              ))}

            </div>

          </div>

        </section>
                {/* CTA */}

        <section className="py-24 bg-base-100">

          <div className="container mx-auto px-6">

            <motion.div
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className="
                rounded-[40px]
                bg-primary
                text-primary-content
                p-10
                md:p-16
                text-center
                shadow-2xl
              "
            >

              <h2
                className="
                  text-4xl
                  md:text-6xl
                  font-black
                "
              >
                Ready To Join Verbena?
              </h2>

              <p
                className="
                  text-lg
                  md:text-xl
                  mt-6
                  text-primary-content/90
                  max-w-3xl
                  mx-auto
                  leading-8
                "
              >
                Experience culture, creativity,
                music, dance, drama and unforgettable
                memories at the biggest celebration
                of campus life.
              </p>

              <a
                href={data.registerLink}
                target="_blank"
                rel="noreferrer"
                className="
                  btn
                  btn-secondary
                  btn-lg
                  mt-10
                "
              >
                Register Now
              </a>

            </motion.div>

          </div>

        </section>

      </div>

    

    </>
  );
}