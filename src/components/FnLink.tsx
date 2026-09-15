"use client";

import { track } from "@vercel/analytics";

export function FnLink({
  href,
  slug,
  className,
  children,
}: {
  href: string;
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track("fn_click", { slug })}
    >
      {children}
    </a>
  );
}
