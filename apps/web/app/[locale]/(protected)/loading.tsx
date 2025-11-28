import { LogoLoader } from "@workspace/ui/components/logo-loader";

export default function Loading() {
  return (
    <main
      className="flex items-center justify-center"
      style={{ minHeight: "calc(100svh - 3.5rem)" }}
    >
      <LogoLoader size="lg" />
    </main>
  );
}
