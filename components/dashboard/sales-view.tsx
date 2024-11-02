"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Receipt, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  unique_id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  stock: number;
}

interface Customer {
  id: string;
  name: string;
  due_amount: number;
  credit_limit: number;
}

interface SaleItem {
  product_id: string;
  product_name: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  total_price: number;
}

interface Sale {
  id: string;
  customer_id: string;
  customer_name: string;
  items: SaleItem[];
  total_amount: number;
  paid_amount: number;
  balance: number;
  created_at: string;
}

export function SalesView({ searchQuery }: { searchQuery: string }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      product_id: string;
      quantity: number;
      selling_price: number;
      cost_price: number;
    }>
  >([]);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchSales();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase.from("customers").select("*");
    if (data) setCustomers(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
  };

  const fetchSales = async () => {
    const { data } = await supabase
      .from("sales")
      .select(`
        *,
        customers (name),
        sale_items (
          product_id,
          quantity,
          cost_price,
          selling_price,
          total_price,
          products (name)
        )
      `)
      .order("created_at", { ascending: false });

    if (data) {
      const formattedSales = data.map((sale) => ({
        ...sale,
        customer_name: sale.customers.name,
        items: sale.sale_items.map((item) => ({
          ...item,
          product_name: item.products.name,
        })),
      }));
      setSales(formattedSales);
    }
  };

  const handleAddItem = () => {
    setSelectedItems([
      ...selectedItems,
      { product_id: "", quantity: 1, selling_price: 0, cost_price: 0 },
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...selectedItems];
    if (field === "product_id") {
      const product = products.find((p) => p.id === value);
      if (product) {
        newItems[index] = {
          ...newItems[index],
          product_id: value,
          selling_price: product.selling_price,
          cost_price: product.cost_price,
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setSelectedItems(newItems);
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (sum, item) => sum + item.selling_price * item.quantity,
      0
    );
  };

  const handleCreateSale = async () => {
    if (!selectedCustomer || selectedItems.length === 0) return;

    const total_amount = calculateTotal();
    const balance = total_amount - paidAmount;

    const { data: saleData, error: saleError } = await supabase
      .from("sales")
      .insert([
        {
          customer_id: selectedCustomer,
          total_amount,
          paid_amount: paidAmount,
          balance,
        },
      ])
      .select()
      .single();

    if (saleError || !saleData) return;

    const saleItems = selectedItems.map((item) => ({
      sale_id: saleData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      cost_price: item.cost_price,
      selling_price: item.selling_price,
      total_price: item.selling_price * item.quantity,
    }));

    await supabase.from("sale_items").insert(saleItems);

    // Update product stock
    for (const item of selectedItems) {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        await supabase
          .from("products")
          .update({ stock: product.stock - item.quantity })
          .eq("id", item.product_id);
      }
    }

    // Reset form and refresh data
    setSelectedCustomer("");
    setSelectedItems([]);
    setPaidAmount(0);
    fetchSales();
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.items.some((item) =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Sale</DialogTitle>
              <DialogDescription>
                Select customer and products for the sale
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Customer</Label>
                <Select
                  value={selectedCustomer}
                  onValueChange={setSelectedCustomer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} (Credit Limit: ${customer.credit_limit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Products</Label>
                {selectedItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Select
                        value={item.product_id}
                        onValueChange={(value) =>
                          updateItem(index, "product_id", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} (${product.selling_price})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", parseInt(e.target.value))
                        }
                        placeholder="Qty"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.selling_price}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "selling_price",
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="Price"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex h-10 items-center px-3 text-sm">
                        ${(item.quantity * item.selling_price).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="col-span-1"
                      onClick={() =>
                        setSelectedItems(
                          selectedItems.filter((_, i) => i !== index)
                        )
                      }
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddItem}>
                  Add Product
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-semibold">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label>Amount Paid</Label>
                  <Input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Balance:</span>
                  <span
                    className={
                      calculateTotal() - paidAmount > 0
                        ? "text-destructive"
                        : "text-green-600"
                    }
                  >
                    ${(calculateTotal() - paidAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={handleCreateSale}>Create Sale</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredSales.map((sale) => (
          <Card key={sale.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Receipt className="mr-2 h-4 w-4" />
                  Sale to {sale.customer_name}
                </div>
                {sale.balance > 0 && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </CardTitle>
              <CardDescription>
                {new Date(sale.created_at).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {sale.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>${item.total_price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 border-t pt-2">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-semibold">
                      ${sale.total_amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid:</span>
                    <span className="text-green-600">
                      ${sale.paid_amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance:</span>
                    <span className="text-destructive">
                      ${sale.balance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}