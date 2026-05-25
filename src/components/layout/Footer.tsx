import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">H</span>
              </div>
              <span className="font-bold text-xl">Luxury Hotels</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Discover and book the world's most luxurious accommodations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary-foreground/80 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/hotels" className="hover:text-primary-foreground/80 transition">
                  Browse Hotels
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary-foreground/80 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary-foreground/80 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/faq" className="hover:text-primary-foreground/80 transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-primary-foreground/80 transition">
                  Support
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary-foreground/80 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-primary-foreground/80 transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+1 (800) LUXURY-1</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:support@luxuryhotels.com" className="hover:text-primary-foreground/80">
                  support@luxuryhotels.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>New York, USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/80">
            &copy; 2024 Luxury Hotels. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
