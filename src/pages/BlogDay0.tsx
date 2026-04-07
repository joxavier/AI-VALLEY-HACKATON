import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Sparkles, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const BlogDay0 = () => {
  const navigate = useNavigate();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Day 0 - Building Metaparlour",
    description:
      "The beauty industry is worth over $500B globally. Yet independent stylists and parlour owners still run on fragmented tools. We're building Metaparlour to change that.",
    author: { "@type": "Organization", name: "Metaparlour" },
    datePublished: "2026-03-07",
    dateModified: "2026-03-07",
    publisher: { "@type": "Organization", name: "Metaparlour" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Nav */}
        <header className="fixed top-0 w-full z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <img
              src="/metaparlour-logo.svg"
              alt="MetaParlour"
              className="h-7 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Home
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="relative pt-28 pb-16 px-6 border-b border-border/30 overflow-hidden">
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-[radial-gradient(ellipse,hsl(38_70%_60%/0.12)_0%,transparent_70%)] blur-2xl rounded-full" />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,transparent_60%,hsl(var(--background))_100%)]" />

          <motion.div
            className="relative z-10 max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Back */}
            <motion.button
              variants={fadeUp}
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-10 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </motion.button>

            {/* Meta badges */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary">
                <Tag className="h-3 w-3" />
                Journal
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                March 7, 2026
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl leading-[0.9] mb-5 tracking-wider"
            >
              Day{" "}
              <span className="text-primary">0</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg md:text-xl font-light max-w-xl">
              Where it begins. Before the momentum, before the habit — just the
              decision to start.
            </motion.p>
          </motion.div>
        </section>

        {/* Article body */}
        <main className="max-w-3xl mx-auto px-6 py-16">
          <motion.article
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="space-y-0"
          >
            {/* Intro paragraphs */}
            <div className="space-y-6 text-muted-foreground leading-relaxed text-[17px]">
              <motion.p variants={fadeUp}>
                Day zero is the one nobody sees. There's no streak to protect, no
                audience to disappoint, no inertia pulling you forward. Just you
                and the blank page.
              </motion.p>
              <motion.p variants={fadeUp}>
                This is where Metaparlour starts — not with a launch or an
                announcement, but with the quieter decision to write things down.
                To document what we're building, why we're building it, and what
                we learn along the way.
              </motion.p>
            </div>

            {/* Divider */}
            <motion.div variants={fadeUp} className="py-10">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </motion.div>

            {/* The core story */}
            <div className="space-y-6 text-muted-foreground leading-relaxed text-[17px]">
              <motion.p variants={fadeUp} className="text-foreground text-xl font-light">
                The beauty industry is worth over <span className="text-primary font-semibold">$500B</span> globally.
              </motion.p>
              <motion.p variants={fadeUp}>
                Yet the people actually driving that economy — independent
                stylists, barbers, and parlour owners — are still running their
                businesses on fragmented tools, spreadsheets, and platforms that
                take huge commissions.
              </motion.p>
              <motion.p variants={fadeUp} className="text-foreground text-lg italic">
                That never made sense to me.
              </motion.p>
              <motion.p variants={fadeUp}>
                We've outlined the full market opportunity in our{" "}
                <a
                  href="https://whitepaper.metaparlour.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors inline-flex items-center gap-1"
                >
                  whitepaper <ExternalLink className="h-3 w-3" />
                </a>
                . The data is clear. The opportunity is massive.
              </motion.p>

              <motion.div variants={fadeUp} className="py-4">
                <div className="pl-6 border-l-2 border-primary/40 space-y-2">
                  <p className="text-foreground text-lg">These professionals are entrepreneurs.</p>
                  <p className="text-foreground text-lg">They deserve infrastructure built for them.</p>
                  <p className="text-primary text-lg font-semibold">So we started building Metaparlour.</p>
                </div>
              </motion.div>

              <motion.p variants={fadeUp}>
                We're creating the operating system for the modern beauty
                entrepreneur — combining marketplace distribution, powerful
                business tools, and AI infrastructure designed to help parlour
                owners grow.
              </motion.p>
            </div>

            {/* VIP Launch CTA */}
            <motion.div variants={fadeUp} className="py-12">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card/80 to-accent/30 overflow-hidden group hover:border-primary/40 transition-all duration-300">
                <a
                  href="https://metaparlour.io/shop/events/betaDemo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src="https://metaparlour.io/metaparlourVIPevent.png"
                        alt="Metaparlour Yacht Party VIP Launch Event"
                        className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    </div>
                    <div className="p-8 -mt-8 relative z-10">
                      <div className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary mb-4">
                        <Sparkles className="h-3 w-3" />
                        Exclusive Event
                      </div>
                      <h3 className="text-3xl tracking-wider text-foreground mb-3 group-hover:text-primary transition-colors">
                        Yacht Party VIP Launch
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Join investors, service providers, and early users for an
                        exclusive demo of the Metaparlour platform. Network, learn,
                        and be part of the beginning.
                      </p>
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg group-hover:bg-primary/90 transition-colors">
                        Get Tickets <ArrowLeft className="h-4 w-4 rotate-180" />
                      </span>
                    </div>
                  </CardContent>
                </a>
              </Card>
            </motion.div>

            {/* Closing */}
            <div className="space-y-5 text-muted-foreground leading-relaxed text-[17px]">
              <motion.p variants={fadeUp}>Right now it's just the beginning.</motion.p>
              <motion.div variants={fadeUp} className="flex gap-6 text-foreground text-lg">
                <span>Small team.</span>
                <span className="text-primary">Big vision.</span>
                <span>A lot to build.</span>
              </motion.div>
              <motion.p variants={fadeUp}>
                Every company that changes an industry starts the same way.
              </motion.p>
            </div>

            {/* AMA CTA */}
            <motion.div variants={fadeUp} className="py-10">
              <a
                href="https://metaparlour.io/shop/events/AMA"
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline group"
              >
                <div className="rounded-xl border border-border/30 overflow-hidden hover:border-primary/30 transition-colors">
                  <img
                    src="https://metaparlour.io/metaparlourAMAevent.png"
                    alt="Metaparlour Monthly AMA"
                    className="w-full aspect-video object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="px-6 py-4 bg-card/60">
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      Join our monthly AMA: Ask us anything
                      <ArrowLeft className="h-3.5 w-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                    </p>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Sign-off */}
            <motion.div variants={fadeUp} className="pt-4">
              <p className="text-foreground text-2xl tracking-wider">
                Day <span className="text-primary">0</span>.
              </p>
            </motion.div>
          </motion.article>

          {/* Bottom divider */}
          <div className="py-16">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Footer nav */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              className="border-border/30 hover:bg-primary/5"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src="/metaparlour-logo.svg" alt="MetaParlour" className="h-5 opacity-60" />
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} MetaParlour. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BlogDay0;
