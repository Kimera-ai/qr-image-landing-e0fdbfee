import { useQuery } from "@tanstack/react-query";
import GlassContainer from "./GlassContainer";
import LoadingSpinner from "./LoadingSpinner";

interface DisplaySectionProps {
  title: string;
  queryKey: string;
  fetchFn: () => Promise<string>;
  refetchInterval?: number;
}

type ResponseData = string | { status: string };

const DisplaySection = ({ title, queryKey, fetchFn, refetchInterval }: DisplaySectionProps) => {
  const { data, isLoading, error, isError, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      try {
        const result = await fetchFn();
        return result;
      } catch (error: any) {
        if (error.status) {
          return { status: error.status };
        }
        throw error;
      }
    },
    refetchInterval: refetchInterval,
    retry: true,
    retryDelay: 2000,
  });

  const getStatus = (data: ResponseData | undefined): string => {
    if (!data) return "Created";
    if (typeof data === "object" && "status" in data) {
      return data.status;
    }
    return "Created";
  };

  // Only show loading state if we don't have data yet
  const showLoading = (isLoading || (isError && refetchInterval)) && !data;

  return (
    <GlassContainer 
      className={`mx-auto ${title === "QR Code" ? "w-36 md:w-48" : "w-full max-w-3xl"}`}
    >
      <h2 className={`${title === "QR Code" ? "text-base md:text-lg" : "text-2xl md:text-4xl"} font-semibold mb-4 text-black text-center`}>
        {title === "QR Code" ? "סרקו אותי\nלקבל את התמונה לטלפון" : "הבחירה שלך"}
      </h2>
      <div className="relative min-h-[300px] md:min-h-[400px]">
        {showLoading && (
          <div className="absolute inset-0 z-10">
            <div className="text-center">
              <LoadingSpinner status={getStatus(data)} />
              <p className="text-black mt-1 text-sm md:text-base">...על האש, כבר מגיע</p>
            </div>
          </div>
        )}
        {data && !isError && (
          <img
            src={data as string}
            alt={title}
            className="w-full h-auto rounded-lg shadow-md object-contain max-h-[60vh]"
          />
        )}
        {isError && !refetchInterval && (
          <div className="text-black">Failed to load {title.toLowerCase()}</div>
        )}
      </div>
    </GlassContainer>
  );
};

export default DisplaySection;