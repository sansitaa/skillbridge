"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  Sparkles,
  Users,
  CreditCard,
  BookOpen,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Hexagon,
} from "lucide-react";

// ─── Strict Types ──────────────────────────────────────────────────────────────
interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  span?: "full" | "half" | "third";
}

interface FlowStepProps {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

// ─── Animation Physics & Variants ──────────────────────────────────────────────
// ─── Animation Physics & Variants ──────────────────────────────────────────────
const springWeighted = {
  type: "spring" as const,
  stiffness: 90,
  damping: 16,
  mass: 1.1,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: springWeighted,
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: springWeighted },
};

// ─── Reusable Components ───────────────────────────────────────────────────────
const GlassCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={scaleIn}
      transition={{ ...springWeighted, delay }}
      className={`relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-8 group ${className}`}
    >
      {/* Light-Leak Refraction Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const ShimmerButton = ({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" }) => {
  const isPrimary = variant === "primary";
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={springWeighted}
      className={`relative overflow-hidden rounded-full px-8 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300
        ${isPrimary ? "bg-white text-black" : "bg-transparent text-white border border-white/20 hover:bg-white/5"}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {isPrimary && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
        />
      )}
    </motion.button>
  );
};

// ─── Section Components ────────────────────────────────────────────────────────
const FloatingHeader = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.header
      ref={ref}
      initial={{ y: -20, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ ...springWeighted, delay: 0.1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
    >
      <nav className="flex items-center justify-between rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-3 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-white font-semibold tracking-tight">
          <Hexagon className="w-5 h-5 text-white/80" />
          <span>SkillBridge</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#flow" className="hover:text-white transition-colors">How it Works</a>
          <ShimmerButton variant="secondary" className="!px-4 !py-1.5 !text-xs">Sign In</ShimmerButton>
        </div>
      </nav>
    </motion.header>
  );
};

const HeroSection = () => {
  const headline = "Exchange Skills. Elevate Minds.";
  const words = headline.split(" ");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center overflow-hidden">
      {/* Ambient Depth Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/3 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <motion.div variants={fadeSlideUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5" />
          Peer-to-Peer Learning Reimagined
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white leading-[1.1] mb-8">
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={fadeSlideUp}
              className="inline-block mr-[0.25em] last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p variants={fadeSlideUp} className="mx-auto max-w-xl text-lg md:text-xl text-white/50 leading-relaxed mb-10">
          Trade expertise, earn credits, and master new crafts with a global community. No subscriptions. Just pure skill exchange.
        </motion.p>

        <motion.div variants={fadeSlideUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ShimmerButton variant="primary">
            Start Exchanging <ArrowRight className="w-4 h-4" />
          </ShimmerButton>
          <ShimmerButton variant="secondary">
            Explore Marketplace
          </ShimmerButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

const BentoGrid = () => {
  const cards: BentoCardProps[] = [
    { title: "Zero-Friction Matching", description: "AI-paired sessions based on skill complementarity, availability, and learning style.", icon: Zap, span: "half" },
    { title: "Credit Economy", description: "Earn universal credits for teaching. Spend them to learn anything, anytime.", icon: CreditCard, span: "third" },
    { title: "Verified Expertise", description: "Community-vetted skill badges ensure you're learning from proven practitioners.", icon: Shield, span: "third" },
    { title: "Global Classroom", description: "Connect with mentors and peers across 140+ countries in real-time.", icon: Globe, span: "third" },
    { title: "Live Collaborative Spaces", description: "Built-in whiteboards, code editors, and video rooms designed for hands-on teaching.", icon: BookOpen, span: "half" },
  ];

  const getSpanClass = (span?: string) => {
    switch (span) {
      case "half": return "md:col-span-2";
      case "third": return "md:col-span-1";
      default: return "md:col-span-1";
    }
  };

  return (
    <section id="features" className="relative px-6 py-24 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {cards.map((card, i) => (
          <GlassCard key={i} className={getSpanClass(card.span)} delay={i * 0.1}>
            <div className="flex flex-col h-full justify-between">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <card.icon className="w-6 h-6 text-white/80" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">{card.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{card.description}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>
    </section>
  );
};

const FlowSection = () => {
  const steps: FlowStepProps[] = [
    { step: 1, title: "Post Your Skill", description: "List what you can teach. Set availability and preferred exchange format.", icon: Users },
    { step: 2, title: "Match & Learn", description: "Get paired with a peer. Exchange knowledge in focused, distraction-free sessions.", icon: BookOpen },
    { step: 3, title: "Earn & Spend Credits", description: "Receive credits instantly. Redeem them for any skill on the platform.", icon: CreditCard },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="flow" ref={ref} className="relative px-6 py-32 max-w-6xl mx-auto overflow-hidden">
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="text-center mb-16"
      >
        <motion.h2 variants={fadeSlideUp} className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
          The Skill Transaction
        </motion.h2>
        <motion.p variants={fadeSlideUp} className="text-white/50 text-lg max-w-2xl mx-auto">
          A seamless, trustless exchange loop designed for creators, developers, and lifelong learners.
        </motion.p>
      </motion.div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
        <motion.div
          className="hidden md:block absolute top-1/2 left-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-y-1/2 z-0"
          initial={{ width: 0, opacity: 0 }}
          animate={inView ? { width: "100%", opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            variants={fadeSlideUp}
            className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3"
          >
            <GlassCard delay={i * 0.2} className="w-full max-w-sm mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
              </div>
            </GlassCard>
            <div className="flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-widest">
              <span>Step {step.step}</span>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 md:hidden" />}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="relative border-t border-white/10 px-6 py-16 text-center">
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
      <div className="flex items-center gap-2 text-white font-semibold tracking-tight">
        <Hexagon className="w-5 h-5 text-white/60" />
        <span>SkillBridge</span>
      </div>
      <p className="text-sm text-white/40 max-w-md leading-relaxed">
        Crafted for the curious. Built for the builders. Exchange knowledge without boundaries.
      </p>
      <div className="flex items-center gap-8 text-xs text-white/30">
        <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
        <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
        <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
      </div>
      <p className="text-[10px] text-white/20 tracking-wide mt-4">
        © {new Date().getFullYear()} SkillBridge Inc. Designed in Cupertino.
      </p>
    </div>
  </footer>
);

// ─── Main Page Export ──────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#050505] font-sans selection:bg-white/20 selection:text-white">
      <FloatingHeader />
      <HeroSection />
      <BentoGrid />
      <FlowSection />
      <Footer />
    </main>
  );
}