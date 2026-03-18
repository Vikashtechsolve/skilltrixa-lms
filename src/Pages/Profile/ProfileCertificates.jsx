import React, { useEffect, useState } from "react";
import Sidebar from "./ProfileSidebar";
import { FileBadge, Download } from "lucide-react";
import axios from "axios";
import Header from "../Header/Header";

export default function ProfileCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get("/certificates.json")
      .then((res) => {
        if (isMounted) {
          setCertificates(res.data || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Failed to load certificates.");
          console.error(err);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-40">
        <Header />
      </div>

      <div className="flex bg-[#141414] text-white min-h-screen pt-16">
        <div className="mt-0 px-0 md:mt-8 md:px-12">
          <Sidebar />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 px-6 sm:px-12 py-8 sm:py-10">
          <h1 className="text-[30px] font-semibold mb-10 text-left">Profile</h1>

          {/* Sub heading */}
          <div className="flex items-center gap-2 mb-4">
            <FileBadge size={22} />
            <h2 className="text-xl font-medium">My Certificates</h2>
          </div>

          <p className="text-gray-400 text-sm lg:text-lg mb-10 text-left">
            Your earned certificates from completed courses and masterclasses.
          </p>

          {loading ? (
            <div className="text-gray-400">Loading certificates...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : certificates.length === 0 ? (
            <div className="text-gray-400">No certificates found.</div>
          ) : (
            /* GRID */
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-10">
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#151515]  hover:border-[#3A3A3A] transition"
                >
                  {/* TOP CERTIFICATE IMAGE */}
                  {/* smaller image height on mobile (h-[160px]) and original height on sm+ (h-[200px]) */}
                  <img
                    src={c.img}
                    alt={c.title || "certificate"}
                    className=" w-full h-[160px] sm:h-[200px] object-cover border-b border-[#262626]"
                  />

                  {/* BOTTOM BAR — Figma style */}
                  <div className="flex justify-between text-sm px-1 py-3">
                    {/* VIEW CERTIFICATE */}
                    <div
                      onClick={() => {
                        if (c.viewUrl) window.open(c.viewUrl, "_blank");
                      }}
                      className="flex items-center gap-2 text-gray-200 hover:text-white cursor-pointer transition"
                    >
                      <span className="underline cursor-pointer text-[10px] sm:text-sm md:text-base">
                        View Certificate
                      </span>
                    </div>

                    {/* DOWNLOAD PDF */}
                    <div className="flex items-center gap-2 text-gray-200 hover:text-white cursor-pointer transition">
                      <a
                        href={c.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2"
                        download
                      >
                        <Download size={16} />
                        <span className="text-[10px] sm:text-sm md:text-base">
                          Download PDF
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
