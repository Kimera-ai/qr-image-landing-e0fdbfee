import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  status?: string;
}

const LoadingSpinner = ({ status }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-[#fa2c2e]/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-8 border-[#fa2c2e] border-t-transparent rounded-full animate-spin"></div>
      </div>
      {status && (
        <div className="w-full px-8">
          <div className="w-full h-2 bg-[#fa2c2e]/30 rounded-full mt-8">
            <div
              className={cn(
                "h-full bg-[#fa2c2e] rounded-full transition-all duration-300",
                {
                  "w-1/3": status === "Created",
                  "w-2/3": status === "Processing",
                  "w-full": status === "Completed",
                }
              )}
            ></div>
          </div>
          <p className="text-black mt-2 text-center">{status}</p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;