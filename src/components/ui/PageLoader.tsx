type PageLoaderProps = {
  fullScreen?: boolean;
  className?: string;
};

const PageLoader = ({ fullScreen = true, className = "" }: PageLoaderProps) => {
  return (
    <div
      className={`${fullScreen ? "min-h-screen" : "min-h-[280px]"} w-full flex items-center justify-center ${className}`}
    >
      <div className="w-24 h-24">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <linearGradient id="farmfresh-loader-gradient">
            <stop offset="0" stopColor="#22C55E" stopOpacity="0"></stop>
            <stop offset="1" stopColor="#22C55E"></stop>
          </linearGradient>
          <circle
            fill="none"
            stroke="url(#farmfresh-loader-gradient)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray="0 44 0 44 0 44 0 44 0 360"
            cx="100"
            cy="100"
            r="70"
            transformOrigin="center"
          >
            <animateTransform
              type="rotate"
              attributeName="transform"
              calcMode="discrete"
              dur="2"
              values="360;324;288;252;216;180;144;108;72;36"
              repeatCount="indefinite"
            ></animateTransform>
          </circle>
        </svg>
      </div>
    </div>
  );
};

export default PageLoader;
