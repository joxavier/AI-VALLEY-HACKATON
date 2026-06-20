import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const sections = [
  {
    title: "SHOP",
    subtitle: "Merchandise & Products",
    description:
      "Explore exclusive Metaparlour merchandise, limited edition drops, and curated wellness products built for the community.",
    icon: ShoppingBag,
    route: "/shop",
    cta: "Browse Shop",
  },
  {
    title: "JOIN US",
    subtitle: "Community & Events",
    description:
      "Become part of the Metaparlour movement. Get early access to events, demos, and opportunities to grow with us.",
    icon: Users,
    route: "/joinUs",
    cta: "Get Involved",
  },
  {
    title: "WHITEPAPER",
    subtitle: "Vision & Strategy",
    description:
      "Dive deep into the Metaparlour ecosystem. Read our full vision, roadmap, and the technology powering service-based finance.",
    icon: FileText,
    route: "/whitepaper",
    cta: "Read Whitepaper",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src="/metaparlour-logo.svg" alt="MetaParlour" className="h-7" />
          <Button size="sm" asChild>
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(38_70%_60%/0.08)_0%,transparent_60%)]" />
        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-8xl lg:text-9xl leading-[0.9] mb-6 tracking-wider"
          >
            METAPARLOUR
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 font-light"
          >
            AI-Powered Operating System for Independent Service Professionals
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="h-px w-24 bg-primary/40 mx-auto"
          />
        </motion.div>
      </section>

      {/* 3 SECTIONS */}
      <section className="py-12 px-4">
        <motion.div
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {sections.map(({ title, subtitle, description, icon: Icon, route, cta }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group relative"
            >
              <div className="h-full rounded-xl border border-border/30 bg-card/60 backdrop-blur p-8 flex flex-col hover:border-primary/30 transition-all duration-300 hover:bg-card/80">
                <div className="mb-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl tracking-wider mb-1">
                    {title}
                  </h2>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest">
                    {subtitle}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  {description}
                </p>
                <Button
                  className="w-full group/btn"
                  asChild
                >
                  <a href={route}>
                    {cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/30 py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/metaparlour-logo.svg" alt="MetaParlour" className="h-5 opacity-60" />
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MetaParlour. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
