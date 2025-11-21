import { cn } from "@/lib/utils";

type VariantType = "default" | "success" | "warning" | "inProgress";

interface GaugeProgressProps {
  title: string;
  value: number;
  subTitle: string;
  variant: VariantType;
}

const variantStyles = {
  default: "text-blue-500 stroke-blue-500",
  success: "text-green-600 stroke-green-600",
  warning: "text-red-600 stroke-red-600",
  inProgress: "text-yellow-600 stroke-yellow-600",
};

export const CircleProgress = ({ title, value, subTitle, variant }: GaugeProgressProps) => {
  const radius = 40;
const circumference = Math.PI * radius;

const safeValue = Number.isFinite(value) ? value : 0;
const offset = circumference - (safeValue / 100) * circumference;


  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-lg sm:rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3 text-center truncate max-w-full">{title}</h3>

      <div className="relative flex items-center justify-center w-24 h-12 sm:w-32 sm:h-16">
        <svg className="w-full h-full" viewBox="0 0 100 50">
          {/* Background Track */}
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            strokeWidth="8"
            className="stroke-muted"
            fill="none"
          />
          {/* Progress Arc */}
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-700 ease-out", variantStyles[variant])}
          />
        </svg>
        <span
          className={cn(
            "absolute bottom-0 text-sm sm:text-lg font-semibold transition-all duration-300",
            variantStyles[variant].split(" ")[0]
          )}
        >
          {`${Math.round(value || 0)}%`}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 text-center truncate max-w-full">{subTitle}</p>
    </div>
  );
};
