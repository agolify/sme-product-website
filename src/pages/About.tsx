import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Phone,
  CheckCircle,
  Award,
  Users,
  Recycle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { setPageMetadata } from "@/lib/seo";

const About = () => {
  useEffect(() => {
    setPageMetadata({ title: "About Dawa Coffee Machines | Nairobi, Kenya", description: "Learn about Dawa Coffee Machines and Accessories, a Nairobi supplier of tested coffee machines, genuine spare parts and commercial business equipment.", path: "/about" });
  }, []);
  const features = [
    {
      icon: CheckCircle,
      title: "Quality Tested",
      description: "Every piece of equipment is thoroughly tested and verified",
    },
    {
      icon: Award,
      title: "Great Value",
      description: "Significant savings compared to new equipment prices",
    },
    {
      icon: Users,
      title: "Business Focus",
      description: "Specializing in commercial and business equipment",
    },
    {
      icon: Recycle,
      title: "Sustainability",
      description: "Giving quality equipment a second life",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Dawa Coffee Machine & Business Equipment
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Your trusted partner for quality second-hand business equipment and
            professional support
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At Dawa Coffee Machine & Business Equipment, we believe in giving
              quality business equipment a second life. Our mission is to
              provide restaurants, cafes, and businesses with reliable,
              high-quality second-hand equipment at affordable prices while
              promoting sustainability.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              From coffee machines to fridges, meat slicers, and more - we
              carefully test and verify every piece of equipment to ensure it
              meets our high standards for performance and reliability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" asChild>
                <a
                  href="https://wa.me/+254114100019?text=Hi, I'd like to know more about your business"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Us
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:+254114100019">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Support
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:+254720983015">
                  <Phone className="mr-2 h-5 w-5" />
                  Other Contacts
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-gradient-card rounded-lg p-8 shadow-card">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Why Choose Us?
            </h3>
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-secondary/10 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-card-hover transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Quality First
                </h3>
                <p className="text-muted-foreground">
                  We provide only genuine Dawa parts and thoroughly tested
                  coffee machines to ensure optimal performance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card-hover transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Customer Focus
                </h3>
                <p className="text-muted-foreground">
                  We understand coffee businesses and provide tailored solutions
                  to keep your operations running efficiently.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card-hover transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Expertise
                </h3>
                <p className="text-muted-foreground">
                  Our specialized knowledge in coffee machine maintenance
                  ensures you get the right solution every time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-primary rounded-lg p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Upgrade Your Coffee Business?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Browse our coffee machines and spare parts or get in touch for
            expert advice on your coffee equipment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <a href="/products">Browse Products</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://wa.me/+254114100019?text=Hi, I have specific equipment needs"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Discuss Your Needs
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} All rights reserved{" "}
              <Link to="/" className="text-primary hover:underline">
                Dawa Coffee Machienes
              </Link>{" "}
              | Email:{" "}
              <a
                href="Adhappi94@gmail.com"
                className="text-primary hover:underline"
              >
                Adhappi94@gmail.com
              </a>{" "}
              | Support:{" "}
              <a
                href="tel:+254114100019"
                className="text-primary hover:underline"
              >
                +254 114 100 019
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
