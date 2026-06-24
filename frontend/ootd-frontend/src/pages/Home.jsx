import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Shirt,
  ChevronDown,
  UploadCloud,
  PersonStanding,
  CloudSun,
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[#F5EFE4]">
      <HomeNav />
      <CupboardHero />
      <FeatureGrid />
      <CTA />
    </div>
  );
}

function HomeNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#F5EFE4] border-b border-[#d6c8b4] shadow-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex w-9 h-9 items-center justify-center rounded-lg bg-[#3B2F25] text-[#F5EFE4]">
            <Shirt className="w-4 h-4" />
          </span>

          <span className="font-serif text-xl font-semibold tracking-wide text-[#3B2F25]">
            ATELIER
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg bg-[#EFE4D2] text-[#3B2F25] font-medium border border-[#CBB89D] hover:bg-[#e7dac5] transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg bg-[#3B2F25] text-[#F5EFE4] font-medium hover:bg-[#5B4329] transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

function CupboardHero() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // DOORS
  const leftDoor = useTransform(
    scrollYProgress,
    [0.05, 0.45],
    [0, -140]
  );

  const rightDoor = useTransform(
    scrollYProgress,
    [0.05, 0.45],
    [0, 140]
  );

  // SCALE
  const sceneScale = useTransform(
    scrollYProgress,
    [0, 0.7],
    [1, 1.4]
  );

  // ATELIER TEXT
  const atelierOpacity = useTransform(
    scrollYProgress,
    [0.30, 0.42, 0.52],
    [0, 1, 0]
  );

  // WELCOME TEXT
  const welcomeOpacity = useTransform(
    scrollYProgress,
    [0.50, 0.62],
    [0, 1]
  );

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-[80px] h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center bg-[#2B2118]">

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(122,90,62,0.45),transparent_65%)]" />

        {/* CUPBOARD */}
        <motion.div
          style={{ scale: sceneScale }}
          className="relative"
        >
          <div className="relative h-[82vh] w-[92vw] max-w-[620px]">

            {/* INSIDE */}
            <div className="absolute inset-0 rounded-md overflow-hidden bg-gradient-to-b from-[#3B2F25] to-[#1f1712] shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]">

              {/* Shelves */}
              <div className="absolute inset-x-0 top-[26%] h-1 bg-[#5B4329]" />
              <div className="absolute inset-x-0 top-[58%] h-1 bg-[#5B4329]" />

              {/* Hanging Rod */}
              <div className="absolute top-[12%] left-10 right-10 h-1 rounded-full bg-[#CBB89D]" />

              {/* ATELIER */}
              <motion.div
                style={{ opacity: atelierOpacity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <h1 className="font-serif text-6xl md:text-8xl tracking-[0.25em] text-[#F5EFE4]">
                  ATELIER
                </h1>
              </motion.div>

              {/* WELCOME */}
              <motion.div
                style={{ opacity: welcomeOpacity }}
                className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
              >
                <p className="uppercase tracking-[0.3em] text-xs text-[#D8B98A] mb-5">
                  Welcome Inside
                </p>

                <h2 className="font-serif text-5xl md:text-6xl text-[#F5EFE4] mb-6">
                  Your wardrobe, reimagined.
                </h2>

                <p className="max-w-xl text-lg leading-relaxed text-[#e7d9c4]">
                  Curate outfits, organize every piece, and discover combinations
                  you'd never have thought of.
                </p>
              </motion.div>
            </div>

            {/* LEFT DOOR */}
            <motion.div
              style={{
                rotateY: leftDoor,
                transformOrigin: "left center",
              }}
              className="absolute inset-y-0 left-0 w-1/2 rounded-l-md bg-gradient-to-br from-[#7A5A3E] via-[#5B4329] to-[#3B2F25] border-r border-[#2a2018] shadow-[10px_0_25px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-4 border border-[#9b7a59]/40 rounded-sm" />

              <div className="absolute right-4 top-1/2 -translate-y-1/2 h-16 w-2 rounded-full bg-[#D8B98A]" />
            </motion.div>

            {/* RIGHT DOOR */}
            <motion.div
              style={{
                rotateY: rightDoor,
                transformOrigin: "right center",
              }}
              className="absolute inset-y-0 right-0 w-1/2 rounded-r-md bg-gradient-to-br from-[#7A5A3E] via-[#5B4329] to-[#3B2F25] border-l border-[#2a2018] shadow-[-10px_0_25px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-4 border border-[#9b7a59]/40 rounded-sm" />

              <div className="absolute left-4 top-1/2 -translate-y-1/2 h-16 w-2 rounded-full bg-[#D8B98A]" />
            </motion.div>
          </div>
        </motion.div>

        {/* SCROLL TEXT */}
        <motion.div
          style={{
            opacity: useTransform(
              scrollYProgress,
              [0, 0.15],
              [1, 0]
            ),
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="uppercase tracking-[0.3em] text-xs text-[#F5EFE4]/80">
            Scroll Down
          </span>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
          >
            <ChevronDown className="w-5 h-5 text-[#F5EFE4]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    {
      icon: UploadCloud,
      title: "Catalog everything",
      body: "Snap and organize every outfit piece in seconds.",
    },
    {
      icon: PersonStanding,
      title: "Style visually",
      body: "Preview combinations on a body-type mannequin.",
    },
    {
      icon: CloudSun,
      title: "Smart recommendations",
      body: "Looks curated for weather, mood and occasion.",
    },
  ];

  return (
    <section className="py-24 bg-[#F5EFE4]">
      <div className="mx-auto max-w-6xl px-6">

        <h2 className="font-serif text-5xl text-[#3B2F25] mb-4">
          A closet that thinks with you.
        </h2>

        <p className="max-w-2xl text-lg text-[#5B4329] leading-relaxed">
          ATELIER transforms your wardrobe into a digital styling experience.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[#d8cab6] bg-white p-8 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-[#EFE4D2] text-[#3B2F25]">
                <f.icon className="w-6 h-6" />
              </div>

              <h3 className="mt-6 font-serif text-2xl text-[#3B2F25]">
                {f.title}
              </h3>

              <p className="mt-3 text-[#5B4329] leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-[#2B2118] py-24 text-center">
      <div className="mx-auto max-w-3xl px-6">

        <h2 className="font-serif text-5xl text-[#F5EFE4] leading-tight">
          Open the doors to your wardrobe.
        </h2>

        <p className="mt-6 text-lg text-[#d8cab6] leading-relaxed">
          Build your digital closet and discover better outfit combinations every day.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg bg-[#F5EFE4] text-[#3B2F25] font-medium hover:bg-[#e7dac5] transition"
          >
            Create Account
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-lg border border-[#d8cab6] text-[#F5EFE4] hover:bg-[#3B2F25] transition"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}