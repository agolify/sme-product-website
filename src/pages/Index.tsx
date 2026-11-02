import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { ArrowRight, Smartphone, Building, Cog } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/components/ProductCard";
import { setPageMetadata } from "@/lib/seo";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageMetadata({
      title: "Coffee Machines & Commercial Equipment in Kenya | Dawa",
      description: "Shop tested coffee machines, genuine spare parts and commercial catering equipment in Nairobi, Kenya. Contact Dawa for current stock and expert support.",
      path: "/",
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.filter((product) => product.featured);

  const categoryDescriptions: Record<string, string> = {
    "Coffee Machines": "Professional coffee machines, espresso machines, and grinders",
    "Coffee & Beverage": "Coffee grinders, beverage equipment, and accessories",
    "Spare Parts": "Genuine spare parts for coffee and business equipment",
    Refrigeration: "Commercial refrigerators, freezers, and cooling equipment",
    "Food Processing": "Food preparation equipment for commercial kitchens",
    "Baking & Cooking": "Ovens and commercial baking and cooking equipment",
  };
  const categories = [...new Set(products.map((product) => product.category))].map((name) => ({
    name,
    icon: name.toLowerCase().includes("coffee") ? Smartphone : name === "Refrigeration" ? Building : Cog,
    description: categoryDescriptions[name] || `Commercial ${name.toLowerCase()} for cafes, restaurants, and businesses`,
    count: products.filter((product) => product.category === name).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Categories Section */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you need from our organized categories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link to={`/category/${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`} key={category.name} className="block">
                <Card
                  className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <CardHeader className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <p className="text-sm font-medium text-secondary">
                      {category.count} {category.count === 1 ? "product" : "products"} currently listed
                    </p>
                  </CardContent>
                </Card>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/products">
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hand-picked equipment offering exceptional value
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-muted-foreground">
                  Loading featured products...
                </div>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))
            )}
          </div>

          <div className="text-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Dawa Coffee Machine & Business Equipment?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your trusted partner for quality coffee machines in kenya - giving
            coffee machines a second life while saving you money
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                Quality
              </div>
              <p className="text-muted-foreground">
                Every item tested & verified
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                Savings
              </div>
              <p className="text-muted-foreground">
                Up to 70% off retail prices
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                Sustainability
              </div>
              <p className="text-muted-foreground">
                Giving coffee machines a second life
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Trust</div>
              <p className="text-muted-foreground">
                Trusted coffee machines by businesses
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
