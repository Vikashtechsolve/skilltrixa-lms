import React from "react";
import { useState, useEffect } from "react";
import LandingPageNavbar from "../../components/Navbar/NoNavbarLayout";
import TrendingCarousel from "./TrendingCarousel";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";

const reasonData = [
  {
    id: 1,
    title: "Structured Paths to Master Skills",
    desc: "Stay organized with structured playlists designed for every skill level. Learn through videos, notes, PPTs, and tests — all in one place.",
    icon: <path d="M4 6h14v2H4zM4 11h10v2H4zM4 16h8v2H4z" />,
  },
  {
    id: 2,
    title: "Live & Upcoming Masterclasses",
    desc: "Attend expert-led masterclasses in real time. Get insights, strategies, and industry-ready knowledge directly from professionals.",
    icon: (
      <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 11.414V7h-2v6.586L16.293 17 17 16.293 13 12.414z" />
    ),
  },
  {
    id: 3,
    title: "Blogs & Latest Learning Updates",
    desc: "Explore fresh blogs, study tips, and career advice updated regularly. Stay informed with trending news and educational insights.",
    icon: <path d="M4 5h16v2H4zM4 10h10v2H4zM4 15h16v2H4z" />,
  },
  {
    id: 4,
    title: "Instant Doubt Support",
    desc: "Never get stuck while learning. Ask questions anytime and get quick, accurate solutions through our doubt-solving sessions.",
    icon: (
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
    ),
  },
];

const faqData = [
  {
    id: 1,
    q: "How do I access the courses on the LMS Portal?",
    a: "To access courses, sign in to your account, go to 'My Courses' and open the course you’ve enrolled in. Each course contains modules, videos, notes and tests.",
  },
  {
    id: 2,
    q: "Can I resume my classes from where I left off?",
    a: "Yes — the LMS automatically tracks your progress. You can resume from the last watched video or last completed module.",
  },
  {
    id: 3,
    q: "Are the live classes recorded?",
    a: "Yes. Most live classes are recorded and available for later viewing in the course's video library.",
  },
  {
    id: 4,
    q: "How can I track my learning progress?",
    a: "Use the course progress bar and your dashboard which shows completed modules, scores and upcoming sessions.",
  },
  {
    id: 5,
    q: "What should I do if a video or module is not loading?",
    a: "Try clearing your browser cache, check your internet connection, or contact support with the module name and a screenshot of the issue.",
  },
];

export default function LandingPage(){
  const [openId, setOpenId] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  // Redirect to LMS if user is already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Redirect to original location if available, otherwise go to /app
      const from = location.state?.from || "/app";
      navigate(from);
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const handleGetStarted = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // For new users, we'll register with a temporary name and password
      // The name will be updated in Step 1, password will be set in Step 1
      const tempName = email.split("@")[0]; // Use email prefix as temp name
      const tempPassword = import.meta.env.VITE_TEMP_PASSWORD_PREFIX || "Temp123!@#"; // Temporary password, will be changed in Step 1
      
      const response = await register(tempName, email, tempPassword);
      
      if (response.success) {
        // Navigate to Auth page (Step 1) with email and userId
        navigate("/auth", { 
          state: { 
            email, 
            userId: response.userId,
            isNewUser: true 
          } 
        });
      } else {
        setError(response.error || response.message || "Failed to register. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Provide more helpful error messages
      if (err.message.includes("Cannot connect to server") || err.message.includes("Failed to fetch")) {
        // Use the error message from the API call which already includes the URL
        setError(err.message || "Cannot connect to backend server. Please check your network connection.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900">
      {/* NAVBAR — glass bar so hero shows through; logo in a crisp white lockup (SVG has full white plate) */}
      <nav className="absolute left-0 right-0 top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-4 md:px-8 md:pt-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-white/20 bg-black/45 px-3 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:gap-4 sm:px-4 sm:py-3 md:px-6">
          <div className="flex min-w-0 flex-1 items-center">
            <div
              className="rounded-xl border border-black/6 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] ring-1 ring-black/5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5"
              style={{ maxWidth: "min(72vw, 280px)" }}
            >
              <img
                src="/logo.svg"
                alt="Skilltrixa"
                className="block h-7 w-auto max-h-8 object-contain object-left sm:h-8 sm:max-h-9 md:h-9 md:max-h-10"
                width={220}
                height={40}
                decoding="async"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <select
                aria-label="Language"
                className="cursor-pointer rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm transition hover:bg-white/15 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option className="bg-gray-900 text-white">English</option>
                <option className="bg-gray-900 text-white">हिन्दी</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/app");
                } else {
                  navigate("/app/signin");
                }
              }}
              className="cursor-pointer rounded-lg bg-[#c72b2b] px-3.5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#b32626] sm:px-5 sm:py-2.5 sm:text-base"
            >
              {isAuthenticated ? "Go to LMS" : "Sign in"}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO / BACKGROUND */}
      <div
        className="min-h-screen bg-cover bg-center bg-gray-900 relative flex items-center justify-center"
        style={{ backgroundImage: `url('/LandingPic.png')` }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* MAIN CONTENT - centered */}
        <main className="relative z-20 max-w-6xl w-full px-6 sm:px-8 text-center text-white">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight drop-shadow-lg">
            Your Learning Starts Here
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-gray-200 font-medium">
            Create your account and unlock masterclasses, notes, tests, and
            more.
          </p>

          <p className="mt-4 text-sm sm:text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
            Ready to Upgrade Yourself? Sign up and dive into structured courses,
            live classes, and expert-led guidance.
          </p>

          {/* Email input + button */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="email"
              placeholder="rohan singh2209@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => e.key === "Enter" && handleGetStarted()}
              className="w-full max-w-md px-4 sm:px-6 py-3 rounded-md bg-black/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />

            <button
              onClick={handleGetStarted}
              disabled={loading}
              className={`flex items-center gap-2 bg-[#c72b2b] hover:bg-[#b32626] text-white font-semibold px-5 cursor-pointer py-3 rounded-md ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className="">{loading ? "Processing..." : "Get Started"}</span>
              {!loading && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
          )}
        </main>

        {/* subtle bottom gradient like screenshot */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-10" />
      </div>

      <div className="relative z-20">
        <TrendingCarousel total={10} />
      </div>

      <div className=" bg-[#0f0f10] py-16 px-8">
        <div className="max-w-[1800px] mx-auto">
          <h2 className="text-2xl text-left font-semibold text-white mb-8">
            More Reasons to Join Us
          </h2>

          {/* Single card template mapped 4 times */}
          <div className="grid grid-cols-1 px-8 text-left sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasonData.map((item) => (
              <div
                key={item.id}
                className="relative rounded-xl h-65 overflow-hidden p-6 bg-gradient-to-b from-[#2a2340] to-[#3a2136] shadow-lg"
              >
                <h3 className="text-white text-lg font-semibold mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-300 text-sm leading-6">{item.desc}</p>

                {/* floating icon */}
                <div className="absolute right-6 bottom-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-b from-[#2b2034] to-[#2f1b34] shadow-[0_8px_24px_rgba(0,0,0,0.6)] ring-2 ring-black/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white/90"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      {item.icon}
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-[#0f0f10] text-white py-8 p-4 md:px-12">
        <div className="max-w-[1800px] mx-auto">
          <h2 className="text-2xl text-left font-semibold mb-8">
            Frequently Asked Questions
          </h2>

          {/* Accordion list */}
          <div className="space-y-4 ">
            {faqData.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="bg-transparent">
                  <button
                    onClick={() => toggle(item.id)}
                    className={`w-full flex cursor-pointer items-center justify-between p-6 bg-[#222] rounded-sm shadow-inner border border-[#181818] hover:bg-[#2a2a2a] transition`}
                    aria-expanded={isOpen}
                  >
                    <span className="text-left text-white text-lg font-medium">
                      {item.q}
                    </span>

                    {/* plus icon - rotates when open */}
                    <span
                      className={`flex items-center justify-center h-10 w-10 rounded-full bg-transparent border border-transparent`}
                      aria-hidden="true"
                    >
                      <svg
                        className={`w-6 h-6 transform transition-transform duration-200 ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>

                  {/* Collapsible panel */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? "max-h-96 mt-3" : "max-h-0"
                    }`}
                    aria-hidden={!isOpen}
                  >
                    <div className="p-6 bg-[#161616] rounded-sm border border-[#151515] text-gray-300">
                      <p className="leading-7 text-left">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA (email + button) like image */}
          <div className="mt-12  text-center">
            <p className="text-gray-300 mb-6">
              Ready to Upgrade Yourself? Sign up and dive into structured
              courses, live classes, and expert-led guidance.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && handleGetStarted()}
                className="w-full md:flex-1 px-5 py-4 rounded-md bg-transparent border border-[#3a3a3a] placeholder:text-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button 
                onClick={handleGetStarted}
                disabled={loading}
                className={`px-8 py-4 bg-[#c72b2b] hover:bg-[#b32626] rounded-md text-white font-semibold flex items-center gap-3 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : "Get Started"}
                {!loading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
