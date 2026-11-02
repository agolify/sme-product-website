import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";

const Hero = () => {
  const slides = [slide1, slide2, slide3];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Coffee Machines in Kenya
            <span className="block text-secondary"> & Commercial Equipment</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Giving quality business equipment a second life. From coffee
            machines to fridges, meat slicers, and more. Plus genuine spare
            parts and accessories. Quality tested, throw away prices, and expert
            support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/products" className="text-lg px-8">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" asChild>
                <a
                  href="tel:+254114100019"
                  className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>

              <Button variant="secondary" size="lg" asChild>
                <a
                  href="https://wa.me/+254114100019?text=Hi, I'd like to know more about your equipment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-primary-foreground/80">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  500+
                </div>
                <div className="text-sm">Items Sold</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  100%
                </div>
                <div className="text-sm">Quality Tested</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  24/7
                </div>
                <div className="text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
