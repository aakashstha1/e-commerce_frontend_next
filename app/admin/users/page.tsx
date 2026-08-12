"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-auth";
import { UserRole, User } from "@/types/user.type";
import { getApiErrorMessage } from "@/api/client";
import { usersApi } from "@/api/users";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.list(),
  });

  const [roleTarget, setRoleTarget] = useState<User | undefined>();
  const [isTogglingRole, setIsTogglingRole] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<User | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmRoleToggle() {
    if (!roleTarget) return;
    const newRole =
      roleTarget.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    setIsTogglingRole(true);
    try {
      await usersApi.update(roleTarget._id, { role: newRole });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`Role updated to ${newRole}`);
      setRoleTarget(undefined);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsTogglingRole(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await usersApi.remove(deleteTarget._id);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
      setDeleteTarget(undefined);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Users</h1>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === UserRole.ADMIN ? "default" : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={user._id === currentUser?._id}
                    onClick={() => setRoleTarget(user)}
                  >
                    {user.role === UserRole.ADMIN
                      ? "Revoke Admin"
                      : "Make Admin"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={user._id === currentUser?._id}
                    onClick={() => setDeleteTarget(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog
        open={!!roleTarget}
        onOpenChange={(open) => !open && setRoleTarget(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {roleTarget?.role === UserRole.ADMIN
                ? "Revoke admin access?"
                : "Grant admin access?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {roleTarget?.role === UserRole.ADMIN ? (
                <>
                  <span className="font-medium text-foreground">
                    {roleTarget?.name}
                  </span>{" "}
                  will lose admin privileges and be downgraded to a regular
                  user.
                </>
              ) : (
                <>
                  <span className="font-medium text-foreground">
                    {roleTarget?.name}
                  </span>{" "}
                  will gain full admin access, including managing products,
                  categories, and other users.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTogglingRole}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRoleToggle}
              disabled={isTogglingRole}
            >
              {isTogglingRole
                ? "Updating..."
                : roleTarget?.role === UserRole.ADMIN
                  ? "Revoke Admin"
                  : "Make Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>{" "}
              ({deleteTarget?.email}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
