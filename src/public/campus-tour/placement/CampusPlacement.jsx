import RecruitersSection from "./components/RecruitersSection";
import PlacedStudents from "./components/PlacedStudents";

const CampusPlacement = () => {
  return (
    <>
      {/* Shared display/utility fonts for the placement pages — colors all
          come from the active daisyUI theme, this is typography only. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .cp-scope { font-family: 'Inter', sans-serif; }
        .cp-scope .f-display { font-family: 'Fraunces', serif; }
        .cp-scope .f-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="cp-scope bg-base-100 min-h-screen">
        {/* HERO */}
        <section className="relative overflow-hidden bg-neutral text-neutral-content py-24">
          {/* ruled-ledger texture, tinted with the theme's accent color */}
          <div
            className="absolute inset-0 opacity-[0.1] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 30px, var(--color-accent) 31px)",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-5 text-center">
            <p className="f-mono text-xs tracking-[0.3em] uppercase text-accent">
              Techno College Hooghly &nbsp;·&nbsp; Training &amp; Placement Cell
            </p>

            <h1 className="f-display mt-6 text-5xl md:text-6xl font-medium">
              Campus Placement
            </h1>

            <div className="mx-auto mt-6 h-px w-16 bg-accent" />

            <p className="mt-6 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-neutral-content/75">
              Connecting students with leading organizations and building
              successful careers.
            </p>
          </div>
        </section>

        {/* RECRUITERS */}
        <RecruitersSection />

        {/* PLACED STUDENTS */}
        <PlacedStudents />
      </div>
    </>
  );
};

export default CampusPlacement;