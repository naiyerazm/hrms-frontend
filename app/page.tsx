// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect immediately
  redirect("/login");

  return null; // Page content won't render
}