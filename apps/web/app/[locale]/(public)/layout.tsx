import { Navbar } from "@/components/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh">
      <Navbar />
      {children}
    </div>
  )
}
