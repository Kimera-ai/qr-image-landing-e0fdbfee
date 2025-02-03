import { cn } from "@/lib/utils";

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
}

const GlassContainer = ({ children, className }: GlassContainerProps) => {
  return (
    <div
      className={cn(
        "backdrop-blur-md bg-glass border border-glass-border rounded-xl p-6 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassContainer;