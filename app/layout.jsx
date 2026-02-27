import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "HFMS",
  icons: {
    icon: "/favicon.png",         // favicon
    apple: "/apple-touch-icon.png" // optional, for iOS
  }
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />

        <div className="flex-1 ml-48">
          <Header />
          <main className="p-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
