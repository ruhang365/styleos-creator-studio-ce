import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

interface AppShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-column">
        <TopNav title={title} description={description} />
        <div className="workspace">{children}</div>
      </main>
    </div>
  );
}
