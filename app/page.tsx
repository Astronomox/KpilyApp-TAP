import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  WaveLines,
  ConfettiMarks,
  RainMarks,
} from "@/components/landing/Decorations";
import styles from "./page.module.css";

// Real nav, from the production site's own mainNav config
// (About Us, Blog, Pricing -- there is no separate "Features" link
// despite the on-page section id).
const NAV_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Blog", href: "#blog" },
  { label: "Pricing", href: "#pricing" },
];

// Real partner logos from the production "trusted by" strip. Five of
// six were supplied directly as files (oracle, morpheus, samsung,
// monday, cowrywifi); trudolegal wasn't provided, so it's a plain
// text fallback rather than a fabricated logo.
const TRUSTED_BY = [
  { name: "Oracle", src: "/assets/logos/oracle.png" },
  { name: "Morpheus", src: "/assets/logos/morpheus.png" },
  { name: "Samsung", src: "/assets/logos/samsung.png" },
  { name: "monday.com", src: "/assets/logos/monday.png" },
  { name: "TrudoLegal", src: null },
  { name: "CowryWifi", src: "/assets/logos/cowrywifi.png" },
];

// Real icon colors, from the production "Why Choose Us" card config:
// bg-secondary-light, bg-primary-light, bg-primary-lighter, bg-secondary
const WHY_CARDS = [
  {
    color: "var(--kpily-blue-light)",
    title: "Feedback",
    body: "Real-time feedback system with points and gamification helps team members receive instant feedback and stay motivated to improve their performance.",
  },
  {
    color: "var(--kpily-green-light)",
    title: "Transparency",
    body: "Transparent and accessible information, teams can collaborate better, identify areas for improvement, and celebrate successes together.",
  },
  {
    color: "var(--kpily-mint)",
    title: "Easy to use",
    body: "User-friendly interface makes it easy for team members to use the platform and stay on top of their goals and metrics.",
  },
  {
    color: "var(--kpily-blue)",
    title: "Data driven",
    body: "Teams can track their performance with accuracy, identify areas to improve, and make data-backed decisions.",
  },
];

const PRICING_PLANS = [
  {
    name: "Growth Track",
    price: "$49.99",
    seats: "For up to 50 employees",
    color: "var(--pricing-green)",
  },
  {
    name: "Starter Pulse",
    price: "$0",
    seats: "For up to 5 employees",
    color: "var(--pricing-blue)",
  },
  {
    name: "Enterprise Vision",
    price: "$199.99",
    seats: "For up to 1000 employees",
    color: "var(--pricing-gray)",
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <Logo className={styles.navLogoSvg} />
          <span className={styles.navLogoTagline}>Performance Management</span>
        </Link>
        <nav className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.navSignIn}>
            Sign In
          </Link>
          <Link href="/register" className={styles.navTrial}>
            Start 15-day Free Trial
          </Link>
          <span className={styles.navLang}>En</span>
          <button
            type="button"
            className={styles.navMenuButton}
            aria-label="Open menu"
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <line x1="0" y1="1" x2="20" y2="1" stroke="var(--kpily-text)" strokeWidth="1.6" />
              <line x1="0" y1="7" x2="20" y2="7" stroke="var(--kpily-text)" strokeWidth="1.6" />
              <line x1="0" y1="13" x2="20" y2="13" stroke="var(--kpily-text)" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
      </header>

      <section className={styles.hero}>
        <WaveLines className={styles.heroWaveBg} />

        <div className={styles.heroCopy}>
          <h1>
            Transform Your Business Performance
            <br />
            with KPILY
          </h1>
          <p className={styles.heroSubtext}>
            Real-Time Feedback and Performance Tracking App for Your Team
          </p>
          <div className={styles.heroActions}>
            <Link href="/register" className={styles.btnPrimary}>
              Get Started
            </Link>
            <a href="#how-it-works" className={styles.heroVideoLink}>
              <span className={styles.playCircle} aria-hidden="true">
                ▶
              </span>
              See How It Works
            </a>
          </div>
        </div>
        <div className={styles.heroImageWrap}>
          <Image
            src="/assets/landing-hero-full.png"
            alt="KPILY dashboard preview showing feedback stats, points received, and team status"
            width={735}
            height={806}
            priority
            className={styles.heroImg}
          />
        </div>
      </section>

      <section className={styles.trustedBy}>
        <p>Over 32k+ Technology businesses growing with KPILY</p>
        <div className={styles.trustedLogos}>
          {TRUSTED_BY.map((brand) =>
            brand.src ? (
              <Image
                key={brand.name}
                src={brand.src}
                alt={brand.name}
                width={128}
                height={40}
                className={styles.trustedLogoImg}
              />
            ) : (
              <span key={brand.name} className={styles.trustedLogoText}>
                {brand.name}
              </span>
            ),
          )}
        </div>
      </section>

      <section className={styles.feature} id="features">
        <WaveLines className={styles.featureWaves} />
        <ConfettiMarks className={styles.featureConfettiRight} />
        <div className={styles.featureVisual}>
          <Image
            src="/assets/landing/real-time-feedback.png"
            alt="Real-time feedback: 35% complete progress gauge, points received from teammates, and skill tags"
            width={1285}
            height={905}
            className={styles.featureScreenshot}
          />
        </div>
        <div className={styles.featureCopy}>
          <span className={styles.eyebrow}>OUR FEATURES</span>
          <h2>Real-Time Feedback</h2>
          <p>
            KPILY&apos;s real-time feedback system uses points, keywords, and
            gamification to provide instant feedback and keep team members
            engaged and motivated. With advanced keyword recognition
            technology, you can easily track trends in your team&apos;s
            performance over time and make data-driven decisions.
          </p>
          <Link href="/register" className={styles.btnPrimary}>
            Get Started
          </Link>
        </div>
      </section>

      <section className={styles.rewardsBand}>
        <RainMarks className={styles.rewardsRain} />
        <div>
          <span className={styles.eyebrow}>OUR FEATURES</span>
          <h2>Innovative Rewards</h2>
          <p>Encourage employees to achieve their goals with gamified rewards.</p>
        </div>
        <form className={styles.miniSignupForm} action="/register">
          <span className={styles.rewardsFormTitle}>Get Started for Free</span>
          <input type="email" name="email" placeholder="Email Address" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit" className={styles.btnPrimary}>
            Get Started
          </button>
        </form>
      </section>

      <section className={styles.feature}>
        <WaveLines className={styles.kpiWaves} />
        <div className={styles.featureCopy}>
          <span className={styles.eyebrow}>OUR FEATURES</span>
          <h2>Customizable KPIs</h2>
          <p>Define your own KPIs that align with your business goals.</p>
          <Link href="/register" className={styles.btnPrimary}>
            Get Started
          </Link>
        </div>
        <div className={styles.kpiVisual}>
          <Image
            src="/assets/landing/customizable-kpis.png"
            alt="Making Progress card with 200 points earned, and a Self-Reflect task assigned to Sarah Fosters"
            width={1149}
            height={1033}
            className={styles.kpiScreenshot}
          />
        </div>
      </section>

      <section className={styles.testimonials}>
        <span className={styles.eyebrow}>TESTIMONIALS</span>
        <h2>Check what our clients are saying</h2>
        <div className={styles.testimonialCard}>
          <div className={styles.testimonialPhoto}>
            <Image
              src="/assets/landing-testimonial.jpg"
              alt="Portrait of a KPILY client"
              width={210}
              height={380}
            />
            <div className={styles.testimonialNameOverlay}>
              <strong>Angela Taylor</strong>
              <span>CEO, Nimbus Corp</span>
            </div>
          </div>
          <div className={styles.testimonialCopy}>
            <h3>Save Time Managing Social Media For Your Business</h3>
            <p>
              &ldquo;KPILY has completely transformed our performance
              tracking process. The real-time feedback has made a huge
              difference in employee engagement and productivity.&rdquo;
            </p>
            <div className={styles.stars} aria-hidden="true">
              ★★★★★
            </div>
            <strong>Angela Taylor</strong>
            <span>CEO, Nimbus Corp</span>
          </div>
        </div>
      </section>

      <section className={styles.ctaStrip}>
        <p>
          Start your company&apos;s journey towards realistic performance
          tracking that puts the power in the hands of the employees for
          your company&apos;s success.
        </p>
        <Link href="/register" className={styles.btnPrimary}>
          Get Started
        </Link>
      </section>

      <section className={styles.feature}>
        <ConfettiMarks className={styles.leaderboardConfetti} flip />
        <div className={styles.featureCopy}>
          <span className={styles.eyebrow}>OUR FEATURES</span>
          <h2>Leaderboard tracking for your team</h2>
          <p>
            Your employees can see their progress in real-time, as well as
            how they stack up against their peers. The leaderboard is
            designed to keep your team engaged and motivated, and it can be
            a powerful tool for driving performance.
          </p>
          <Link href="/register" className={styles.btnPrimary}>
            Get Started
          </Link>
        </div>
        <div className={styles.leaderboardVisual}>
          <Image
            src="/assets/landing/leaderboard-tracking.png"
            alt="Leaderboard showing you in 1st with 4,000 points, Jessica Lee 2nd, and Corey Duggins 3rd"
            width={1068}
            height={921}
            className={styles.leaderboardScreenshot}
          />
        </div>
      </section>

      <section className={styles.whySection}>
        <RainMarks className={styles.whyRainLeft} />
        <ConfettiMarks className={styles.whyConfettiRight} />
        <span className={styles.eyebrow} style={{ textAlign: "center" }}>
          WHY KPILY
        </span>
        <h2 className={styles.whyHeading}>Why Choose Us</h2>
        <div className={styles.whyGrid}>
          {WHY_CARDS.map((card) => (
            <div key={card.title} className={styles.whyCard}>
              <span
                className={styles.whyIcon}
                style={{ background: card.color }}
                aria-hidden="true"
              />
              <div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.pricing} id="pricing">
        <RainMarks className={styles.pricingRain} />
        <span className={styles.eyebrow} style={{ textAlign: "center" }}>
          CHOOSE A PLAN
        </span>
        <div className={styles.billingToggle}>
          <span className={styles.billingActive}>Monthly</span>
          <span>Annually</span>
        </div>
        <div className={styles.pricingGrid}>
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={styles.pricingCard}
              style={{ background: plan.color }}
            >
              <span className={styles.pricingName}>{plan.name}</span>
              <span className={styles.pricingPrice}>{plan.price} per month</span>
              <span className={styles.pricingSeats}>{plan.seats}</span>
              <Link href="/register" className={styles.pricingStart}>
                Start
              </Link>
            </div>
          ))}
        </div>
        <p className={styles.pricingFootnote}>
          15-day free trial · Then recurring bill · Cancel anytime
        </p>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalCtaCopy}>
          <span className={styles.eyebrowLight}>WHY CHOOSE US</span>
          <h2>KPILY drives team engagement and productivity.</h2>
          <p>A comprehensive solution that puts performance in the hands of the employees.</p>
        </div>
        <form className={styles.demoForm} action="/register">
          <input type="text" name="company" placeholder="Company Name" required />
          <input type="email" name="email" placeholder="Work Email Address" required />
          <input type="text" name="name" placeholder="Name" required />
          <button type="submit">Request Demo</button>
        </form>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Logo variant="light" className={styles.footerLogo} />
          <span className={styles.footerLogoTagline}>Performance Management</span>
          <p>© 2025, KPILY. All Rights Reserved.</p>
          <div className={styles.socialRow}>
            {["Twitter", "Facebook", "Instagram", "LinkedIn", "YouTube"].map((s) => (
              <span key={s} className={styles.socialIcon} aria-label={s}>
                {s[0]}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.footerCol}>
          <h4>Company</h4>
          <a href="#about">About Us</a>
          <a href="#press">Press</a>
          <a href="#blog">Blog</a>
        </div>
        <div className={styles.footerCol}>
          <h4>Get Started</h4>
          <Link href="/register">Request a demo</Link>
          <Link href="/register">Sign Up</Link>
          <Link href="/login">Log In</Link>
        </div>
        <div className={styles.footerCol}>
          <h4>Contact</h4>
          <span>Phone</span>
          <a href="tel:+234000000000">+234 XXX XXX XXXX</a>
          <span>Email</span>
          <a href="mailto:support@kpily.com">support@kpily.com</a>
        </div>
      </footer>
    </div>
  );
}