"use client";

export default function uiuxPage() {
  return (
    <main>
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h2 className="text-3xl font-extrabold text-green-700 tracking-tight">
          Green Canopy Builder
        </h2>
        <div className="menu">
          <ul className="flex gap-4 items-center">
            <li><a href="#">MAP VIEW</a></li>
            <li><a href="#">LEADERBOARD</a></li>
            <li><a href="#">PROPOSAL</a></li>
            <li><a href="#">MY PROFILE</a></li>
            <li><button className="px-4 py-1 border rounded">LOGIN</button></li>
          </ul>
        </div>
      </header>
    </main>
  );
}
