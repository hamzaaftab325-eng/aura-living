export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#FAF8F5' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated gold spinner */}
        <div className="relative w-12 h-12">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid rgba(232,213,163,0.3)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: '2px solid transparent',
              borderTopColor: '#D4AF37',
              borderRightColor: '#D4AF37',
            }}
          />
        </div>
        {/* Brand text */}
        <span
          className="text-xs tracking-[4px] uppercase"
          style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37', opacity: 0.7 }}
        >
          Aura Living
        </span>
      </div>
    </div>
  );
}
