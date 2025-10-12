import Header from "@/components/Header";
import ContactPidgeon from "@/components/ContactPidgeon";
import "./globals.css";
import HeroSection from "@/components/sections/HeroSection";

export const metadata = {
  title: "Urbanex",
  description: "Building the tangible with intangible matter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/adh0yse.css" />
      </head>
      <body className="antialiased bg-[#000000]" style={{ margin: 0, padding: 0, width: '100%', overflowX: 'hidden' }}>
        <Header />
        <ContactPidgeon />
        {children}
      </body>
    </html>
  );
}