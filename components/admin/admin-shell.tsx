import Link from "next/link";
import type { ReactNode } from "react";
import { isAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { LoginForm } from "@/app/admin/login-form";
import { logout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Leads" },
  { href: "/admin/gallery", label: "Before & After" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/branding", label: "Branding" },
];

/**
 * Gate + chrome for every admin page.
 *
 * The gate lives here rather than in each page so a new admin page cannot
 * accidentally ship without one — the failure mode of per-page checks is that
 * someone forgets, and the page is public.
 */
export async function AdminShell({
  title,
  intro,
  actions,
  children,
}: {
  title: string;
  intro?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  if (!isAdminConfigured()) {
    return (
      <Frame>
        <div className="max-w-xl border-2 border-siren-500 p-8">
          <h1 className="font-display text-3xl uppercase tracking-tight text-paper-50">
            Admin is disabled
          </h1>
          <p className="mt-5 leading-relaxed text-carbon-300">
            No <code className="font-mono text-hivis-400">ADMIN_ACCESS_CODE</code>{" "}
            is set, so this area is closed. Set one (at least 12 characters) in
            Vercel and redeploy.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-carbon-500">
            This fails closed on purpose — a missing environment variable must
            never mean the leads are public.
          </p>
        </div>
      </Frame>
    );
  }

  if (!(await isAuthenticated())) {
    return (
      <Frame>
        <div className="flex min-h-[60vh] flex-col items-start justify-center">
          <span className="grid h-12 w-12 place-items-center bg-hivis-400 font-display text-base tracking-tight text-carbon-950">
            JCK
          </span>
          <h1 className="mt-6 font-display text-4xl uppercase tracking-tight text-paper-50">
            Admin
          </h1>
          <p className="mt-3 text-carbon-400">Enter the access code to continue.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <nav
        aria-label="Admin sections"
        className="flex flex-wrap items-center gap-2 border-b-2 border-carbon-800 pb-5"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="stamp border border-carbon-700 px-3 py-2 text-carbon-300 transition-colors hover:border-hivis-400 hover:text-hivis-400"
          >
            {item.label}
          </Link>
        ))}
        <form action={logout} className="ml-auto">
          <button
            type="submit"
            className="stamp border border-carbon-700 px-3 py-2 text-carbon-400 transition-colors hover:border-siren-500 hover:text-siren-500"
          >
            Sign out
          </button>
        </form>
      </nav>

      <header className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-5xl uppercase tracking-tight text-paper-50">
            {title}
          </h1>
          {intro ? (
            <p className="mt-3 max-w-2xl leading-relaxed text-carbon-400">
              {intro}
            </p>
          ) : null}
        </div>
        {actions}
      </header>

      <div className="mt-10">{children}</div>
    </Frame>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="grain blueprint min-h-screen bg-carbon-950 py-12">
      <div className="container-page">{children}</div>
    </div>
  );
}
