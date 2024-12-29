import React from 'react'
import Link from 'next/link'
import { Github } from 'lucide-react'

const socialLinks = [
  {
    href: 'https://github.com',
    icon: Github,
    label: 'GitHub'
  },
]

const footerLinks = [
  { href: '#', label: 'Terms' },
  { href: '#', label: 'Privacy' },
  { href: '#', label: 'Cookies' }
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-6">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group"
              >
                <Icon className="h-5 w-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-200" />
              </Link>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            © {currentYear} Serin. All rights reserved.
          </p>

        
          <nav className="flex gap-6">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={label}
                className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200"
                href={href}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer