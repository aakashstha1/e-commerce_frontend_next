export function Footer() {
  return (
    <footer className="border-t bg-white mt-16">
      <div className="container mx-w-7xl mx-auto py-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        <p>Built with Next.js, powered by NestJS.</p>
      </div>
    </footer>
  );
}
