import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  status: string;
}

const LoadingSpinner = ({ status }: LoadingSpinnerProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 py-4">
      <Loader2 className="h-8 w-8 animate-spin text-black" />
      <p className="text-black mt-1 text-sm md:text-base">...על האש, כבר מגיע</p>
    </div>
  );
};

export default LoadingSpinner;