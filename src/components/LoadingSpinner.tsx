const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin-slow" />
    </div>
  );
};

export default LoadingSpinner;