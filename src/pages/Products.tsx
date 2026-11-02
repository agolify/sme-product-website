import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { sampleProducts } from "../data/products.ts";
import { apiClient } from "@/lib/api";
import { Search, Filter } from "lucide-react";
import type { Product } from "@/components/ProductCard";
import { setPageMetadata } from "@/lib/seo";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    setPageMetadata({
      title: "Coffee Machines, Spare Parts & Equipment | Dawa Kenya",
      description: "Browse available coffee machines, spare parts and commercial equipment from Dawa in Nairobi, Kenya. Filter by product category and condition.",
      path: "/products",
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProducts();
        setProducts(data);

        // Get unique categories
        const uniqueCategories = [
          "All",
          ...new Set(data.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const loadingProducts = [" ", " ", " "];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesCondition =
      selectedCondition === "All" || product.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Coffee Machines & Commercial Equipment in Kenya
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Browse our extensive collection of Quality coffee machines
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-card rounded-lg shadow-card p-6 mb-8 border border-border">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-foreground mb-2">
                Condition
              </label>
              <Select
                value={selectedCondition}
                onValueChange={setSelectedCondition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Conditions</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedCondition("All");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          {loading ? (
            <p>getting products, please wait...</p>
          ) : (
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-12 bg-[url('/coffee-kenya.png')]">
            <div className="text-muted-foreground text-lg">
              Loading products...
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[url('/coffee-kenya.png')] bg-fit bg-center bg-no-repeat">
            <div className="max-w-md mx-auto">
              <div className="text-muted-foreground text-lg mb-4">
                No products found matching your criteria
              </div>
              <Button
                variant="outline"
                className="bg-transparent text-green-500 font-semibold"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedCondition("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
