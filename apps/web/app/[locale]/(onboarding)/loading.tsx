import { LogoLoader } from "@workspace/ui/components/logo-loader";

export default function Loading() {
  return (
    <main className="flex min-h-svh items-center justify-center">
      <LogoLoader size="lg" />
    </main>
  );
}
