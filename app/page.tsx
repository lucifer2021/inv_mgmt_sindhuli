import { Metadata } from "next";
import DashboardShell from "@/components/dashboard/shell";

export const metadata: Metadata = {
  title: "Business Management System",
  description: "Manage your business efficiently",
};

export default function Home() {
  return <DashboardShell />;
}