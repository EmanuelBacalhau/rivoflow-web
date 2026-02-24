import Image from "next/image";
import { Background } from "./background";

export function FlowLoading() {
  return (
    <div
      className="h-screen bg-background flex items-center justify-center"
      aria-busy="true"
    >
      <Background />
      <Image
        src="/logo.png"
        alt="RivoFlow logo"
        width={160}
        height={160}
        className="animate-pulse"
      />
    </div>
  );
}
