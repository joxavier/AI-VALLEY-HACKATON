import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Zap,
  DollarSign,
  BarChart3,
  Calendar,
  CreditCard,
  PieChart,
  Brain,
  Globe,
  TrendingUp,
  Users,
  Workflow,
  Wallet,
  LayoutDashboard,
  Sparkles,
  ChevronRight,
  LogIn,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 w-full z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src="/metaparlour-logo.svg" alt="MetaParlour" className="h-7" />
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => navigate("/auth")}>
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(38_70%_60%/0.08)_0%,transparent_60%)]" />
        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Already used by 5+ active barbers managing bookings and income
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl leading-[0.95] mb-6 tracking-wider">
            The Financial Operating System for Service-Based Entrepreneurs
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light">
            Metaparlour powers how barbers, braiders, and solo providers earn, get paid, and build wealth — all in one platform.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 h-12" onClick={() => navigate("/auth")}>
              Get Early Access <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12 border-primary/30 hover:bg-primary/5" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
              View Demo <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE PROBLEM */}
      <section className="py-20 px-4 border-t border-border/30">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl text-center mb-4 tracking-wider">
            Millions of service providers are financially invisible
          </motion.h2>
          <motion.p variants={fadeUp} className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
            They don't just lack software — they lack a financial system.
          </motion.p>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp}>
              <Card className="border-border/30 bg-card/60 backdrop-blur h-full">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-2xl tracking-wider text-primary">The Reality</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    {[
                      "Operate in cash-heavy, fragmented systems",
                      "Use multiple tools for bookings, payments, and tracking",
                      "Have no real financial infrastructure",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card className="border-border/30 bg-card/60 backdrop-blur h-full">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-2xl tracking-wider text-destructive">The Struggle</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    {[
                      "Tracking income accurately",
                      "Managing payouts and commissions",
                      "Proving income for credit, loans, or taxes",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 3. WHY NOW */}
      <section className="py-20 px-4 border-t border-border/30 bg-card/30">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl text-center mb-4 tracking-wider">
            Why this problem is worth solving now
          </motion.h2>
          <motion.p variants={fadeUp} className="text-center text-primary mb-14 text-lg">
            We're turning informal workers into financially empowered businesses.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Rise of solo entrepreneurship & creator economy" },
              { icon: Globe, label: "Billions in informal, untracked financial activity" },
              { icon: Zap, label: "Increasing demand for embedded finance & real-time payments" },
              { icon: TrendingUp, label: "Growing need for financial visibility" },
            ].map(({ icon: Icon, label }) => (
              <motion.div key={label} variants={fadeUp}>
                <Card className="border-border/30 bg-background/60 h-full hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6 text-center space-y-3">
                    <Icon className="mx-auto h-8 w-8 text-primary" />
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. THE SOLUTION */}
      <section className="py-20 px-4 border-t border-border/30">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl text-center mb-4 tracking-wider">
            From booking tool → to financial infrastructure
          </motion.h2>
          <motion.p variants={fadeUp} className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
            We don't just help you get booked — we help you get paid, tracked, and optimized.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: "Booking + Scheduling", desc: "Seamless appointment management" },
              { icon: CreditCard, title: "Integrated Payments", desc: "Accept payments effortlessly" },
              { icon: DollarSign, title: "Automated Payouts", desc: "Split between shop & provider" },
              { icon: BarChart3, title: "Earnings & Insights", desc: "Track and optimize your income" },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="border-border/30 bg-card/60 h-full hover:border-primary/30 transition-colors group">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl tracking-wider">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. FOCUS AREAS */}
      <section className="py-20 px-4 border-t border-border/30 bg-card/30">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl text-center mb-14 tracking-wider">
            Built at the intersection of fintech innovation
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { badge: "Primary", title: "Banking, Payments & Money Movement", desc: "Real-time payments and payout infrastructure", icon: Wallet },
              { badge: "Primary", title: "Compliance, Reporting & Back Office", desc: "Automated income tracking and financial records", icon: PieChart },
              { badge: "Secondary", title: "Advisory, Wealth & Client Experience", desc: "AI-powered financial insights for providers", icon: Brain },
              { badge: "Secondary", title: "Crypto, Stablecoins & Onchain Finance", desc: "Instant global payouts via stablecoins", icon: Globe },
            ].map(({ badge, title, desc, icon: Icon }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="border-border/30 bg-background/60 h-full">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary shrink-0" />
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge === "Primary" ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                        {badge}
                      </span>
                    </div>
                    <h3 className="text-xl tracking-wider">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 6. ARCHITECTURE */}
      <section className="py-20 px-4 border-t border-border/30">
        <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl text-center mb-4 tracking-wider">
            Event-driven financial infrastructure
          </motion.h2>
          <motion.p variants={fadeUp} className="text-center text-muted-foreground mb-14">
            Every transaction becomes a financial event.
          </motion.p>
          <div className="relative">
            {/* Flow steps */}
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { step: "1", title: "Booking Event", desc: "User books service", icon: Calendar },
                { step: "2", title: "Payment Processing", desc: "Payment captured instantly", icon: CreditCard },
                { step: "3", title: "Workflow Automation", desc: "Notifications, revenue logging, payout logic", icon: Workflow },
                { step: "4", title: "Payout Infrastructure", desc: "Funds split: provider & shop owner", icon: DollarSign },
                { step: "5", title: "Dashboard + Insights", desc: "Earnings tracking & AI insights", icon: BarChart3 },
              ].map(({ step, title, desc, icon: Icon }, i) => (
                <motion.div key={step} variants={fadeUp} className="relative">
                  <Card className="border-border/30 bg-card/60 h-full">
                    <CardContent className="pt-6 text-center space-y-2">
                      <div className="mx-auto h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                        {step}
                      </div>
                      <Icon className="mx-auto h-5 w-5 text-primary/60" />
                      <h4 className="text-sm tracking-wider leading-tight">{title}</h4>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </CardContent>
                  </Card>
                  {i < 4 && (
                    <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40 z-10" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <motion.div variants={fadeUp} className="mt-14">
            <h3 className="text-2xl text-center tracking-wider mb-6">Key Tools Used</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "n8n", desc: "Backend automation & financial workflows" },
                { name: "Crossmint", desc: "Wallets & instant payouts" },
                { name: "Lovable", desc: "Frontend development" },
                { name: "MiniMax", desc: "Financial insights & assistant" },
              ].map(({ name, desc }) => (
                <div key={name} className="px-5 py-3 rounded-lg border border-border/30 bg-card/40 text-center">
                  <p className="text-sm font-semibold text-primary">{name}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 7. DEMO FLOW */}
      <section className="py-20 px-4 border-t border-border/30 bg-card/30">
        <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl mb-4 tracking-wider">
            A single booking triggers an entire financial system
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground mb-14">Every transaction becomes a financial event.</motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[
              "Customer books haircut",
              "Payment is processed",
              "Funds automatically split",
              "Barber gets paid instantly",
              "Earnings dashboard updates",
              "AI suggests pricing optimization",
            ].map((step, i) => (
              <motion.div key={step} variants={fadeUp} className="flex items-center gap-3 px-5 py-4 rounded-lg border border-border/30 bg-background/60">
                <span className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 8. WHY NOW */}
      <section className="py-20 px-4 border-t border-border/30">
        <motion.div className="max-w-5xl mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl mb-14 tracking-wider">
            Perfect timing for a financial layer like this
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Explosion of solo entrepreneurs",
              "Shift toward real-time payments",
              "Growth of stablecoins & programmable money",
              "Demand for vertical SaaS + fintech hybrids",
            ].map((item) => (
              <motion.div key={item} variants={fadeUp}>
                <Card className="border-border/30 bg-card/60 h-full hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <TrendingUp className="mx-auto h-6 w-6 text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 9. VISION */}
      <section className="py-20 px-4 border-t border-border/30 bg-card/30">
        <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl mb-4 tracking-wider">
            Powering the financial layer of the service economy
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground mb-10 text-lg">
            Today: Barbers & beauty. Tomorrow: Every service-based entrepreneur globally.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-10">
            {["Fitness Trainers", "Tutors", "Creators", "Freelancers"].map((role) => (
              <span key={role} className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm">
                {role}
              </span>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-xl text-primary tracking-wide">
            If Stripe powers the internet, Metaparlour powers the people behind it.
          </motion.p>
        </motion.div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-24 px-4 border-t border-border/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(38_70%_60%/0.06)_0%,transparent_60%)]" />
        <motion.div className="max-w-3xl mx-auto text-center relative z-10" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl mb-6 tracking-wider">
            Join the future of service-based finance
          </motion.h2>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 h-12" onClick={() => navigate("/auth")}>
              Get Early Access <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12 border-primary/30 hover:bg-primary/5" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
              View Demo <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/30 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/metaparlour-logo.svg" alt="MetaParlour" className="h-5 opacity-60" />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MetaParlour. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
