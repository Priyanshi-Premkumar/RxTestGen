import { TestTube2 } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <TestTube2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">RxTestGen</span>
        </Link>
      </div>
    </header>
  );
}
