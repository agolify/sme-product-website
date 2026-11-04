import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import logo from "@/assets/coffee-machines.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="CA Logo"
                className="ml-2 h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary bg-neutral"
                    : "text-neutral-foreground hover:text-primary hover:bg-neutral/50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="tel:+254185066399" className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a
                  href="https://wa.me/+254185066399"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary bg-neutral"
                    : "text-neutral-foreground hover:text-primary hover:bg-neutral/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 px-3 pt-2">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="tel:+254114100019"
                  className="flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a
                  href="https://wa.me/+254114100019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
