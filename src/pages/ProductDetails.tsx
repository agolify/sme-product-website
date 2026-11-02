import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/components/ProductCard";
import { setPageMetadata, siteUrl } from "@/lib/seo";

const ProductDetails = () => {
	const params = useParams();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	useEffect(() => {
		const fetchProduct = async () => {
			if (!params.id) return;
			try {
				const data = await apiClient.getProduct(params.id);
				setProduct(data);
			} catch (error) {
				console.error('Failed to fetch product:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [params.id]);

	useEffect(() => {
		if (!product || !params.id) {
			if (!loading) setPageMetadata({ title: "Product unavailable | Dawa Coffee Machines", description: "This product could not be found. Browse the current Dawa Coffee Machines catalog.", path: `/product/${params.id ?? ""}`, robots: "noindex, follow" });
			return;
		}

		const description = `${product.title} from Dawa Coffee Machines in Nairobi, Kenya. ${product.category}. ${product.description}`.slice(0, 300);
		const path = `/product/${params.id}`;
		setPageMetadata({ title: `${product.title} | Dawa Coffee Machines Kenya`, description, path, image: product.image });

		const price = Number(String(product.price).replace(/[^0-9.]/g, ""));
		const schema = Number.isFinite(price) && price > 0 ? {
			"@context": "https://schema.org",
			"@type": "Product",
			name: product.title,
			description: product.description,
			image: product.image,
			category: product.category,
			offers: {
				"@type": "Offer",
				url: `${siteUrl}${path}`,
				priceCurrency: "KES",
				price,
				availability: product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
				itemCondition: `https://schema.org/${product.condition === "New" ? "NewCondition" : "UsedCondition"}`,
			},
		} : null;
		let script = document.head.querySelector<HTMLScriptElement>('script[data-page-product-schema="true"]');
		if (!script && schema) {
			script = document.createElement("script");
			script.type = "application/ld+json";
			script.dataset.pageProductSchema = "true";
			document.head.appendChild(script);
		}
		if (script) {
			if (schema) script.textContent = JSON.stringify(schema);
			else script.remove();
		}
	}, [loading, params.id, product]);

	// Get all images (primary + additional)
	const getAllImages = () => {
		if (!product) return [];
		const images = [product.image];
		if (product.images && product.images.length > 0) {
			images.push(...product.images);
		}
		return images;
	};

	const images = getAllImages();

	const nextImage = () => {
		setSelectedImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	if (loading) {
		return (
			<div className="max-w-3xl mx-auto py-12 px-4">
				<Card className="border-border">
					<CardContent className="p-6 space-y-4">
						<p className="text-lg">Loading product...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="max-w-3xl mx-auto py-12 px-4">
				<Card className="border-border">
					<CardContent className="p-6 space-y-4">
						<p className="text-lg">Product not found.</p>
						<Button asChild>
							<Link to="/products">Back to Products</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div className="w-full space-y-4">
				{/* Main Image Display */}
				<div className="relative group">
					<img 
						src={images[selectedImageIndex]} 
						alt={product.title} 
						className="w-full aspect-square object-cover rounded-lg border border-border" 
					/>
					
					{/* Navigation Arrows */}
					{images.length > 1 && (
						<>
							<Button
								variant="outline"
								size="icon"
								className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
								onClick={prevImage}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
								onClick={nextImage}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</>
					)}
					
					{/* Image Counter */}
					{images.length > 1 && (
						<div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
							{selectedImageIndex + 1} / {images.length}
						</div>
					)}
				</div>
				
				{/* Thumbnail Gallery */}
				{images.length > 1 && (
					<div className="flex gap-2 overflow-x-auto pb-2">
						{images.map((img, index) => (
							<button
								key={index}
								onClick={() => setSelectedImageIndex(index)}
								className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
									index === selectedImageIndex 
										? 'border-primary ring-2 ring-primary/20' 
										: 'border-border hover:border-primary/50'
								}`}
							>
								<img 
									src={img} 
									alt={`${product.title} view ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							</button>
						))}
					</div>
				)}
			</div>
			<div className="space-y-4">
				<p className="text-sm text-muted-foreground">{product.category} • {product.condition}</p>
				<h1 className="text-3xl font-bold">{product.title}</h1>
				{product.price && <p className="text-2xl font-semibold text-primary">KES {product.price}</p>}
				<p className="text-base text-foreground whitespace-pre-line">{product.description}</p>
				<p className="text-sm">In stock: <span className="font-medium">{product.stock ?? 0}</span></p>
				<div className="flex gap-2 pt-2">
					<Button asChild variant="ghost"><a href="tel:+254114100019">Call</a></Button>
					<Button asChild variant="secondary"><a href={`https://wa.me/+254114100019?text=Hi, I'm interested in: ${product.title}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></Button>
					<Button asChild variant="outline"><Link to="/products">Back</Link></Button>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;


