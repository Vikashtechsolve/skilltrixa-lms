import React, { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Play,
  // SquarePlus,
  Plus,
  ChevronRight,
  // CircleChevronLeft,
  // CircleChevronRight,
  CircleArrowLeft,
  CircleArrowRight,
} from "lucide-react";
import LandingPageImageg from "../../assets/pic1.jpg";
import Machinelearning from "../../assets/MachineLearning.jpg";
import { useNavigate } from "react-router-dom";
import DSA from "../../assets/DSA.png";
import pic2 from "../../assets/pic2.png";
import pic3 from "../../assets/pic3.png";
import PlaylistCard from "../../components/Cards/PlaylistCard.jsx";
import MasterClassCard from "../../components/Cards/MasterClassCard.jsx";
import BlogsCard from "../../components/Cards/BlogsCard.jsx";
import NewsCard from "../../components/Cards/NewsCard.jsx";
import ContinueWatchingCard from "../../components/Cards/ContinueWatchingCard.jsx";
import { HomePageSkeleton, PlaylistCardSkeleton, MasterClassCardSkeleton, BlogsCardSkeleton, NewsCardSkeleton } from "../../components/skeletons";
import CardSkeleton from "../../components/skeletons/CardSkeleton";

const INTERVAL_MS = 3500; // 3.5 seconds

const slides = [
  {
    id: 1,
    image: LandingPageImageg,
    titleLines: ["MASTER THE ART FROM", " OUR EXPERTS"],
    subtitle:
      "Dive deep into exclusive masterclasses designed by our Industry Leaders and Professionals",
    cta: "Watch Now",
  },
  {
    id: 2,
    image: pic2,
    titleLines: ["LEARN LIVE WITH", "THE BEST MENTORS"],
    subtitle:
      "Join live online session and upgrade your Skills with top Mentors in every field",
    cta: "Watch Now",
  },
  {
    id: 3,
    image: pic3,
    titleLines: ["CRACK THE CODE TO", "YOUR DREAM CAREER"],
    subtitle:
      "Boost your programming skills with interactive coding sessions and Real-Time Projects ",
    cta: "Watch Now",
  },
];

function LandingPage() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [playlistScrolled, setPlaylistScrolled] = useState(false);
  const [masterScrolled, setMasterScrolled] = useState(false);
  const [blogScrolled, setBlogScrolled] = useState(false);
  const [newsScrolled, setNewsScrolled] = useState(false);

  const timerRef = useRef(null);

  // data states
  const [playlists, setPlaylists] = useState([]);
  const [masterClasses, setMasterClasses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingContinueWatching, setLoadingContinueWatching] = useState(true);

  // refs for scrolling
  const playlistRef = useRef(null);
  const masterRef = useRef(null);
  const blogRef = useRef(null);
  const newsRef = useRef(null);

  // hover state for each carousel wrapper (controls overlay arrows)
  const [isPlaylistHover, setIsPlaylistHover] = useState(false);
  const [isMasterHover, setIsMasterHover] = useState(false);
  const [isBlogHover, setIsBlogHover] = useState(false);
  const [isNewsHover, setIsNewsHover] = useState(false);

  const navigate = useNavigate();

  // hero carousel autoplay
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrent((s) => (s + 1) % slides.length);
      }, INTERVAL_MS);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused]);

  // const goPrev = () =>
  //   setCurrent((s) => (s - 1 + slides.length) % slides.length);
  // const goNext = () => setCurrent((s) => (s + 1) % slides.length);

  // fetch data
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { playlistAPI } = await import("../../utils/api");
        const response = await playlistAPI.getPlaylists({ limit: 10 });
        if (response.success && response.data) {
          // Backend returns { success: true, data: { items: [...], page, limit, total } }
          const playlistsArray = Array.isArray(response.data.items)
            ? response.data.items
            : Array.isArray(response.data.playlists)
            ? response.data.playlists
            : Array.isArray(response.data)
            ? response.data
            : [];
          // Ensure each playlist has an id property for consistency
          const mappedPlaylists = playlistsArray.map(playlist => ({
            ...playlist,
            id: playlist._id || playlist.id
          }));
          setPlaylists(mappedPlaylists);
        } else {
          setPlaylists([]);
        }
      } catch (err) {
        console.error("Failed to load playlist data:", err);
        setPlaylists([]);
      } finally {
        setLoadingPlaylists(false);
      }
    };
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const { masterclassAPI } = await import("../../utils/api");
        const response = await masterclassAPI.getMasterclasses({ limit: 10 });
        if (response.success && response.data) {
          // Transform API data to match card component expectations
          const transformed = response.data.items.map((item) => ({
            id: item._id,
            title: item.title,
            thumbnail: item.thumbnailUrl || "/pic1.jpg",
            duration: item.duration || "",
            category: item.category || "",
            description: item.description || "",
            instructor: item.instructor || "",
            status: item.status === "upcoming" ? "Upcoming" : item.status === "live" ? "Live" : "Recorded",
            badge: item.badge || (item.status === "upcoming" ? "Upcoming Master Class" : item.status === "live" ? "Live Now" : "Recorded"),
            startAt: item.startAt,
            joinUrl: item.joinUrl,
            recordingUrl: item.recordingUrl,
            notes: item.notes,
            whatThisSessionCovers: item.whatThisSessionCovers || [],
            keyTakeaways: item.keyTakeaways || [],
            whyMatters: item.whyMatters || "",
            slug: item.slug
          }));
          setMasterClasses(transformed);
        } else {
          setMasterClasses([]);
        }
      } catch (err) {
        console.error("Failed to load master class data:", err);
        setMasterClasses([]);
      } finally {
        setLoadingMaster(false);
      }
    };
    fetchMaster();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { blogsAPI } = await import("../../utils/api");
        const response = await blogsAPI.getBlogs({ page: 1, limit: 6 });
        if (response.success && response.data) {
          // Backend returns { success: true, data: [...], pagination: {...} }
          // response.data is already an array
          const blogsArray = Array.isArray(response.data) 
            ? response.data 
            : Array.isArray(response.data.blogs) 
            ? response.data.blogs 
            : [];
          // Map API data to match card component expectations
          const mappedBlogs = blogsArray.map(blog => ({
            ...blog,
            id: blog._id || blog.id,
            publishedBy: blog.author || "Unknown",
            date: blog.date 
              ? new Date(blog.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : blog.createdAt 
                ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })
                : ""
          }));
          setBlogs(mappedBlogs);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error("Failed to load blogs data:", err);
        setBlogs([]);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchnews = async () => {
      try {
        const { newsAPI } = await import("../../utils/api");
        const response = await newsAPI.getNews({ page: 1, limit: 6 });
        if (response.success && response.data) {
          // Backend returns { success: true, data: [...], pagination: {...} }
          // response.data is already an array
          const newsArray = Array.isArray(response.data) 
            ? response.data 
            : Array.isArray(response.data.news) 
            ? response.data.news 
            : [];
          // Map API data to match card component expectations
          const mappedNews = newsArray.map(newsItem => ({
            ...newsItem,
            id: newsItem._id || newsItem.id,
            publishedBy: newsItem.author || "Unknown",
            date: newsItem.date 
              ? new Date(newsItem.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : newsItem.createdAt 
                ? new Date(newsItem.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })
                : ""
          }));
          setNews(mappedNews);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Failed to load news data:", err);
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchnews();
  }, []);

  useEffect(() => {
    const fetchContinueWatching = async () => {
      try {
        // Check if user is authenticated before fetching
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("[ContinueWatching] User not authenticated, skipping fetch");
          setLoadingContinueWatching(false);
          return;
        }

        const { progressAPI } = await import("../../utils/api");
        const response = await progressAPI.getContinueWatching({ limit: 8 });
        
        console.log("[ContinueWatching] Response:", response);
        
        if (response.success && response.data) {
          console.log(`[ContinueWatching] Found ${response.data.length} items`);
          setContinueWatching(response.data || []);
        } else {
          console.log("[ContinueWatching] No data in response");
          setContinueWatching([]);
        }
      } catch (err) {
        console.error("[ContinueWatching] Failed to load continue watching data:", err);
        setContinueWatching([]);
      } finally {
        setLoadingContinueWatching(false);
      }
    };
    fetchContinueWatching();
  }, []);

  const loading =
    loadingPlaylists || loadingMaster || loadingBlogs || loadingNews;

  const scrollRefByAmt = (ref, direction, amt = 320) => {
    const el = ref && ref.current;
    if (!el) return;
    // use smooth programmatic scrolling; user scroll (wheel/touch) is prevented on the container
    el.scrollBy({
      left: direction === "left" ? -amt : amt,
      behavior: "smooth",
    });
  };

  // Show skeleton loader while initial load
  if (loading && playlists.length === 0 && masterClasses.length === 0 && blogs.length === 0 && news.length === 0) {
    return <HomePageSkeleton />;
  }

  const active = slides[current];

  return (
    <div className="bg-black text-white min-h-screen flex flex-col gap-1 sm:gap-1 md:gap-1  overflow-x-hidden">
      {/* Hero Section */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative flex items-center px-4 md:px-16 py-12 md:py-24 w-full h-[62vh] md:h-[75vh]"
        aria-roledescription="carousel"
        role="region"
        aria-label="Main hero carousel"
      >
        <div className="absolute inset-0">
          {slides.map((slide, idx) => (
            <img
              key={slide.id ?? idx}
              src={slide.image}
              alt={slide.titleLines.join(" ")}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-linear ${
                idx === current
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
              style={{ objectPosition: "center" }}
            />
          ))}

          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content container - centered for mobile like your screenshot */}
        <div
          className="
            relative z-10 w-full max-w-2xl 
            flex flex-col justify-center-end
           md:text-left
            mx-auto md:mx-0
            mt-52 md:mt-0
          "
        >
          {/* Title */}
          <h1 className="text-2xl  sm:text-4xl  md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter text-white drop-shadow-md mb-3">
            {active.titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mb-6 whitespace-pre-line">
            {active.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex items-center md:justify-start gap-3">
            <button className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded font-semibold hover:bg-gray-200 transition text-sm sm:text-base">
              <Play size={16} fill="black" />
              {active.cta}
            </button>

            <button className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded bord border-white/20 text-sm hover:bg-white/5 transition">
              <Plus size={20} />
              <span className="lg:hidden">Watchlist</span>
            </button>
          </div>
        </div>

       
      </section>

      {/* Continue Watching */}
      <section className="px-4 md:px-16 py-10 bg-black">
        <h2 className="text-xl text-left font-semibold mb-6">
          Continue Watching
        </h2>

        {loadingContinueWatching && continueWatching.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton
                key={i}
                showImage={true}
                showTitle={true}
                showDescription={false}
                imageAspectRatio="aspect-video"
              />
            ))}
          </div>
        ) : continueWatching.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {continueWatching.map((item, index) => (
              <ContinueWatchingCard key={item.playlist._id || index} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            <p>No continue watching items. Start watching a playlist to see it here!</p>
          </div>
        )}
      </section>



      {/* Playlists */}
      <div className="bg-black text-white px-8 ">
        <div className="flex justify-between items-center ">
          <h2 className="font-serif text-xl font-light">Playlists</h2>
          <button
            onClick={() => navigate("/app/playlist")}
            className="font-serif flex items-center text-sm text-gray-400 hover:text-white transition cursor-pointer"
          >
            View All <ChevronRight />
          </button>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPlaylistHover(true)}
          onMouseLeave={() => setIsPlaylistHover(false)}
        >
          <div className="relative">
            <div
              ref={playlistRef}
              onScroll={() => {
                const el = playlistRef.current;
                if (!el) return;
                setPlaylistScrolled(el.scrollLeft > 0);
              }}
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
              className="flex space-x-4 h-96 z-50 overflow-x-auto overflow-y-visible no-scrollbar lg:px-6 py-2 lg:py-8"
            >
              {loadingPlaylists && playlists.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <PlaylistCardSkeleton key={i} />
                ))
              ) : (
                playlists.map((item) => (
                  <PlaylistCard key={item.id || item._id} item={item} />
                ))
              )}
            </div>

            {/* Left arrow */}
            {playlistScrolled && (
              <button
                onClick={() => scrollRefByAmt(playlistRef, "left")}
                className={`absolute left-0 top-32 -translate-y-1/2 z-50 transition-opacity pointer-events-auto cursor-pointer bg-black h-4/4 rounded ${
                  isPlaylistHover ? "opacity-40" : "opacity-0"
                }`}
              >
                <div className="bg-black/60 hover:bg-black text-white p-2 rounded-full shadow">
                  <ChevronLeftIcon className="w-10 h-10" />
                </div>
              </button>
            )}

            {/* Right arrow */}
            <button
              onClick={() => scrollRefByAmt(playlistRef, "right")}
              className={`absolute right-0 top-32 -translate-y-1/2 z-50 transition-opacity pointer-events-auto cursor-pointer bg-black h-4/4 rounded ${
                isPlaylistHover ? "opacity-40" : "opacity-0"
              }`}
            >
              <div className="bg-black/60 hover:bg-black text-white p-2 rounded-full shadow">
                <ChevronRightIcon className="w-10 h-10" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Master Classes */}
      <div className="mt-[-90px] sm:mt-0 bg-black text-white px-6 lg:mt-[-70px] ">
        <div className="flex  justify-between items-center mb-1">
          <h2 className="text-xl z-100 relative font-serif font-light">
            Master Classes
          </h2>
          <button
            onClick={() => navigate("/app/MasterClass")}
            className="font-serif flex items-center text-sm z-100 relative text-gray-400 hover:text-white transition cursor-pointer"
          >
            View All
            <ChevronRight />
          </button>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsMasterHover(true)}
          onMouseLeave={() => setIsMasterHover(false)}
        >
          <div>
            <div
              ref={masterRef}
              onScroll={() => {
                const el = masterRef.current;
                if (!el) return;
                setMasterScrolled(el.scrollLeft > 0);
              }}
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
              className="flex space-x-4 h-96 z-50 overflow-x-auto overflow-y-visible no-scrollbar lg:px-6 py-2 lg:py-8"
            >
              {loadingMaster && masterClasses.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <MasterClassCardSkeleton key={i} />
                ))
              ) : (
                masterClasses.map((item) => (
                  <MasterClassCard key={item.id || item._id || Math.random()} item={item} />
                ))
              )}
            </div>

            {masterScrolled && (
              <button
                onClick={() => scrollRefByAmt(masterRef, "left")}
                className={`absolute left-0 top-32 -translate-y-1/2 z-50 transition-opacity pointer-events-auto cursor-pointer bg-black h-4/4 rounded ${
                  isMasterHover ? "opacity-40" : "opacity-0"
                }`}
              >
                <div className="bg-black/60 hover:bg-black text-white p-2 rounded-full shadow">
                  <ChevronLeftIcon className="w-10 h-10" />
                </div>
              </button>
            )}

            <button
              onClick={() => scrollRefByAmt(masterRef, "right")}
              className={`absolute -right-1 top-32 -translate-y-1/2 z-50 transition-opacity pointer-events-auto cursor-pointer bg-black h-full rounded ${
                isMasterHover ? "opacity-40" : "opacity-0"
              }`}
            >
              <div className="bg-black/60 hover:bg-black text-white p-2 rounded-full shadow">
                <ChevronRightIcon className="w-10 h-10" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Blogs */}
      <div className="mt-[-80px] sm:mt-0 bg-black text-white px-4 lg:mt-[-80px]">
        <div className="flex justify-between items-center bg-black">
          <h2 className="text-xl z-100 font-serif relative  font-light">
            Blogs
          </h2>
          <button
            onClick={() => navigate("/app/Blogs")}
            className=" font-serif flex items-centertext-sm z-100 relative text-gray-400 hover:text-white transition cursor-pointer"
          >
            View All <ChevronRight />
          </button>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsBlogHover(true)}
          onMouseLeave={() => setIsBlogHover(false)}
        >
          <div className="relative">
            <div
              ref={blogRef}
              onScroll={() => {
                const el = blogRef.current;
                if (!el) return;
                setBlogScrolled(el.scrollLeft > 0);
              }}
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
              className="flex space-x-4 h-96 z-50 overflow-x-auto overflow-y-visible no-scrollbar lg:px-6 py-2 lg:py-8"
            >
              {loadingBlogs && blogs.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <BlogsCardSkeleton key={i} />
                ))
              ) : (
                blogs.map((item) => (
                  <BlogsCard key={item.id || item._id} item={item} />
                ))
              )}
            </div>

            {/* overlay arrows: show when playlist wrapper hovered (state-based) */}
            {blogScrolled && (
              <button
                onClick={() => scrollRefByAmt(blogRef, "left")}
                className={`absolute left-0 top-32 -translate-y-1/2 z-50 transition-opacity pointer-events-auto cursor-pointer bg-black h-4/4 rounded  ${
                  isBlogHover ? "opacity-40" : "opacity-0"
                }`}
              >
                <div className="bg-black/60 hover:bg-black text-white p-2 rounded-full shadow">
                  <ChevronLeftIcon className="w-10 h-10" />
                </div>
              </button>
            )}

            <button
              onClick={() => scrollRefByAmt(blogRef, "right")}
              aria-label="scroll playlists right"
              className={`absolute -right-1 top-32 -translate-y-1/2 z-50 transition-opacity pointer-events-auto cursor-pointer bg-black h-4/4 rounded ${
                isBlogHover ? "opacity-40" : "opacity-0"
              }`}
            >
              <div className="bg-black/60 hover:bg-black text-white p-2 rounded-full shadow">
                <ChevronRightIcon className="w-10 h-10" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* News Section - Placeholder for future implementation */}
      <div className="mt-[-100px] sm:mt-0 bg-black text-white px-4 lg:mt-[-70px]">
        <div className="flex justify-between items-center bg-black">
          <h2 className="text-xl z-100 font-serif relative font-light">
            News
          </h2>
          <button
            onClick={() => navigate("/app/News")}
            className=" font-serif flex items-centertext-sm z-100 relative text-gray-400 hover:text-white transition cursor-pointer"
          >
            View All <ChevronRight />
          </button>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsNewsHover(true)}
          onMouseLeave={() => setIsNewsHover(false)}
        >
          <div className="relative">
            <div
              ref={newsRef}
              onScroll={() => {
                const el = newsRef.current;
                if (!el) return;
                setNewsScrolled(el.scrollLeft > 0);
              }}
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
              className="flex space-x-4 h-96 z-50 overflow-x-auto overflow-y-visible no-scrollbar lg:px-6 py-2 lg:py-8"
            >
              {loadingNews && news.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))
              ) : (
                news.map((item) => (
                  <NewsCard key={item.id || item._id} item={item} />
                ))
              )}
            </div>

            {/* overlay arrows: show when playlist wrapper hovered (state-based) */}
            {newsScrolled && (
              <button
                onClick={() => scrollRefByAmt(newsRef, "left")}
                className={`absolute left-0 top-32 -translate-y-1/2 z-999 transition-opacity pointer-events-auto cursor-pointer bg-black h-4/4 rounded ${
                  isNewsHover ? "opacity-40" : "opacity-0"
                }`}
              >
                <div className="bg-black/60 hover:bg-black text-white p-2 rounded-full shadow">
                  <ChevronLeftIcon className="w-10 h-10" />
                </div>
              </button>
            )}

            <button
              onClick={() => scrollRefByAmt(newsRef, "right")}
              aria-label="scroll news right"
              className={`absolute -right-1 top-32 -translate-y-1/2 z-50 transition-opacity pointer-events-auto cursor-pointer bg-black h-4/4 rounded ${
                isNewsHover ? "opacity-40" : "opacity-0"
              }`}
            >
              <div className="bg-black/60 hover:bg-black text-white p-2 rounded-full shadow">
                <ChevronRightIcon className="w-10 h-10" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
