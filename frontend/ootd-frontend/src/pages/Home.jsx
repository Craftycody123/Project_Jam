import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shirt, ChevronDown, UploadCloud, PersonStanding, CloudSun } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background">
      <HomeNav />
      <CupboardHero />
      <FeatureGrid />
      <CTA />
      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto max-w-6xl px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-serif text-base font-semibold text-foreground">Atelier</span>
          <span>Your wardrobe, reimagined.</span>
        </div>
      </footer>
    </div>
  );
}

function HomeNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent backdrop-blur-sm bg-background/70">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex w-8 h-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shirt className="w-4 h-4" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">Atelier</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary">Log in</Link>
          <Link to="/signup" className="text-sm font-semibold px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function CupboardHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const leftDoor = useTransform(scrollYProgress, [0.05, 0.55], [0, -118]);
  const rightDoor = useTransform(scrollYProgress, [0.05, 0.55], [0, 118]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.45, 2.4]);
  const sceneOpacity = useTransform(scrollYProgress, [0.78, 0.95], [1, 0]);
  const frontOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const interiorOpacity = useTransform(scrollYProgress, [0.4, 0.62, 0.85], [0, 1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={ref} className="relative h-[340vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-[oklch(0.18_0.015_50)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,oklch(0.4_0.06_55_/_0.55),transparent_60%)]" />
        <motion.div style={{ scale: sceneScale, opacity: sceneOpacity }} className="perspective-near relative">
          <div className="preserve-3d relative h-[78vh] max-h-[640px] w-[86vw] max-w-[460px]">
            <div className="absolute inset-0 rounded-md overflow-hidden bg-[linear-gradient(180deg,oklch(0.26_0.03_48),oklch(0.14_0.02_45))] shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]">
              <div className="absolute inset-x-0 top-[22%] h-1.5 bg-[oklch(0.3_0.04_48)]" />
              <div className="absolute inset-x-0 top-[58%] h-1.5 bg-[oklch(0.3_0.04_48)]" />
              <div className="absolute inset-x-6 top-[10%] h-1 rounded-full bg-[oklch(0.55_0.04_60)]" />
              <motion.div style={{ opacity: interiorOpacity }}
                className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <p className="font-serif text-3xl sm:text-4xl font-semibold leading-tight text-[oklch(0.95_0.02_85)]">
                  Welcome inside.
                </p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-[oklch(0.82_0.02_85)]">
                  Every piece you own, catalogued and ready to wear. Keep scrolling to step into your wardrobe.
                </p>
              </motion.div>
            </div>

            <motion.div style={{ rotateY: leftDoor, transformOrigin: "left center" }}
              className="wood-grain backface-hidden absolute inset-y-0 left-0 w-1/2 rounded-l-md border-r border-[oklch(0.22_0.03_45)] shadow-[8px_0_24px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-3 rounded-sm border border-[oklch(0.34_0.04_48)]/60" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-2 rounded-full bg-[oklch(0.7_0.05_70)]" />
              <motion.div style={{ opacity: frontOpacity }} className="absolute inset-0 flex items-center justify-end pr-1">
                <span className="font-serif text-5xl sm:text-7xl font-semibold text-[oklch(0.92_0.03_82)]">Ate</span>
              </motion.div>
            </motion.div>

            <motion.div style={{ rotateY: rightDoor, transformOrigin: "right center" }}
              className="wood-grain backface-hidden absolute inset-y-0 right-0 w-1/2 rounded-r-md border-l border-[oklch(0.22_0.03_45)] shadow-[-8px_0_24px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-3 rounded-sm border border-[oklch(0.34_0.04_48)]/60" />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-2 rounded-full bg-[oklch(0.7_0.05_70)]" />
              <motion.div style={{ opacity: frontOpacity }} className="absolute inset-0 flex items-center justify-start pl-1">
                <span className="font-serif text-5xl sm:text-7xl font-semibold text-[oklch(0.92_0.03_82)]">lier</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[oklch(0.85_0.02_85)]">
          <span className="text-xs uppercase tracking-[0.2em]">Scroll to open</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    { icon: UploadCloud, title: "Catalog everything", body: "Snap a photo and tag category, color, fabric and style in seconds." },
    { icon: PersonStanding, title: "Style on a mannequin", body: "Layer pieces on a silhouette tuned to your real body type." },
    { icon: CloudSun, title: "Dress for the day", body: "Daily looks chosen for your occasion and the local weather." },
  ];
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl font-serif text-4xl sm:text-5xl font-semibold leading-tight">A closet that thinks with you.</h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Atelier turns your physical wardrobe into a living digital library — so you always know what you own and how to wear it.
        </p>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="bg-card p-8">
              <span className="flex w-11 h-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <f.icon className="w-5 h-5" />
              </span>
              <h3 className="mt-5 font-serif text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.18_0.015_50)] py-28 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.42_0.07_55_/_0.6),transparent_60%)]" />
      <div className="relative mx-auto max-w-2xl px-5">
        <h2 className="font-serif text-4xl sm:text-6xl font-semibold leading-tight text-[oklch(0.96_0.02_85)]">
          Open the doors to your wardrobe.
        </h2>
        <p className="mt-5 max-w-md mx-auto leading-relaxed text-[oklch(0.82_0.02_85)]">
          Build your digital closet in minutes and never stare at a full wardrobe with nothing to wear again.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link to="/signup" className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90">
            Create your wardrobe
          </Link>
          <Link to="/login" className="px-5 py-3 rounded-lg border border-[oklch(0.5_0.04_60)] text-[oklch(0.92_0.02_85)] hover:bg-[oklch(0.26_0.03_50)]">
            I already have one
          </Link>
        </div>
      </div>
    </section>
  );
}
