// app/page.js
"use client";

import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#111] text-[#f0f0f0] pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-center p-5 bg-[rgba(40,40,40,0.45)] backdrop-blur-[14px] border-b border-[rgba(255,255,255,0.06)]">
        <div className="cursor-pointer hover:scale-110 transition-transform">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a7f7a7" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>

        <div className="text-center flex-grow">
          <div className="text-3xl font-semibold text-[#dfffdf]">GreenGrow</div>
          <div className="text-sm opacity-60">Plant.Pro</div>
          <div className="w-20 h-[2px] bg-gradient-to-r from-[#4BAF63] to-[#A0FF9E] mx-auto mt-2"></div>
        </div>

        <div className="cursor-pointer hover:scale-110 transition-transform">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a7f7a7" strokeWidth="2">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 01-3.46 0"></path>
          </svg>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex justify-center my-6">
        <input 
          type="text"
          placeholder="Search for events..."
          className="w-2/3 p-3 rounded-xl bg-[rgba(255,255,255,0.07)] backdrop-blur-md text-white outline-none"
        />
      </div>

      {/* TAGS */}
      <div className="text-center mb-5 space-x-2">
        {["All", "Workshops", "Community", "Gardening"].map(tag => (
          <span 
            key={tag}
            className="inline-block px-4 py-2 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.07)] text-[#b4ffb4] cursor-pointer hover:bg-[rgba(168,255,168,0.18)] transform hover:-translate-y-0.5 transition"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* EVENTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-5 mb-20">
        {[
          { title: "Urban Gardening Workshop", desc: "Learn the basics of sustainable urban planting." },
          { title: "Green Community Meetup", desc: "Join our eco-community to share ideas and grow together." },
          { title: "Tree Planting Drive", desc: "Participate in planting 300+ trees this weekend." },
        ].map((event, index) => (
          <div key={index} className="bg-[rgba(255,255,255,0.07)] p-5 rounded-2xl border-l-4 border-[#7AFF9C] backdrop-blur-md shadow-lg hover:-translate-y-1 hover:shadow-xl transition">
            <h2 className="text-[#eaffea] text-xl mb-2">{event.title}</h2>
            <p className="text-[#d0f5d0] opacity-75">{event.desc}</p>
          </div>
        ))}
      </div>

{/* BOTTOM NAV */}
<div className="fixed bottom-0 w-full flex justify-around bg-[rgba(20,20,20,0.8)] backdrop-blur-[14px] border-t border-[rgba(255,255,255,0.08)] p-3">
  
  {/* HOME */}
  <div className="cursor-pointer hover:scale-110 transition-transform">
    <svg className="w-7 h-7 text-[#f0f0f0] hover:text-[#67f989]"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7"/>
      <path d="M9 22V12h6v10"/>
    </svg>
  </div>

  {/* CALENDAR */}
  <div className="cursor-pointer hover:scale-110 transition-transform">
    <svg className="w-7 h-7 text-[#f0f0f0] hover:text-[#67f989]"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  </div>

  {/* MAP */}
  <div className="cursor-pointer hover:scale-110 transition-transform">
    <svg className="w-7 h-7 text-[#f0f0f0] hover:text-[#67f989]"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 9 18 15 22 23 18 23 2 15 6 9 2 1 6"/>
    </svg>
  </div>

  {/* TREE */}
  <div className="cursor-pointer hover:scale-110 transition-transform">
    <svg className="w-7 h-7 text-[#f0f0f0] hover:text-[#67f989]"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="4"/>
      <path d="M6 20h12"/>
      <path d="M12 10v10"/>
    </svg>
  </div>

  {/* REPORT ISSUE */}
  <div className="cursor-pointer hover:scale-110 transition-transform">
    <svg className="w-7 h-7 text-[#f0f0f0] hover:text-[#67f989]"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12" y2="17"/>
    </svg>
  </div>

</div>


    </div>
  );
}
