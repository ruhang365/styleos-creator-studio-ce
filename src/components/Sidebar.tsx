"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scissors, FolderKanban, Link2, Lightbulb, Settings, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

interface NavItem {
  href: string;
  label: string;
  hint: string;
  icon: ComponentType<{ size?: number | string }>;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "发型咨询", hint: "工作台", icon: Scissors },
  { href: "/cases", label: "案例记录", hint: "进行中的咨询", icon: FolderKanban },
  { href: "/services", label: "服务链接", hint: "采集入口管理", icon: Link2 },
  { href: "/knowledge/candidates", label: "知识候选", hint: "沉淀经验", icon: Lightbulb },
  { href: "/setup", label: "设置", hint: "工作区配置", icon: Settings }
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
          StyleOS 造型工作台
          <span className="brand-sub">发型顾问咨询助手</span>
        </span>
      </Link>

      <nav className="nav-list" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link className={`nav-link ${isActive(item.href) ? "active" : ""}`} href={item.href} key={item.href}>
              <Icon size={18} />
              <span className="nav-link-text">
                <span className="nav-link-label">{item.label}</span>
                <span className="nav-link-hint">{item.hint}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        内测版 · 仅发型造型工作流。案例、报告与反馈均保存在你自己的工作区内。
      </div>
    </aside>
  );
}
