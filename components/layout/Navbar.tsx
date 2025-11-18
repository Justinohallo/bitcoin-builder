"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
 * Chevron icon component for dropdown indicators
 */
function ChevronIcon({
  isOpen,
  size = "sm",
}: {
  isOpen: boolean;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <svg
      className={`${sizeClass} transition-transform ${isOpen ? "rotate-180" : ""}`}
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
  );
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
        { href: "/technical-roadmap", label: "Technical Roadmap" },
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
        { href: "/open-source", label: "Open Source" },
        { href: "/vibe-coding", label: "Vibe Coding" },
        { href: "/onboarding", label: "Onboarding" },
        { href: "/what-to-expect", label: "What to Expect" },
      ],
    },
    {
      label: "Community",
      children: [
        { href: "/cities", label: "Cities" },
        { href: "/sponsors", label: "Sponsors" },
        { href: "/members", label: "Members" },
      ],
    },
  ];

  // Helper functions
  const isActive = (href?: string, exactOnly = false) => {
    if (!href) return false;
    if (href === "/") {
      return pathname === "/";
    }

    // Exact match always wins
    if (pathname === href) {
      return true;
    }

    // If exactOnly is true (for child links), don't use startsWith
    if (exactOnly) {
      return false;
    }

    // For parent routes, check if pathname starts with href + "/"
    return pathname.startsWith(href + "/");
  };

  const hasActiveChild = (item: NavItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.href, true));
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const closeMenus = useCallback(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, []);

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    closeMenus();
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

  // Close dropdown when clicking outside (desktop only - mobile uses overlay)
  useEffect(() => {
    if (!openDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = dropdownRefs.current[openDropdown];
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

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
                      <ChevronIcon isOpen={isOpen} size="sm" />
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
                                  isActive(child.href, true)
                                    ? "bg-neutral-800 text-orange-400"
                                    : "text-neutral-300 hover:bg-neutral-800 hover:text-orange-400"
                                }`}
                                onClick={closeMenus}
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
        onClick={(e) => e.stopPropagation()}
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
              <div
                key={item.label}
                className="mb-1"
                ref={(el) => {
                  dropdownRefs.current[item.label] = el;
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownToggle(item.label);
                  }}
                  className={`w-full rounded-md px-4 py-3 text-base font-medium transition-colors flex items-center justify-between ${
                    isActiveItem || isOpen
                      ? "bg-neutral-800 text-orange-400"
                      : "text-neutral-300 hover:bg-neutral-800 hover:text-orange-400"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronIcon isOpen={isOpen} size="md" />
                </button>
                {isOpen && item.children && (
                  <div
                    className="mt-1 ml-4 border-l border-neutral-800 pl-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href || child.label}
                        href={child.href || "#"}
                        className={`block rounded-md px-4 py-2 text-sm font-medium transition-colors mb-1 ${
                          isActive(child.href, true)
                            ? "bg-neutral-800 text-orange-400"
                            : "text-neutral-300 hover:bg-neutral-800 hover:text-orange-400"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          closeMenus();
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
