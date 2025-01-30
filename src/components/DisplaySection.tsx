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
  const { data, isLoading, error, isError } = useQuery({
    queryKey: [queryKey],
    queryFn: fetchFn,
    refetchInterval: refetchInterval,
    retry: true,
    retryDelay: 2000,
  });

  return (
    <GlassContainer className="w-full max-w-sm mx-auto mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white/90">{title}</h2>
      {(isLoading || (isError && refetchInterval)) ? (
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white/70 mt-2">Processing your request...</p>
        </div>
      ) : isError ? (
        <div className="text-red-400">Failed to load {title.toLowerCase()}</div>
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