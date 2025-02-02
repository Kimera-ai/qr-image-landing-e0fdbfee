import { useQuery } from "@tanstack/react-query";
import GlassContainer from "./GlassContainer";
import LoadingSpinner from "./LoadingSpinner";

interface DisplaySectionProps {
  title: string;
  queryKey: string;
  fetchFn: () => Promise<string>;
  refetchInterval?: number;
}

const DisplaySection = ({ title, queryKey, fetchFn, refetchInterval }: DisplaySectionProps) => {
  const { data, isLoading, error, isError, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      try {
        const result = await fetchFn();
        return result;
      } catch (error: any) {
        // If the error contains status information, return it
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

  return (
    <GlassContainer className={`mx-auto mb-6 ${title === "QR Code" ? "w-64" : "w-full max-w-2xl"}`}>
      <h2 className="text-xl font-semibold mb-4 text-black text-center">
        {title === "QR Code" ? "סרקו אותי לקבל את התמונה לטלפון" : "הבחירה שלך"}
      </h2>
      {(isLoading || (isError && refetchInterval) || isFetching) ? (
        <div className="text-center">
          <LoadingSpinner status={data?.status || "Created"} />
          <p className="text-black mt-2 text-lg">...על האש, כבר מגיע</p>
        </div>
      ) : isError ? (
        <div className="text-black">Failed to load {title.toLowerCase()}</div>
      ) : (
        <img
          src={data}
          alt={title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      )}
    </GlassContainer>
  );
};

export default DisplaySection;