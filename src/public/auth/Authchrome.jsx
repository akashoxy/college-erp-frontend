import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  COLORS is kept only for the decorative bits (ambient glow, motes,  */
/*  crest ring) that sit outside DaisyUI's component vocabulary.       */
/*  Everything else below now reads its color from the DaisyUI theme   */
/*  ("technocollege", defined inline inside <Fonts /> below) via       */
/*  semantic classes: base-100/200/300, base-content, primary, etc.    */
/* ------------------------------------------------------------------ */
export const COLORS = {
  ink: "#0B0F16",
  ink2: "#141B26",
  parchment: "#F4EFE6",
  brass: "#C7A464",
  brassDim: "#8C7239",
  wine: "#7A2E36",
  sage: "#4B6358",
};

/* ---------------------------------------------------------------- */
/*  Fonts — a restrained editorial serif paired with a quiet sans    */
/* ---------------------------------------------------------------- */
export function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
      .font-display { font-family: 'Fraunces', serif; }
      .font-body { font-family: 'Inter', sans-serif; }

      /* DaisyUI theme — maps the ink/parchment/brass palette onto */
      /* DaisyUI's semantic tokens (base-100/200/300, primary, etc) */
      /* so every btn/input/select/tabs/steps/card class below just */
      /* works, no separate theme file needed. */
      [data-theme="technocollege"] {
        color-scheme: dark;
        --color-base-100: #141B26;
        --color-base-200: #0B0F16;
        --color-base-300: #0B0F16;
        --color-base-content: #F4EFE6;
        --color-primary: #C7A464;
        --color-primary-content: #0B0F16;
        --color-secondary: #7A2E36;
        --color-secondary-content: #F4EFE6;
        --color-accent: #4B6358;
        --color-accent-content: #F4EFE6;
        --color-neutral: #8C7239;
        --color-neutral-content: #F4EFE6;
        --color-info: #4B6358;
        --color-info-content: #F4EFE6;
        --color-success: #4B6358;
        --color-success-content: #F4EFE6;
        --color-warning: #C7A464;
        --color-warning-content: #0B0F16;
        --color-error: #7A2E36;
        --color-error-content: #F4EFE6;
        --radius-box: 0.25rem;
        --radius-field: 0rem;
        --radius-selector: 0rem;
        --border: 1px;
      }

      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}

/* ---------------------------------------------------------------- */
/*  Ambient background — ink field, one slow glow, drifting motes    */
/*  (kept as bespoke atmosphere; not a DaisyUI concern)               */
/* ---------------------------------------------------------------- */
const MOTES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: 2 + (i % 3),
  left: (i * 53) % 100,
  delay: (i % 5) * 1.6,
  duration: 18 + (i % 6) * 3,
}));

export function AmbientBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div
        className="absolute inset-0 bg-base-200"
        style={{
          backgroundImage: `radial-gradient(ellipse at 15% 15%, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 55%),
                       radial-gradient(ellipse at 85% 85%, color-mix(in srgb, var(--color-primary) 6%, transparent), transparent 55%)`,
        }}
      />
      <motion.div
        animate={reduceMotion ? { opacity: 0.18 } : { opacity: [0.12, 0.26, 0.12], scale: [1, 1.06, 1] }}
        transition={reduceMotion ? {} : { duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl bg-primary/10"
      />
      {!reduceMotion &&
        MOTES.map((m) => (
          <motion.span
            key={m.id}
            className="absolute rounded-full bg-primary/55"
            style={{
              width: m.size,
              height: m.size,
              left: `${m.left}%`,
              top: "100%",
            }}
            animate={{ top: ["100%", "-5%"], opacity: [0, 0.55, 0] }}
            transition={{
              duration: m.duration,
              repeat: Infinity,
              delay: m.delay,
              ease: "linear",
            }}
          />
        ))}
    </>
  );
}

/* ---------------------------------------------------------------- */
/*  Mobile brand bar — the BrandPanel is desktop-only (lg:flex), so   */
/*  phones and tablets get this compact wordmark instead of losing    */
/*  the brand entirely                                                */
/* ---------------------------------------------------------------- */
export function MobileBrandBar({ title = "Techno College", subtitle = "HOOGHLY" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="lg:hidden flex items-center gap-3 mb-6"
    >
      <div className="w-11 h-11 rounded-full border border-primary/40 flex items-center justify-center shrink-0">
        <span className="font-display text-xs tracking-[0.15em] text-primary">TCH</span>
      </div>
      <div>
        <p className="font-display text-lg leading-tight text-base-content">{title}</p>
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary/75">{subtitle}</p>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */
/*  Toast — replaces native alert()/confirm() popups with an          */
/*  in-chrome notification that matches the rest of the surface       */
/* ---------------------------------------------------------------- */
export function Toast({ toast, onClose, duration = 3200 }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [toast, duration, onClose]);

  return (
    <div className="toast toast-top toast-center sm:toast-end z-50 px-4 sm:px-0">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`alert font-body text-sm shadow-xl border rounded max-w-sm ${
              toast.type === "error"
                ? "alert-error border-error/30"
                : "alert-success border-success/30"
            }`}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Success seal — the payoff moment after a completed flow           */
/*  (password reset, registration): a ring draws in, then a check     */
/*  stroke traces itself, echoing the Crest's construction             */
/* ---------------------------------------------------------------- */
export function SuccessSeal({ label = "Success", sublabel }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-8 text-center">
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-primary">
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>
        <motion.svg
          viewBox="0 0 24 24"
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
          />
        </motion.svg>
      </div>
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.4 }}
          className="font-display text-xl text-base-content"
        >
          {label}
        </motion.p>
        {sublabel && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="font-body text-xs mt-2 text-base-content/50"
          >
            {sublabel}
          </motion.p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Crest — the one signature move: a hairline seal that inscribes   */
/*  itself on load, with a slow independent ring turning behind it   */
/* ---------------------------------------------------------------- */
export function Crest({ initials = "TCH" }) {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible text-primary">
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="37"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 5"
          style={{ transformOrigin: "50px 50px", opacity: 0.4 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.05, duration: 0.5 }}
        className="font-display text-xl tracking-[0.2em] text-base-content"
      >
        {initials}
      </motion.span>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Brand panel — wordmark, kicker, feature list, subtle glass tilt  */
/* ---------------------------------------------------------------- */
export function BrandPanel({ title = "Techno College", subtitle = "HOOGHLY", features = [] }) {
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rX = useSpring(useTransform(mvY, [-80, 80], [5, -5]), { stiffness: 150, damping: 20 });
  const rY = useSpring(useTransform(mvX, [-80, 80], [-5, 5]), { stiffness: 150, damping: 20 });

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mvX.set(e.clientX - rect.left - rect.width / 2);
    mvY.set(e.clientY - rect.top - rect.height / 2);
  }
  function onLeave() {
    mvX.set(0);
    mvY.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformPerspective: 900 }}
      className="hidden lg:flex flex-col items-start justify-center h-full gap-10 px-6"
    >
      <Crest />

      <div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-body text-xs tracking-[0.35em] uppercase mb-3 text-primary/85"
        >
          Enterprise ERP Platform
        </motion.p>

        <h1 className="font-display text-5xl font-medium leading-[1.1] text-base-content">
          {title.split(" ").map((w, i) => (
            <motion.span
              key={w + i}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.32 + i * 0.14, duration: 0.65 }}
              className="inline-block mr-3"
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="font-body text-lg tracking-[0.45em] mt-2 text-primary"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.95, duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: "left" }}
          className="h-px w-40 mt-6 bg-primary/40"
        />
      </div>

      {features.length > 0 && (
        <ul className="space-y-4">
          {features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.15 + i * 0.15, duration: 0.5 }}
              className="font-body flex items-center gap-3 text-sm text-base-content/65"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {f}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */
/*  Card shell — DaisyUI `card` surface with a hairline that draws   */
/*  itself in                                                         */
/* ---------------------------------------------------------------- */
export function CardShell({ children, shake = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0, x: shake ? [0, -10, 10, -6, 6, 0] : 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="card relative overflow-hidden bg-base-100/70 border border-base-content/10 backdrop-blur-sm rounded"
    >
      <motion.div
        className="h-px w-full bg-primary"
        style={{ transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
      />
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */
/*  Role tabs — DaisyUI `tabs` structure, brass indicator slides      */
/*  between via layoutId (kept as the signature motion detail)       */
/* ---------------------------------------------------------------- */
export function RoleTabs({ roles, active, onChange, layoutId }) {
  return (
    <div role="tablist" className="tabs border-b border-base-content/10 flex-nowrap overflow-x-auto scrollbar-hide">
      {roles.map((r) => (
        <button
          key={r.key}
          type="button"
          role="tab"
          onClick={() => onChange(r.key)}
          className={`tab font-body relative h-auto pb-4 pt-1 !gap-2 text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap shrink-0 transition-colors ${
            active === r.key ? "text-base-content" : "text-base-content/40"
          }`}
        >
          <span className={active === r.key ? "text-primary" : ""}>{r.icon}</span>
          {r.label}
          {active === r.key && (
            <motion.span
              layoutId={layoutId}
              className="absolute left-0 right-0 -bottom-px h-[2px] bg-primary"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Fields — DaisyUI `input`/`label` primitives, underline rule       */
/*  expands in on focus                                               */
/* ---------------------------------------------------------------- */
export function TextField({ icon: Icon, type = "text", placeholder, value, onChange, name }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className={`input input-ghost w-full flex items-center gap-3 rounded-none border-0 border-b bg-transparent px-0 transition-colors ${
          focused ? "border-primary/30" : "border-base-content/15"
        }`}
      >
        {Icon && (
          <Icon
            className={`text-base transition-colors ${focused ? "text-primary" : "text-base-content/35"}`}
          />
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="font-body grow bg-transparent outline-none border-none text-sm text-base-content placeholder:text-base-content/40"
        />
      </label>
      <motion.div
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="h-[1.5px] w-full bg-primary"
      />
    </div>
  );
}

export function PasswordField({ value, onChange, placeholder, name, icon: Icon }) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        className={`input input-ghost w-full flex items-center gap-3 rounded-none border-0 border-b bg-transparent px-0 transition-colors ${
          focused ? "border-primary/30" : "border-base-content/15"
        }`}
      >
        {Icon && (
          <Icon
            className={`text-base transition-colors ${focused ? "text-primary" : "text-base-content/35"}`}
          />
        )}
        <input
          type={visible ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="font-body grow bg-transparent outline-none border-none text-sm text-base-content placeholder:text-base-content/40"
        />

        <motion.button
          type="button"
          onClick={() => setVisible((v) => !v)}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.08 }}
          className="btn btn-ghost btn-xs btn-circle shrink-0 text-base-content/35 hover:bg-transparent hover:text-base-content/60"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {visible ? (
              <motion.span
                key="hide"
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <FaEyeSlash />
              </motion.span>
            ) : (
              <motion.span
                key="show"
                initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <FaEye />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </label>
      <motion.div
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="h-[1.5px] w-full bg-primary"
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Select — DaisyUI `select`, underline rule expands in on focus,   */
/*  matching TextField                                                */
/* ---------------------------------------------------------------- */
export function SelectField({ name, value, onChange, options, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`select select-ghost w-full rounded-none border-0 border-b bg-transparent px-0 font-body text-sm transition-colors ${
          focused ? "border-primary/30" : "border-base-content/15"
        } ${value ? "text-base-content" : "text-base-content/40"}`}
      >
        <option value="" className="bg-base-100 text-base-content/60">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-base-100 text-base-content">
            {o.label}
          </option>
        ))}
      </select>
      <motion.div
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="h-[1.5px] w-full bg-primary"
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Buttons — DaisyUI `btn`, restrained shimmer, lift on hover        */
/* ---------------------------------------------------------------- */
export function ElegantButton({ children, variant = "solid", className = "", ...props }) {
  const solid = variant === "solid";
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={`btn ${solid ? "btn-primary" : "btn-outline border-base-content/20 text-base-content hover:bg-transparent hover:border-base-content/40"} font-body relative overflow-hidden w-full rounded-none py-4 h-auto text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 shadow-none ${
        solid ? "shadow-[0_10px_30px_rgba(199,164,100,0.18)]" : ""
      } ${className}`}
      {...props}
    >
      <motion.span
        className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)]"
        initial={{ x: "-120%" }}
        whileHover={{ x: "120%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

/* ---------------------------------------------------------------- */
/*  Steps — DaisyUI `steps` component, replaces the hand-built        */
/*  step indicator (used by ForgotPassword)                          */
/* ---------------------------------------------------------------- */
export function AuthSteps({ current, labels }) {
  return (
    <ul className="steps steps-horizontal w-full mb-10">
      {labels.map((label, i) => {
        const n = i + 1;
        return (
          <li
            key={label}
            data-content={current >= n ? "●" : n}
            className={`step font-body text-xs uppercase tracking-widest ${
              current >= n ? "step-primary text-base-content" : "text-base-content/35"
            }`}
          >
            {label}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------------------------------------------------------- */
/*  Footer                                                            */
/* ---------------------------------------------------------------- */
export function AuthFooter({ logo, name = "Techno College Hooghly", badge = "Version 2.0" }) {
  return (
    <div className="px-6 sm:px-10 py-5 sm:py-6 flex flex-wrap items-center justify-between gap-3 border-t border-base-content/10">
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="w-8 h-8 rounded-full ring-1 ring-primary">
            <img src={logo} alt="College Logo" className="object-cover" />
          </div>
        </div>
        <div>
          <p className="font-body text-xs font-medium text-base-content">{name}</p>
          <p className="font-body text-[10px] uppercase tracking-widest text-base-content/40">
            Enterprise ERP Platform
          </p>
        </div>
      </div>
      <span className="badge badge-outline badge-primary font-body text-[10px] uppercase tracking-widest px-3 py-1 h-auto">
        {badge}
      </span>
    </div>
  );
}