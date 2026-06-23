import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center shadow-md">
                <span className="text-primary font-bold text-xl">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Aura Resorts</span>
                <span className="text-[10px] text-primary-foreground/75 uppercase tracking-widest leading-none font-semibold">
                  Luxury Stays
                </span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Discover and book the world's most luxurious accommodations across our premier branches. Exceptional service awaits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/85">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/branches" className="hover:text-white hover:underline transition">
                  Our Branches
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-white hover:underline transition">
                  Browse Rooms
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white hover:underline transition">
                  Compare Rooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Help & Info</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/85">
              <li>
                <a href="#" className="hover:text-white hover:underline transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-primary-foreground/85">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary-foreground/70" />
                <span>+1 (800) AURA-STAY</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary-foreground/70" />
                <a href="mailto:support@auraresorts.com" className="hover:text-white">
                  support@auraresorts.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary-foreground/70" />
                <span>768 Fifth Ave, New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70">
            &copy; {new Date().getFullYear()} Aura Resorts. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="p-2.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="p-2.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
