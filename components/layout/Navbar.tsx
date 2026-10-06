"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/projects", label: "Projects" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b px-6 py-4 flex justify-between items-center bg-white">
      <h1 className="text-xl font-bold tracking tight">
        <Link href="/">ActiDesk</Link>
      </h1>

      <div className="flex gap-6 items-center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? "text-blue-600 font-semibold" //active style
                  : "text-gray-500 hover:text-gray-900" //inactive style
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
