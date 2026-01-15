import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function SignalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  );
}
