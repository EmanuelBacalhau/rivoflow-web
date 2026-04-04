export function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Glow orbs */}
      <div className="glow-orb w-96 h-96 bg-purple-600/12 top-[10%] left-[15%] animate-glow-pulse" />
      <div
        className="glow-orb w-72 h-72 bg-violet-500/10 bottom-[15%] right-[10%] animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="glow-orb w-64 h-64 bg-purple-500/8 top-[60%] left-[60%] animate-glow-pulse"
        style={{ animationDelay: "3.5s" }}
      />

      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-15" />

      {/* Orbital rings */}
      <div className="absolute top-[8%] left-[8%] w-72 h-72 rounded-full border border-white/3 hidden md:block" />
      <div className="absolute bottom-[5%] right-[5%] w-96 h-96 rounded-full border border-purple-500/6 hidden md:block" />
      <div className="absolute top-[40%] right-[20%] w-48 h-48 rounded-full border border-white/4 hidden lg:block" />
      <div className="absolute bottom-[30%] left-[25%] w-56 h-56 rounded-full border border-purple-500/4 hidden lg:block" />

      {/* Floating geometric shapes */}
      <div className="absolute top-[12%] left-[20%] w-14 h-14 rotate-45 rounded-lg bg-linear-to-br from-purple-500/15 to-transparent border border-purple-500/15 animate-float hidden md:block" />
      <div
        className="absolute top-[18%] right-[15%] w-10 h-10 rounded-full bg-linear-to-br from-violet-400/12 to-transparent border border-white/8 animate-float hidden md:block"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-[20%] left-[12%] w-16 h-16 rounded-full bg-linear-to-t from-purple-600/8 to-transparent border border-purple-500/10 animate-float hidden md:block"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute bottom-[15%] right-[22%] w-8 h-8 rounded-md bg-violet-500/10 border border-violet-500/12 rotate-12 animate-float hidden md:block"
        style={{ animationDelay: "2.5s" }}
      />
      <div
        className="absolute top-[55%] left-[8%] w-6 h-6 rotate-45 rounded-sm bg-purple-400/10 border border-purple-400/10 animate-float hidden lg:block"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute top-[35%] right-[8%] w-12 h-12 rounded-lg bg-linear-to-br from-purple-500/10 to-violet-500/5 border border-white/6 -rotate-12 animate-float hidden lg:block"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-[6%] left-[48%] w-5 h-5 rounded-full bg-purple-400/8 border border-purple-400/8 animate-float hidden md:block"
        style={{ animationDelay: "3.5s" }}
      />
      <div
        className="absolute bottom-[8%] left-[45%] w-10 h-10 rotate-45 rounded-md bg-linear-to-br from-violet-500/8 to-transparent border border-violet-500/8 animate-float hidden md:block"
        style={{ animationDelay: "2s" }}
      />

      {/* Connecting lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full hidden md:block"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="200"
          y1="150"
          x2="350"
          y2="400"
          stroke="url(#bg-lg)"
          strokeWidth="0.5"
          opacity="0.2"
        />
        <line
          x1="800"
          y1="200"
          x2="650"
          y2="450"
          stroke="url(#bg-lg)"
          strokeWidth="0.5"
          opacity="0.15"
        />
        <line
          x1="150"
          y1="750"
          x2="400"
          y2="550"
          stroke="url(#bg-lg)"
          strokeWidth="0.5"
          opacity="0.15"
        />
        <line
          x1="850"
          y1="800"
          x2="600"
          y2="550"
          stroke="url(#bg-lg)"
          strokeWidth="0.5"
          opacity="0.2"
        />
        <path
          d="M 100 400 Q 300 200 500 350"
          stroke="url(#bg-lg)"
          strokeWidth="0.5"
          opacity="0.1"
          fill="none"
        />
        <path
          d="M 500 650 Q 700 800 900 600"
          stroke="url(#bg-lg)"
          strokeWidth="0.5"
          opacity="0.1"
          fill="none"
        />
        <defs>
          <linearGradient id="bg-lg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(168, 85, 247)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glowing dots */}
      <div className="absolute top-[22%] left-[32%] w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50 hidden md:block" />
      <div className="absolute bottom-[28%] right-[30%] w-1.5 h-1.5 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50 hidden md:block" />
      <div className="absolute top-[50%] left-[15%] w-1.5 h-1.5 rounded-full bg-purple-300/50 shadow-lg shadow-purple-300/30 hidden lg:block" />
      <div className="absolute top-[30%] right-[25%] w-1 h-1 rounded-full bg-white/25 hidden md:block" />
      <div className="absolute bottom-[35%] left-[35%] w-1 h-1 rounded-full bg-purple-400/40 hidden lg:block" />
      <div className="absolute top-[70%] right-[15%] w-1.5 h-1.5 rounded-full bg-purple-400/30 hidden md:block" />
    </div>
  );
}
