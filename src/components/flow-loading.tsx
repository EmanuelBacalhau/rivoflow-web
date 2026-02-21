import Image from "next/image";

export function FlowLoading() {
  return (
    <div className="h-screen bg-background flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="Orion Flow logo"
        width={160}
        height={160}
        className="animate-pulse"
      />
    </div>
  );
}
