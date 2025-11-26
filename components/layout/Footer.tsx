import Link from "next/link";

import { paths } from "@/lib/utils/urls";

/**
 * Footer component with organized links and site information
 * Features:
 * - Multi-column layout with categorized links
 * - Social media links
 * - Copyright and site information
 * - Responsive design matching navbar style
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { href: paths.about.overview(), label: "Overview" },
      { href: paths.about.mission(), label: "Mission" },
      { href: paths.about.vision(), label: "Vision" },
      { href: paths.about.charter(), label: "Charter" },
      { href: paths.about.philosophy(), label: "Philosophy" },
    ],
    events: [
      { href: paths.events.list(), label: "Upcoming Events" },
      { href: paths.recaps.list(), label: "Event Recaps" },
      { href: paths.newsTopics.list(), label: "News Topics" },
    ],
    content: [
      { href: paths.presentations.list(), label: "Presentations" },
      { href: paths.presenters.list(), label: "Presenters" },
      { href: paths.resources(), label: "Resources" },
    ],
    learn: [
      { href: paths.education.bitcoin101(), label: "Bitcoin 101" },
      { href: paths.education.lightning101(), label: "Lightning 101" },
      { href: paths.education.layer2(), label: "Layer 2 Overview" },
      { href: paths.education.vibeCoding(), label: "Vibe Coding" },
      { href: paths.onboarding(), label: "Onboarding" },
      { href: paths.whatToExpect(), label: "What to Expect" },
    ],
    community: [
      { href: paths.cities.list(), label: "Cities" },
      { href: paths.sponsors.list(), label: "Sponsors" },
      { href: paths.members.list(), label: "Members" },
      { href: paths.contact(), label: "Contact" },
    ],
  };

  // Social media links - update these with actual URLs
  const socialLinks = [
    {
      name: "X (Twitter)",
      href: "https://x.com/builder_van", // Update with actual URL
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Nostr",
      href: "https://nostr.com/builder_van", // Update with actual Nostr profile URL
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
    },
    {
      name: "Luma",
      href: "https://lu.ma/builder-vancouver", // Update with actual Luma URL
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* About Section */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 mb-4">
              About
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events Section */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 mb-4">
              Events
            </h3>
            <ul className="space-y-3">
              {footerLinks.events.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Section */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 mb-4">
              Content
            </h3>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn Section */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 mb-4">
              Learn
            </h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Info Section */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 mb-4">
              Connect
            </h3>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-orange-400 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="text-xs text-neutral-500 space-y-2">
              <p>Builder Vancouver</p>
              <p>Bitcoin Meetups & Education</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-neutral-500">
              © {currentYear} Builder Vancouver. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href={paths.home()}
                className="text-sm text-neutral-500 hover:text-orange-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href={paths.home()}
                className="text-sm text-neutral-500 hover:text-orange-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
