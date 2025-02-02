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

  return (
    <GlassContainer 
      className={`mx-auto ${title === "QR Code" ? "w-36 md:w-48" : "w-full max-w-sm"}`}
    >
      <h2 className="text-base md:text-lg font-semibold mb-2 text-black text-center">
        {title === "QR Code" ? "סרקו אותי לקבל את התמונה לטלפון" : "הבחירה שלך"}
      </h2>
      <div className="relative min-h-[200px]">
        {(isLoading || (isError && refetchInterval) || isFetching) && (
          <div className="absolute inset-0 z-10 transition-opacity duration-300 ease-in-out">
            <div className="text-center">
              <LoadingSpinner status={getStatus(data)} />
              <p className="text-black mt-1 text-sm md:text-base">...על האש, כבר מגיע</p>
            </div>
          </div>
        )}
        {!isLoading && !isError && data && (
          <img
            src={data as string}
            alt={title}
            className={`w-full h-auto rounded-lg shadow-md transition-opacity duration-300 ease-in-out ${(isLoading || isFetching) ? 'opacity-0' : 'opacity-100'}`}
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