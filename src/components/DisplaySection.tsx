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
      className={`mx-auto ${title === "QR Code" ? "w-48 md:w-64" : "w-full max-w-md"}`}
    >
      <h2 className="text-lg md:text-xl font-semibold mb-3 text-black text-center">
        {title === "QR Code" ? "סרקו אותי לקבל את התמונה לטלפון" : "הבחירה שלך"}
      </h2>
      {(isLoading || (isError && refetchInterval) || isFetching) ? (
        <div className="text-center">
          <LoadingSpinner status={getStatus(data)} />
          <p className="text-black mt-2 text-base md:text-lg">...על האש, כבר מגיע</p>
        </div>
      ) : isError ? (
        <div className="text-black">Failed to load {title.toLowerCase()}</div>
      ) : (
        <img
          src={data as string}
          alt={title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      )}
    </GlassContainer>
  );
};

export default DisplaySection;