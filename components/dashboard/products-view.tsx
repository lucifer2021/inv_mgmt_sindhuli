"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Tag, DollarSign } from "lucide-react";
import { generateProductId } from "@/lib/utils/generators";
import { supabase } from "@/lib/db/schema";
import type { Product } from "@/lib/db/schema";

export function ProductsView({ searchQuery }: { searchQuery: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [newCategory, setNewCategory] = useState("");

  const calculateTotals = (cp: number, sp: number, stock: number) => {
    const totalCost = cp * stock;
    const expectedRevenue = sp * stock;
    const expectedProfit = expectedRevenue - totalCost;
    return { totalCost, expectedRevenue, expectedProfit };
  };

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.costPrice && newProduct.sellingPrice) {
      const productCode = generateProductId();
      const { totalCost, expectedRevenue, expectedProfit } = calculateTotals(
        Number(newProduct.costPrice),
        Number(newProduct.sellingPrice),
        Number(newProduct.stock) || 0
      );

      const product: Product = {
        id: crypto.randomUUID(),
        code: productCode,
        name: newProduct.name,
        description: newProduct.description || "",
        category: newCategory || newProduct.category || "Other",
        costPrice: Number(newProduct.costPrice),
        sellingPrice: Number(newProduct.sellingPrice),
        stock: Number(newProduct.stock) || 0,
        totalCost,
        expectedRevenue,
        expectedProfit,
      };

      const { error } = await supabase.from("products").insert(product);
      
      if (!error) {
        setProducts([...products, product]);
        setNewProduct({});
        setNewCategory("");
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the product details below
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newProduct.name || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <Input
                    id="category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={newProduct.costPrice || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        costPrice: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sellingPrice">Selling Price</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={newProduct.sellingPrice || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        sellingPrice: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Initial Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              {newProduct.costPrice && newProduct.sellingPrice && newProduct.stock ? (
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-semibold">Purchase Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span>${(newProduct.costPrice * newProduct.stock).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Revenue:</span>
                      <span>${(newProduct.sellingPrice * newProduct.stock).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Expected Profit:</span>
                      <span className="text-green-600">
                        ${((newProduct.sellingPrice - newProduct.costPrice) * newProduct.stock).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{product.name}</CardTitle>
                <span className="text-sm text-muted-foreground">{product.code}</span>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {product.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {product.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Cost Price:</span>
                  <span>${product.costPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selling Price:</span>
                  <span>${product.sellingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span>{product.stock} units</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Investment:
                </span>
                <span className="font-semibold">
                  ${product.totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex w-full items-center justify-between">
                <span>Expected Revenue:</span>
                <span className="font-semibold text-green-600">
                  ${product.expectedRevenue.toFixed(2)}
                </span>
              </div>
              <div className="flex w-full items-center justify-between">
                <span>Expected Profit:</span>
                <span className="font-semibold text-green-600">
                  ${product.expectedProfit.toFixed(2)}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}