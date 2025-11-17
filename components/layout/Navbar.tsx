import Link from "next/link";

/**
 * Site navigation with links to all main pages
 * Uses Bitcoin orange as accent color (text-orange-400)
 */
export function Navbar() {
    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/events", label: "Events" },
        { href: "/onboarding", label: "Onboarding" },
        { href: "/what-to-expect", label: "What to Expect" },
        { href: "/resources", label: "Resources" },
        { href: "/recaps", label: "Recaps" },
    ];

    return (
        <nav className="border-b border-neutral-800 bg-neutral-950">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-xl font-bold text-orange-400 hover:text-orange-300 transition-colors"
                        >
                            Builder Vancouver
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-neutral-300 hover:text-orange-400 transition-colors text-sm font-medium"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

