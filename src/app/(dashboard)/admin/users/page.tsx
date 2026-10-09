"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAllUsers, useToggleUserStatus } from "@/hooks/user.hook";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiClient";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Power,
  User,
  Truck,
} from "lucide-react";
import type { UserRole } from "@/types";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");

  const { data: usersRes, isLoading } = useGetAllUsers({
    searchTerm: searchTerm || undefined,
    role: roleFilter === "ALL" ? undefined : roleFilter,
  });

  const toggleMutation = useToggleUserStatus();
  const users = usersRes?.data || [];

  const handleToggle = (userId: string, currentActive: boolean) => {
    toggleMutation.mutate(
      {
        userId,
        isActive: !currentActive,
      },
      {
        onSuccess: (res) => {
          const statusText = res?.data?.isActive ? "Activated" : "Suspended";
          toast.success(`User status updated: ${statusText}`);
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to toggle user status."));
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
          // USER DIRECTORY & ACCESS CONTROL
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Platform Users
        </h1>
        <p className="text-xs text-muted-foreground">
          Audit customer and logistics partner profiles, toggle account accessibility.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name or email..."
            className="pl-9 text-xs"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:w-[180px]"
        >
          <option value="ALL" className="bg-background text-foreground">
            All Roles
          </option>
          <option value="CUSTOMER" className="bg-background text-foreground">
            Customers
          </option>
          <option value="PROVIDER" className="bg-background text-foreground">
            Providers
          </option>
          <option value="ADMIN" className="bg-background text-foreground">
            Administrators
          </option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-mono">USER</TableHead>
              <TableHead className="text-xs font-mono">ROLE</TableHead>
              <TableHead className="text-xs font-mono">PHONE</TableHead>
              <TableHead className="text-xs font-mono">STATUS</TableHead>
              <TableHead className="text-xs font-mono">JOINED</TableHead>
              <TableHead className="text-right text-xs font-mono w-[140px]">ACCESS TOGGLE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                  Loading user records...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No matching user accounts
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const isActive = u.isActive !== false;

                return (
                  <TableRow key={u.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {u.name?.slice(0, 2).toUpperCase() || "US"}
                        </div>
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          u.role === "ADMIN"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : u.role === "PROVIDER"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                        }`}
                      >
                        {u.role === "ADMIN" ? (
                          <ShieldCheck className="size-3" />
                        ) : u.role === "PROVIDER" ? (
                          <Truck className="size-3" />
                        ) : (
                          <User className="size-3" />
                        )}
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {u.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {isActive ? "Active" : "Suspended"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={isActive ? "outline" : "default"}
                        disabled={toggleMutation.isPending}
                        onClick={() => handleToggle(u.id, isActive)}
                        className={`h-7 text-[11px] gap-1 px-2.5 cursor-pointer ${
                          isActive
                            ? "text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        <Power className="size-3" />
                        <span>{isActive ? "Suspend" : "Activate"}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
