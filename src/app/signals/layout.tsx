export default function SignalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pt-16 md:pt-20">
      {children}
    </main>
  );
}
