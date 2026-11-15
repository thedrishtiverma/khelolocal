import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Building2, MapPinned, Search, Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KheloLocal" },
      {
        name: "description",
        content:
          "Find local games, meet your sporting community, and build a trusted sports record with KheloLocal.",
      },
      { property: "og:title", content: "KheloLocal — Your city's sports network" },
      {
        property: "og:description",
        content: "Discover athletes. Find tournaments. Build your sporting identity.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  {
    n: "01",
    title: "Show up",
    body: "Find a local tournament, team, or sporting community.",
  },
  {
    n: "02",
    title: "Play",
    body: "Take part and let every game become part of your journey.",
  },
  {
    n: "03",
    title: "Get verified",
    body: "Organizers confirm results and achievements.",
  },
  {
    n: "04",
    title: "Get discovered",
    body: "Build a sporting record people can trust and find.",
  },
] as const;

const PATHS = [
  {
    icon: <Users aria-hidden="true" />,
    number: "01",
    title: "Athletes",
    description: "Find games, track verified results, and build your sporting story.",
    label: "Build your profile",
    to: "/signup",
    accent: "athlete",
  },
  {
    icon: <Trophy aria-hidden="true" />,
    number: "02",
    title: "Organizers",
    description: "Bring tournaments online, manage fixtures, and verify results.",
    label: "Run your tournament",
    to: "/organizers",
    accent: "organizer",
  },
  {
    icon: <Building2 aria-hidden="true" />,
    number: "03",
    title: "Institutions",
    description: "Connect campus sport and give student achievements a lasting record.",
    label: "Grow campus sport",
    to: "/institutions",
    accent: "institution",
  },
  {
    icon: <Search aria-hidden="true" />,
    number: "04",
    title: "Teams & coaches",
    description: "Discover local talent through sports, experience, and verified results.",
    label: "Find local talent",
    to: "/coaches",
    accent: "team",
  },
] as const;

const EXPLORE_LINKS = [
  { label: "Explore the map", to: "/map" },
  { label: "Find your city", to: "/cities" },
  { label: "Choose a sport", to: "/sports" },
  { label: "Read community stories", to: "/stories" },
] as const;

function Landing() {
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-grid" aria-hidden="true" />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-kicker">
              <span className="home-kicker-dot" />
              Starting in Indore. Built for every home ground.
            </p>
            <h1>
              The local game
              <br />
              deserves a
              <br />
              <span>bigger stage.</span>
            </h1>
            <p className="home-hero-description">
              Find your next game, meet your sporting community, and make every verified result
              count.
            </p>
            <div className="home-hero-actions">
              <Link className="home-button home-button-primary" to="/tournaments">
                Find your next game <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="home-button home-button-secondary" to="/map">
                Explore the map
              </Link>
            </div>
            <p className="home-hero-note">
              <BadgeCheck aria-hidden="true" />
              Organizer-confirmed results. A sporting record that grows with you.
            </p>
          </div>

          <div
            className="home-field-card"
            role="img"
            aria-label="India's local sports, united. Explore KheloLocal for fixtures across your city. A playing field connecting players, games, and community."
          >
            <div className="home-field-card-top">
              <span>INDIA&apos;S LOCAL SPORTS, UNITED</span>
              <span className="home-field-card-tagline">Your City&apos;s Sports Network</span>
            </div>
            <div className="home-field" aria-hidden="true">
              <span className="home-field-halfway" />
              <span className="home-field-circle" />
              <span className="home-field-box home-field-box-top" />
              <span className="home-field-box home-field-box-bottom" />
              <span className="home-field-node home-field-node-one" />
              <span className="home-field-node home-field-node-two" />
              <span className="home-field-node home-field-node-three" />
              <span className="home-field-connector home-field-connector-one" />
              <span className="home-field-connector home-field-connector-two" />
              <span className="home-field-connector home-field-connector-three" />
              <span className="home-field-label home-field-label-one">PLAYERS</span>
              <span className="home-field-label home-field-label-two">GAMES</span>
              <span className="home-field-label home-field-label-three">COMMUNITY</span>
              <span className="home-field-center-mark">
                <img src="/android-chrome-192x192.png" alt="" />
              </span>
            </div>
            <div className="home-field-card-bottom">
              <span>ONE CITY AT A TIME</span>
              <span>PLAY / RECORD / REPEAT</span>
            </div>
          </div>
        </div>
        <div className="home-hero-footer" aria-hidden="true">
          <span>01 — FIND YOUR GAME</span>
          <span>02 — MAKE IT COUNT</span>
          <span>03 — GROW THE LOCAL GAME</span>
        </div>
      </section>

      <section className="home-journey" aria-labelledby="home-journey-title">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">Good things grow from one game</p>
            <h2 id="home-journey-title">
              From first whistle
              <br />
              to a record that lasts.
            </h2>
          </div>
          <p>
            Local sport should be easy to find, rewarding to play, and visible long after the final
            whistle.
          </p>
        </div>
        <ol className="home-steps">
          {STEPS.map((step) => (
            <li className="home-step" key={step.n}>
              <span className="home-step-number">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-entry" aria-labelledby="home-entry-title">
        <div className="home-entry-inner">
          <div className="home-entry-heading">
            <div>
              <p className="home-eyebrow">One network. Your place in it.</p>
              <h2 id="home-entry-title">
                What brings
                <br />
                <span>you to the game?</span>
              </h2>
            </div>
            <p>Whether you play, organize, teach, or coach, start with the path that fits you.</p>
          </div>
          <div className="home-paths">
            {PATHS.map((path) => (
              <Link className={`home-path home-path-${path.accent}`} key={path.title} to={path.to}>
                <div className="home-path-top">
                  <span className="home-path-icon">{path.icon}</span>
                  <span className="home-path-number">{path.number}</span>
                </div>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <span className="home-path-link">
                  {path.label} <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          <nav className="home-discover" aria-label="Explore KheloLocal">
            <span className="home-discover-label">
              <MapPinned aria-hidden="true" />
              Just exploring?
            </span>
            <div className="home-discover-links">
              {EXPLORE_LINKS.map((link) => (
                <Link key={link.label} to={link.to}>
                  {link.label} <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      <section className="home-local">
        <div className="home-local-inner">
          <div>
            <p className="home-eyebrow">A stronger local game starts nearby</p>
            <h2>
              Rooted in Indore.
              <br />
              <span>Ready to grow.</span>
            </h2>
          </div>
          <div className="home-local-story">
            <p>
              KheloLocal brings the people, places, and play already happening in a city into one
              connected sporting network.
            </p>
            <div className="home-trust-note">
              <BadgeCheck aria-hidden="true" />
              <p>
                Results confirmed by organizers become verified records. Athlete-submitted claims
                stay unverified until reviewed.
              </p>
            </div>
            <Link to="/how-it-works">
              See how KheloLocal works <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="home-local-stamp" aria-hidden="true">
            <span>MADE FOR</span>
            <strong>
              THE
              <br />
              HOME
              <br />
              GROUND
            </strong>
            <span>INDORE / INDIA</span>
          </div>
        </div>
      </section>
    </main>
  );
}
