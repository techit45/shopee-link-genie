import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { TopNav } from './TopNav';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col pl-[260px] transition-all duration-300">
        <TopNav />
        <main className="flex-1 p-6">{children}</main>
        <footer className="border-t bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 ShopeeAff Pro. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Version 1.0.0</span>
              <a href="#" className="hover:text-foreground">Documentation</a>
              <a href="#" className="hover:text-foreground">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
