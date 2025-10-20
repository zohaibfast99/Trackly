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
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>

      <div className="relative flex items-center justify-center w-32 h-16">
        <svg className="w-full h-full" viewBox="0 0 100 50">
          {/* Background Track */}
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            strokeWidth="10"
            className="stroke-muted"
            fill="none"
          />
          {/* Progress Arc */}
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-700 ease-out", variantStyles[variant])}
          />
        </svg>
        <span
          className={cn(
            "absolute bottom-0 text-lg font-semibold transition-all duration-300",
            variantStyles[variant].split(" ")[0]
          )}
        >
          {`${Math.round(value || 0)}%`}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mt-3">{subTitle}</p>
    </div>
  );
};
