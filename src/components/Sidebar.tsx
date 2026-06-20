"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Scissors,
  FolderKanban,
  Lightbulb,
  UserCircle,
  Settings,
  Sparkles
} from "lucide-react";
import type { ComponentType } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number | string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/services", label: "Services", icon: Scissors },
      { href: "/cases", label: "Cases", icon: FolderKanban }
    ]
  },
  {
    title: "Knowledge",
    items: [{ href: "/knowledge/candidates", label: "Candidate Queue", icon: Lightbulb }]
  },
  {
    title: "Account",
    items: [
      { href: "/login", label: "Creator Profile", icon: UserCircle },
      { href: "/setup", label: "Setup", icon: Settings }
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="sidebar">
      <Link className="brand" href="/dashboard">
        <span className="brand-mark" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <span>
          StyleOS Creator Studio
          <span className="brand-sub">Hosted Alpha · CE</span>
        </span>
      </Link>

      {navGroups.map((group) => (
        <div key={group.title}>
          <p className="nav-section">{group.title}</p>
          <nav className="nav-list" aria-label={`${group.title} navigation`}>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link className={`nav-link ${isActive(item.href) ? "active" : ""}`} href={item.href} key={item.href}>
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      <div className="sidebar-footer">
        Invite-only Alpha · Hairstyle Workflow only. Cases, reports, and feedback stay within your studio.
      </div>
    </aside>
  );
}
