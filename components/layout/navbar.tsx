"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  Search,
  LogOut,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types/user.type";
import { NotificationsSheet } from "./notifications-sheet";

export function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: user } = useCurrentUser();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const logout = useLogout();

  const cartCount = cart?.items?.length ?? 0;
  const wishlistCount = wishlist?.items?.length ?? 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      search ? `/products?search=${encodeURIComponent(search)}` : "/products",
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="container flex h-16 items-center mx-w-7xl mx-auto gap-4">
        <Link href="/" className="text-xl font-bold shrink-0">
          E-Shop
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden flex-1 max-w-md md:flex"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-9"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/products">Products</Link>
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {accessToken && <NotificationsSheet />}

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center p-0 text-[10px]">
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center p-0 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          {accessToken && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-bold text-sm">{user.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="flex items-center cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/orders"
                    className="flex items-center cursor-pointer"
                  >
                    <Package className="mr-2 h-4 w-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                {user.role === UserRole.ADMIN && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className="flex items-center cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout.mutate()}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
