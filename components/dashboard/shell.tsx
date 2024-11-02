"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "@/components/dashboard/search";
import { ProductsView } from "@/components/dashboard/products-view";
import { CustomersView } from "@/components/dashboard/customers-view";
import { SalesView } from "@/components/dashboard/sales-view";
import { CategoriesView } from "@/components/dashboard/categories-view";
import { Package2, Users, Receipt, LayoutDashboard, Tags } from "lucide-react";

export default function DashboardShell() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="ml-2 text-xl font-semibold">Business Manager</h1>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Search setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 pt-6">
        <Tabs defaultValue="products" className="h-full space-y-6">
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="products">
                <Package2 className="mr-2 h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="categories">
                <Tags className="mr-2 h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="customers">
                <Users className="mr-2 h-4 w-4" />
                Customers
              </TabsTrigger>
              <TabsTrigger value="sales">
                <Receipt className="mr-2 h-4 w-4" />
                Sales
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="products" className="border-none p-0">
            <ProductsView searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="categories" className="border-none p-0">
            <CategoriesView searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="customers" className="border-none p-0">
            <CustomersView searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="sales" className="border-none p-0">
            <SalesView searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}