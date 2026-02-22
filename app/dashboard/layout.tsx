import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <div className="flex-1 lg:ml-60">
        <TopBar />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
