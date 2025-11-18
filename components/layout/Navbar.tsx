"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navigation item with optional children
 */
interface NavItem {
  href?: string;
  label: string;
  children?: NavItem[];
}

/**
 * Site navigation with hierarchical multi-layered menu
 * Features:
 * - Card-based dropdown menus on hover/click
 * - Responsive mobile menu with hamburger toggle
 * - Active page highlighting
 * - Scroll shadow effect
 * - Bitcoin orange accent color (text-orange-400)
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const navItems: NavItem[] = [
    { href: "/", label: "Home" },
    {
      label: "About",
      children: [
        { href: "/about", label: "Overview" },
        { href: "/about/mission", label: "Mission" },
        { href: "/about/vision", label: "Vision" },
        { href: "/about/charter", label: "Charter" },
        { href: "/about/philosophy", label: "Philosophy" },
      ],
    },
    {
      label: "Events",
      children: [
        { href: "/events", label: "Upcoming Events" },
        { href: "/recaps", label: "Event Recaps" },
        { href: "/news-topics", label: "News Topics" },
      ],
    },
    {
      label: "Content",
      children: [
        { href: "/presentations", label: "Presentations" },
        { href: "/presenters", label: "Presenters" },
        { href: "/resources", label: "Resources" },
      ],
    },
    {
      label: "Learn",
      children: [
        { href: "/bitcoin-101", label: "Bitcoin 101" },
        { href: "/lightning-101", label: "Lightning 101" },
        { href: "/layer-2-overview", label: "Layer 2 Overview" },
        { href: "/onboarding", label: "Onboarding" },
        { href: "/what-to-expect", label: "What to Expect" },
      ],
    },
    {
      label: "Community",
      children: [
        { href: "/cities", label: "Cities" },
        { href: "/sponsors", label: "Sponsors" },
      ],
    },
  ];

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes (only if menu is actually open)
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    // Intentionally only depend on pathname to close menu on navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdown = dropdownRefs.current[openDropdown];
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdown]);

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const hasActiveChild = (item: NavItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.href));
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950 transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-orange-400 hover:text-orange-300 transition-colors"
            >
              Builder Vancouver
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                if (item.href) {
                  // Simple link without dropdown
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-orange-400"
                          : "text-neutral-300 hover:text-orange-400"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                // Item with dropdown
                const isOpen = openDropdown === item.label;
                const isActiveItem = hasActiveChild(item);

                return (
                  <div
                    key={item.label}
                    className="relative"
                    ref={(el) => {
                      dropdownRefs.current[item.label] = el;
                    }}
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => handleDropdownToggle(item.label)}
                      className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                        isActiveItem || isOpen
                          ? "text-orange-400"
                          : "text-neutral-300 hover:text-orange-400"
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Card */}
                    {isOpen && item.children && (
                      <div className="absolute top-full left-0 pt-2 w-56 z-50">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden">
                          <div className="py-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.href || child.label}
                                href={child.href || "#"}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                  isActive(child.href)
                                    ? "bg-neutral-800 text-orange-400"
                                    : "text-neutral-300 hover:bg-neutral-800 hover:text-orange-400"
                                }`}
                                onClick={() => setOpenDropdown(null)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-300 hover:bg-neutral-800 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${
                  mobileMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed right-0 top-16 bottom-0 z-50 w-64 bg-neutral-950 border-l border-neutral-800 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4">
          {navItems.map((item) => {
            if (item.href) {
              // Simple link
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-4 py-3 text-base font-medium transition-colors mb-1 ${
                    isActive(item.href)
                      ? "bg-neutral-800 text-orange-400"
                      : "text-neutral-300 hover:bg-neutral-800 hover:text-orange-400"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            // Item with children
            const isOpen = openDropdown === item.label;
            const isActiveItem = hasActiveChild(item);

            return (
              <div key={item.label} className="mb-1">
                <button
                  onClick={() => handleDropdownToggle(item.label)}
                  className={`w-full rounded-md px-4 py-3 text-base font-medium transition-colors flex items-center justify-between ${
                    isActiveItem || isOpen
                      ? "bg-neutral-800 text-orange-400"
                      : "text-neutral-300 hover:bg-neutral-800 hover:text-orange-400"
                  }`}
                >
                  <span>{item.label}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isOpen && item.children && (
                  <div className="mt-1 ml-4 border-l border-neutral-800 pl-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href || child.label}
                        href={child.href || "#"}
                        className={`block rounded-md px-4 py-2 text-sm font-medium transition-colors mb-1 ${
                          isActive(child.href)
                            ? "bg-neutral-800 text-orange-400"
                            : "text-neutral-300 hover:bg-neutral-800 hover:text-orange-400"
                        }`}
                        onClick={() => {
                          setOpenDropdown(null);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
