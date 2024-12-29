import { Feather } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b">
      <Link className="flex items-center justify-center" href="/">
        <Feather className="h-6 w-6 text-purple-600" />
        <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Serin
        </span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:text-purple-600 transition-colors" href="#features">
          Features
        </Link>
        <Link className="text-sm font-medium hover:text-purple-600 transition-colors" href="#how-it-works">
          How It Works
        </Link>
        <Link className="text-sm font-medium hover:text-purple-600 transition-colors" href="#ai-integration">
          AI Integration
        </Link>
        <Link className="text-sm font-medium hover:text-purple-600 transition-colors" href="#testimonials">
          Testimonials
        </Link>
        <Link className="text-sm font-medium hover:text-purple-600 transition-colors" href="#cta">
          Get Started
        </Link>
      </nav>
    </header>
  );
}