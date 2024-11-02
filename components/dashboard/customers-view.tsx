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
import { Plus, CreditCard, AlertTriangle } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dueAmount: number;
  creditLimit: number;
}

export function CustomersView({ searchQuery }: { searchQuery: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email) {
      setCustomers([
        ...customers,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone || "",
          address: newCustomer.address || "",
          dueAmount: 0,
          creditLimit: Number(newCustomer.creditLimit) || 1000, // Default credit limit
        },
      ]);
      setNewCustomer({});
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Enter the customer details below
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name || ""}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email || ""}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone || ""}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address || ""}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="creditLimit">Credit Limit</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  value={newCustomer.creditLimit || ""}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      creditLimit: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Default: 1000"
                />
              </div>
            </div>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {customer.name}
                {customer.dueAmount > customer.creditLimit && (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                )}
              </CardTitle>
              <CardDescription>{customer.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span>{customer.address}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credit Limit:
                </span>
                <span className="font-semibold">
                  ${customer.creditLimit.toFixed(2)}
                </span>
              </div>
              <div className="flex w-full items-center justify-between">
                <span>Due Amount:</span>
                <span
                  className={`font-semibold ${
                    customer.dueAmount > customer.creditLimit
                      ? "text-destructive"
                      : customer.dueAmount > 0
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  ${customer.dueAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex w-full items-center justify-between">
                <span>Available Credit:</span>
                <span className="font-semibold text-green-600">
                  ${Math.max(0, customer.creditLimit - customer.dueAmount).toFixed(2)}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}