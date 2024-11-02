import { createClient } from '@supabase/supabase-js';
import { generateProductId, generateCustomerId } from '@/lib/utils/generators';

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  totalCost: number;
  expectedRevenue: number;
  expectedProfit: number;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dueAmount: number;
  creditLimit: number;
  totalPaid: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  paidAmount: number;
  balance: number;
  date: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  totalPrice: number;
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);