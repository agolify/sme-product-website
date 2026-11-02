import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiClient } from "@/lib/api";
import { setPageMetadata } from "@/lib/seo";
import type { Product } from "@/components/ProductCard";


const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined;

async function searchUnsplashFirstImage(query: string): Promise<string | null> {
	if (!UNSPLASH_ACCESS_KEY) return null;
	try {
		const url = new URL("https://api.unsplash.com/search/photos");
		url.searchParams.set("query", query);
		url.searchParams.set("per_page", "1");
		const res = await fetch(url.toString(), {
			headers: {
				Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
			}
		});
		if (!res.ok) return null;
		const data = await res.json();
		const first = data?.results?.[0];
		const src = first?.urls?.small || first?.urls?.regular || null;
		return src ?? null;
	} catch (_) {
		return null;
	}
}

function useProductsState() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const data = await apiClient.getProducts();
			setProducts(data);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch products');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return { products, loading, error, refresh: fetchProducts };
}

const emptyDraft: Omit<Product, "id" | "_id"> = {
	title: "",
	description: "",
	price: "",
	image: "",
	images: [],
	category: "Coffee & Beverage",
	condition: "Good",
	stock: 0
};

const Admin = () => {
	useEffect(() => {
		setPageMetadata({ title: "Admin | Dawa Coffee Machines", description: "Dawa product administration.", path: "/admin", robots: "noindex, nofollow" });
	}, []);
	const { products, loading, error, refresh } = useProductsState();
	const [isAuthed, setIsAuthed] = useState<boolean>(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [editing, setEditing] = useState<Product | null>(null);
	const [draft, setDraft] = useState<Omit<Product, "id" | "_id">>(emptyDraft);
	const [imgQuery, setImgQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [localFile, setLocalFile] = useState<File | null>(null);
	const [localFiles, setLocalFiles] = useState<File[]>([]);
	const [user, setUser] = useState<any>(null);
	
	// Password change state
	const [showPasswordDialog, setShowPasswordDialog] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	
	// Username change state
	const [showUsernameDialog, setShowUsernameDialog] = useState(false);
	const [newUsername, setNewUsername] = useState("");
	const [usernameCurrentPassword, setUsernameCurrentPassword] = useState("");
	const [isChangingUsername, setIsChangingUsername] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await apiClient.verifyToken();
				if (response.valid) {
					setIsAuthed(true);
					setUser(response.user);
				}
			} catch (err) {
				apiClient.logout();
			}
		};
		checkAuth();
	}, []);

	const doLogin = async () => {
		setIsLoggingIn(true);
		try {
			const response = await apiClient.login(email, password);
			setIsAuthed(true);
			setUser(response.user);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Login failed");
			setIsLoggingIn(false);
		}
	};

	const startEdit = (p: Product) => {
		setEditing(p);
		setDraft({
			title: p.title,
			description: p.description,
			price: p.price || "",
			image: p.image,
			images: p.images || [],
			category: p.category,
			condition: p.condition,
			stock: p.stock ?? 0
		});
	};

	const saveEdit = async () => {
		if (!editing) return;
		try {
			await apiClient.updateProduct(editing._id || editing.id, draft);
			setEditing(null);
			setDraft(emptyDraft);
			refresh();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to update product");
		}
	};

	const addNew = async () => {
		try {
			const response = await apiClient.createProduct(draft);
			setEditing(response.product);
			setDraft({ ...draft });
			refresh();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to create product");
		}
	};

	const remove = async (id: string) => {
		if (!confirm("Delete this product?")) return;
		try {
			await apiClient.deleteProduct(id);
			if (editing?.id === id) {
				setEditing(null);
			}
			refresh();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to delete product");
		}
	};

	const searchAndApplyImage = async () => {
		if (!editing) return;
		setIsSearching(true);
		const query = imgQuery || draft.title || editing.title;
		const url = await searchUnsplashFirstImage(query);
		if (url) {
			try {
				await apiClient.updateProduct(editing._id || editing.id, { image: url });
				setDraft((d) => ({ ...d, image: url }));
				refresh();
			} catch (err) {
				alert(err instanceof Error ? err.message : "Failed to update image");
			}
		} else {
			alert("No image found or API key missing.");
		}
		setIsSearching(false);
	};

	const onLocalFileChange = async (file: File | null) => {
		setLocalFile(file);
		if (!file) return;
		
		try {
			console.log('Uploading file:', file.name, file.type, file.size);
			const response = await apiClient.uploadImage(file);
			console.log('Upload response:', response);
			const imageUrl = apiClient.getImageUrl(response.imageId);
			console.log('Generated image URL:', imageUrl);
			setDraft((d) => ({ ...d, image: imageUrl }));
			if (editing) {
				await apiClient.updateProduct(editing._id || editing.id, { image: imageUrl });
				refresh();
			}
		} catch (err) {
			console.error('Upload error:', err);
			alert(err instanceof Error ? err.message : "Failed to upload image");
		}
	};

	const onMultipleFilesChange = async (files: FileList | null) => {
		if (!files || files.length === 0) return;
		
		const fileArray = Array.from(files);
		setLocalFiles(fileArray);
		
		try {
			console.log('Uploading multiple files:', fileArray.map(f => f.name));
			const responses = await apiClient.uploadMultipleImages(fileArray);
			console.log('Upload responses:', responses);
			const imageUrls = responses.map(response => apiClient.getImageUrl(response.imageId));
			console.log('Generated image URLs:', imageUrls);
			
			// Set first image as primary image if no primary image is set
			const updatedDraft = { 
				...draft, 
				images: [...(draft.images || []), ...imageUrls],
				image: draft.image || imageUrls[0] // Set first image as primary if no primary exists
			};
			setDraft(updatedDraft);
			
			if (editing) {
				await apiClient.updateProduct(editing._id || editing.id, updatedDraft);
				refresh();
			}
		} catch (err) {
			console.error('Upload error:', err);
			alert(err instanceof Error ? err.message : "Failed to upload images");
		}
	};

	const handlePasswordChange = async () => {
		// Validate inputs
		if (!currentPassword || !newPassword || !confirmPassword) {
			alert("All fields are required");
			return;
		}

		if (newPassword.length < 6) {
			alert("New password must be at least 6 characters long");
			return;
		}

		if (newPassword !== confirmPassword) {
			alert("New passwords do not match");
			return;
		}

		setIsChangingPassword(true);
		try {
			await apiClient.changePassword(currentPassword, newPassword);
			alert("Password changed successfully!");
			setShowPasswordDialog(false);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to change password");
		} finally {
			setIsChangingPassword(false);
		}
	};

	const handleUsernameChange = async () => {
		// Validate inputs
		if (!newUsername || !usernameCurrentPassword) {
			alert("All fields are required");
			return;
		}

		if (newUsername.trim().length < 2) {
			alert("Username must be at least 2 characters long");
			return;
		}

		setIsChangingUsername(true);
		try {
			const response = await apiClient.changeUsername(newUsername.trim(), usernameCurrentPassword);
			alert("Username changed successfully!");
			setUser(response.user); // Update user state with new username
			setShowUsernameDialog(false);
			setNewUsername("");
			setUsernameCurrentPassword("");
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to change username");
		} finally {
			setIsChangingUsername(false);
		}
	};

	if (!isAuthed) {
		return (
			<div className="max-w-md mx-auto py-16 px-4">
				<Card className="border-border">
					<CardContent className="p-6 space-y-4">
						<h2 className="text-2xl font-bold">Admin Login</h2>
						<Input
							type="email"
							placeholder="Enter email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							type="password"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button onClick={doLogin} className={isLoggingIn ? "w-full bg-red-200" : "w-full"}>{isLoggingIn ? "please wait..." : "Login"}</Button>
						<p className="text-xs text-muted-foreground">Use admin or merchant credentials</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground">Welcome, {user?.name} ({user?.role})</p>
				</div>
				<div className="space-x-2">
					<Dialog open={showUsernameDialog} onOpenChange={setShowUsernameDialog}>
						<DialogTrigger asChild>
							<Button variant="outline">Change Username</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Change Username</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<Input
									placeholder="New username"
									value={newUsername}
									onChange={(e) => setNewUsername(e.target.value)}
								/>
								<Input
									type="password"
									placeholder="Current password"
									value={usernameCurrentPassword}
									onChange={(e) => setUsernameCurrentPassword(e.target.value)}
								/>
								<div className="flex justify-end space-x-2">
									<Button variant="outline" onClick={() => setShowUsernameDialog(false)}>
										Cancel
									</Button>
									<Button 
										onClick={handleUsernameChange} 
										disabled={isChangingUsername}
									>
										{isChangingUsername ? "Changing..." : "Change Username"}
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
					<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
						<DialogTrigger asChild>
							<Button variant="outline">Change Password</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Change Password</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<Input
									type="password"
									placeholder="Current password"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
								/>
								<Input
									type="password"
									placeholder="New password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
								<Input
									type="password"
									placeholder="Confirm new password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<div className="flex justify-end space-x-2">
									<Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
										Cancel
									</Button>
									<Button 
										onClick={handlePasswordChange} 
										disabled={isChangingPassword}
									>
										{isChangingPassword ? "Changing..." : "Change Password"}
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
					<Button variant="secondary" onClick={() => { apiClient.logout(); setIsAuthed(false); setUser(null); }}>Logout</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-1 border-border">
					<CardContent className="p-6 space-y-4">
						<h2 className="text-xl font-semibold">{editing ? "Edit Product" : "Add Product"}</h2>
						<Input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
						<Textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
						<Input placeholder="Price" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
						<Input type="number" placeholder="Amount in stock" value={draft.stock ?? 0}
							onChange={(e) => setDraft({ ...draft, stock: Number.isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value) })} />
						<Input placeholder="Image URL" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
						<label className="text-sm text-muted-foreground">Upload primary image from device</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => onLocalFileChange(e.target.files?.[0] || null)}
						/>
						
						<div className="space-y-2">
							<label className="text-sm text-muted-foreground">Upload multiple additional images</label>
							<input
								type="file"
								accept="image/*"
								multiple
								onChange={(e) => onMultipleFilesChange(e.target.files)}
								className="w-full"
							/>
							<p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple images</p>
						</div>
						
						{draft.images && draft.images.length > 0 && (
							<div className="space-y-2">
								<label className="text-sm text-muted-foreground">Additional Images ({draft.images.length})</label>
								<div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
									{draft.images.map((img, index) => (
										<div key={index} className="relative">
											<img 
												src={img} 
												alt={`Additional image ${index + 1}`}
												className="w-full h-16 object-cover rounded border"
											/>
											<button
												type="button"
												onClick={() => {
													const newImages = draft.images?.filter((_, i) => i !== index) || [];
													setDraft({ ...draft, images: newImages });
												}}
												className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
											>
												×
											</button>
										</div>
									))}
								</div>
							</div>
						)}
						<Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
							<SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
							<SelectContent>
								<SelectItem value="Coffee & Beverage">Coffee & Beverage</SelectItem>
								<SelectItem value="Baking & Cooking">Baking & Cooking</SelectItem>
							</SelectContent>
						</Select>
						<Select value={draft.condition} onValueChange={(v: any) => setDraft({ ...draft, condition: v })}>
							<SelectTrigger><SelectValue placeholder="Condition" /></SelectTrigger>
							<SelectContent>
								<SelectItem value="Excellent">Excellent</SelectItem>
								<SelectItem value="Good">Good</SelectItem>
								<SelectItem value="Fair">Fair</SelectItem>
							</SelectContent>
						</Select>
						<div className="flex gap-2">
							{editing ? (
								<>
									<Button onClick={saveEdit}>Save Changes</Button>
									<Button variant="outline" onClick={() => { setEditing(null); setDraft(emptyDraft); }}>Cancel</Button>
								</>
							) : (
								<Button onClick={addNew}>Add Product</Button>
							)}
						</div>

						<div className="pt-2 space-y-2">
							<h3 className="font-medium">Search and Replace Image</h3>
							<Input placeholder="Search image term (e.g. espresso machine)" value={imgQuery} onChange={(e) => setImgQuery(e.target.value)} />
							<Button onClick={searchAndApplyImage} disabled={!editing || isSearching}>{isSearching ? "Searching..." : "Search & Apply"}</Button>
							{!UNSPLASH_ACCESS_KEY && (
								<p className="text-xs text-muted-foreground">Set VITE_UNSPLASH_ACCESS_KEY in .env to enable image search.</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card className="lg:col-span-2 border-border">
					<CardContent className="p-6">
						{loading ? (
							<div className="text-center py-8">Loading products...</div>
						) : error ? (
							<div className="text-center py-8 text-red-500">Error: {error}</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
								{products.map((p) => (
									<div key={p._id || p.id} className="border rounded-lg overflow-hidden">
										<img src={p.image} alt={p.title} className="w-full aspect-square object-cover" />
										<div className="p-3 space-y-1">
											<p className="font-semibold line-clamp-1">{p.title}</p>
											<p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
											<div className="flex items-center justify-between pt-2">
												<Button size="sm" onClick={() => startEdit(p)}>Edit</Button>
												<Button size="sm" variant="destructive" onClick={() => remove(p._id || p.id)}>Delete</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Admin;


