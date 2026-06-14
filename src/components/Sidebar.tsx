"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/services", label: "Services" },
  { href: "/cases", label: "Cases" },
  { href: "/knowledge/candidates", label: "Candidate Queue" },
  { href: "/login", label: "Creator Profile" },
  { href: "/setup", label: "Setup" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand" href="/dashboard">
        StyleOS Creator Studio CE
      </Link>
      <nav className="nav-list" aria-label="Studio navigation">
        {navItems.map((item) => (
          <Link
            className={`nav-link ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? "active" : ""}`}
            href={item.href}
            key={item.href}
          >
            <span aria-hidden="true">■</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
