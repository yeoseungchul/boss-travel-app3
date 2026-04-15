"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={active ? 2 : 1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={active ? 2 : 1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" d="M4.5 5.25h6v6h-6zm9 0h6v6h-6zm-9 9h6v6h-6zm9 0h6v6h-6" />
    </svg>
  );
}

function ChatBubbleIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={active ? 2 : 1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.734-.149 5.98 5.98 0 01-1.086-1.061.75.75 0 01.149-.734 5.976 5.976 0 011.06-1.086.75.75 0 01.734-.149A9.75 9.75 0 003 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={active ? 2 : 1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

const baseTab =
  "flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.7rem] font-medium tracking-wide transition active:scale-[0.97]";

const activeTab = "bg-boss-accent-soft text-boss-accent";
const idleTab = "text-[var(--muted)]";

export function FixedBottomNav() {
  const pathname = usePathname();
  const t = useTranslations("Nav");

  const onProducts = pathname === "/product" || pathname.startsWith("/product/");

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
      aria-label={t("barAria")}
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-md items-stretch gap-1 rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-0)]/95 px-2 py-2 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <Link href="/" className={`${baseTab} ${pathname === "/" ? activeTab : idleTab}`}>
          <HomeIcon active={pathname === "/"} />
          <span>{t("home")}</span>
        </Link>
        <Link href="/product" className={`${baseTab} ${onProducts ? activeTab : idleTab}`}>
          <GridIcon active={onProducts} />
          <span>{t("products")}</span>
        </Link>
        <Link href="/inquiry" className={`${baseTab} ${pathname === "/inquiry" ? activeTab : idleTab}`}>
          <ChatBubbleIcon active={pathname === "/inquiry"} />
          <span>{t("inquiry")}</span>
        </Link>
        <Link href="/mypage" className={`${baseTab} ${pathname === "/mypage" ? activeTab : idleTab}`}>
          <UserIcon active={pathname === "/mypage"} />
          <span>{t("mypage")}</span>
        </Link>
      </div>
    </nav>
  );
}
