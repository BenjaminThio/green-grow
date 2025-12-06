"use client";

import React from 'react';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#111] bg-[length:200%_200%] p-6 text-[#f0f0f0]">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-[rgba(40,40,40,0.45)] backdrop-blur-[14px] p-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="cursor-pointer">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>

        <div className="text-center flex-grow">
          <div className="text-2xl font-semibold">Notifications</div>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-green-300 mx-auto mt-2 rounded"></div>
        </div>

        <div>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7"></path>
            <path d="M9 22V12h6v10"></path>
          </svg>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="card w-11/12 mx-auto my-6 bg-[rgba(255,255,255,0.07)] backdrop-blur-[12px] p-6 rounded-xl border-l-4 border-green-400 shadow-lg">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v5l3 3"></path>
          </svg>
          Notification Preferences
        </h2>
        <p className="text-green-200 mb-4">Choose what grows in your inbox.</p>

        <div className="space-y-4">
          {[
            { title: 'Event Reminders', desc: '1 day before', checked: true },
            { title: 'Announcements', desc: 'From GreenGrow', checked: false },
            { title: 'Community', desc: 'Gardener updates', checked: false },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div>
                <h3 className="text-green-300 flex items-center gap-2 text-base font-medium">
                  {item.title}
                </h3>
                <small className="text-green-200 opacity-70 text-xs block">{item.desc}</small>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked={item.checked} className="opacity-0 w-0 h-0" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#2a4a2a] to-[#3a5a3a] rounded-full transition"></span>
                <span className="absolute left-0 bottom-0 w-5 h-5 bg-green-300 rounded-full transition-transform transform translate-x-0" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Log */}
      <div className="card w-11/12 mx-auto my-6 bg-[rgba(255,255,255,0.07)] backdrop-blur-[12px] p-6 rounded-xl border-l-4 border-green-300 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2"></rect>
              <polyline points="3 7 12 13 21 7"></polyline>
            </svg>
            Recent Notifications
          </h2>
          <button className="px-4 py-1 bg-green-600/20 text-green-200 border border-green-300 rounded-full text-sm hover:bg-green-600/30">Mark All as Seen</button>
        </div>

        {[
          { title: 'Urban Gardening Workshop starts tomorrow!', time: '1 day ago' },
          { title: 'Tree Planting Drive — Registration confirmed', time: '3 days ago' },
          { title: 'New post in GreenGrow Community Forum', time: '1 week ago' },
        ].map((notif, idx) => (
          <div key={idx} className="bg-[rgba(255,255,255,0.06)] p-4 rounded-lg mb-3 text-green-200">
            <p className="font-semibold text-green-100 mb-1 flex items-center gap-2">{notif.title}</p>
            <p className="text-xs opacity-70">{notif.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
