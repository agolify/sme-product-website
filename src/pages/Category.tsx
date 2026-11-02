import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard, { type Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { setPageMetadata } from "@/lib/seo";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Category = () => {
  const { slug = "" } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getProducts().then((items: Product[]) => {
      const match = [...new Set(items.map((item) => item.category))].find((name) => slugify(name) === slug);
      setCategory(match ?? "");
      setProducts(match ? items.filter((item) => item.category === match) : []);
    }).catch((error) => console.error("Failed to fetch category products:", error)).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const name = category || "Equipment";
    setPageMetadata({
      title: `${name} in Kenya | Dawa Coffee Machines`,
      description: `Browse ${name.toLowerCase()} available from Dawa Coffee Machines in Nairobi, Kenya. Contact us to confirm current stock, pricing and delivery options.`,
      path: `/category/${slug}`,
      robots: category ? "index, follow" : "noindex, follow",
    });
  }, [category, slug]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span> <Link to="/products">Products</Link> <span aria-hidden="true">/</span> {category || "Category"}
      </nav>
      <h1 className="text-4xl font-bold mb-4">{category || "Product category"} in Kenya</h1>
      <p className="text-lg text-muted-foreground max-w-3xl mb-8">Explore {category || "equipment"} from Dawa Coffee Machines in Nairobi. Contact us to confirm current availability, pricing and support for your business.</p>
      {loading ? <p>Loading products...</p> : !category ? <div><p>This category is unavailable.</p><Button asChild className="mt-4"><Link to="/products">Browse all products</Link></Button></div> : products.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{products.map((product) => <ProductCard key={product._id || product.id} product={product} />)}</div> : <p>No products are currently listed in this category. <Link to="/contact" className="underline">Contact us</Link> to ask about availability.</p>}
    </main>
  );
};

export default Category;
