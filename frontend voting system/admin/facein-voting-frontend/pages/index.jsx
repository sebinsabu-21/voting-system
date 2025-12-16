import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const goTo = (role) => {
    router.push(`/${role}`);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        color: '#e5e7eb',
        background: `
          radial-gradient(1000px 600px at 10% 10%, #0b1220 20%, transparent 60%),
          radial-gradient(800px 500px at 90% 20%, #0b1020 10%, transparent 60%),
          #0f172a
        `
      }}
    >
      <main 
        className="w-full max-w-[420px] rounded-2xl p-7"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
          backdropFilter: 'blur(8px)'
        }}
        role="main"
      >
        <h1 
          className="text-center mb-4 text-[28px]"
          style={{
            letterSpacing: '0.4px'
          }}
        >
          FaceIn Voting System
        </h1>
        <p 
          className="text-center mb-6 text-sm"
          style={{ color: '#9ca3af' }}
        >
          Select your role to proceed
        </p>

        <div className="space-y-3">
          <button
            onClick={() => goTo("admin")}
            className="w-full py-3 px-4 font-semibold text-white rounded-[10px] border-none cursor-pointer transition-all"
            style={{
              background: 'linear-gradient(180deg, #fbbf24, #f59e0b)',
              boxShadow: '0 8px 20px rgba(251, 191, 36, 0.35)',
            }}
            onMouseEnter={(e) => e.target.style.filter = 'brightness(1.05)'}
            onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
            onMouseDown={(e) => e.target.style.transform = 'translateY(1px)'}
            onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Admin
          </button>

          <button
            onClick={() => goTo("voter")}
            className="w-full py-3 px-4 font-semibold text-white rounded-[10px] border-none cursor-pointer transition-all"
            style={{
              background: 'linear-gradient(180deg, #2563eb, #1d4ed8)',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
            }}
            onMouseEnter={(e) => e.target.style.filter = 'brightness(1.05)'}
            onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
            onMouseDown={(e) => e.target.style.transform = 'translateY(1px)'}
            onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Voter
          </button>
        </div>

        <div 
          className="mt-4 text-center text-xs"
          style={{ color: '#9ca3af' }}
        >
          © {new Date().getFullYear()} FaceIn Voting System
        </div>
      </main>
    </div>
  );
}

