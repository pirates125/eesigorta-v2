"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auth gerektirmeyen sayfalar
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (isPublicPath) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const profile = await apiClient.getProfile();
        setUser(profile);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, isPublicPath, pathname]);

  const handleLogout = () => {
    apiClient.logout();
    router.push("/login");
  };

  // Public sayfalar için sadece children'ı göster
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  // Dashboard layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-600">EES Sigorta</h1>
          {user && (
            <p className="text-sm text-gray-600 mt-1">{user.full_name}</p>
          )}
        </div>

        <nav className="space-y-2">
          <NavLink href="/" currentPath={pathname}>
            Dashboard
          </NavLink>
          <NavLink href="/trafik" currentPath={pathname}>
            Trafik Sigortası
          </NavLink>
          <NavLink href="/kasko" currentPath={pathname}>
            Kasko
          </NavLink>
          <NavLink href="/teklifler" currentPath={pathname}>
            Tekliflerim
          </NavLink>
          <NavLink href="/policeler" currentPath={pathname}>
            Poliçelerim
          </NavLink>
          <NavLink href="/ayarlar" currentPath={pathname}>
            Ayarlar
          </NavLink>
          {user?.role === "admin" && (
            <>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Admin
                </p>
              </div>
              <NavLink href="/admin" currentPath={pathname}>
                İstatistikler
              </NavLink>
              <NavLink href="/admin/users" currentPath={pathname}>
                Kullanıcılar
              </NavLink>
            </>
          )}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  children,
  currentPath,
}: {
  href: string;
  children: React.ReactNode;
  currentPath: string;
}) {
  const isActive = currentPath === href;
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  );
}
