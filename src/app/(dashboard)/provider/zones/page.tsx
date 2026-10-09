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
import { Label } from "@/components/ui/label";
import {
  useGetAllZones,
  useCreateZone,
  useUpdateZone,
  useDeleteZone,
} from "@/hooks/zone.hook";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiClient";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Search,
  Building2,
} from "lucide-react";
import type { Zone } from "@/types";

export default function ProviderZonesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: zonesRes, isLoading } = useGetAllZones({
    searchTerm: searchTerm || undefined,
  });

  const zones = zonesRes?.data || [];

  // Modal Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  // Form Field
  const [zoneName, setZoneName] = useState("");

  // Mutations
  const createMutation = useCreateZone();
  const updateMutation = useUpdateZone();
  const deleteMutation = useDeleteZone();

  const handleOpenCreate = () => {
    setZoneName("");
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (z: Zone) => {
    setEditingZone(z);
    setZoneName(z.name);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim() || zoneName.trim().length < 2) {
      toast.error("Zone name must be at least 2 characters");
      return;
    }

    createMutation.mutate(
      { name: zoneName.trim() },
      {
        onSuccess: () => {
          toast.success("Zone registered successfully!");
          setIsCreateOpen(false);
          setZoneName("");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to create zone."));
        },
      }
    );
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;
    if (!zoneName.trim() || zoneName.trim().length < 2) {
      toast.error("Zone name must be at least 2 characters");
      return;
    }

    updateMutation.mutate(
      {
        id: editingZone.id,
        payload: { name: zoneName.trim() },
      },
      {
        onSuccess: () => {
          toast.success("Zone updated successfully!");
          setEditingZone(null);
          setZoneName("");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to update zone."));
        },
      }
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete zone "${name}"? Couriers in this zone may be affected.`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Zone removed successfully!");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to delete zone."));
        },
      });
    }
  };

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
            // OPERATIONAL BOUNDARIES
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Delivery Zones Management
          </h1>
          <p className="text-xs text-muted-foreground">
            Configure geographic dispatch zones for routing, intra-zone fees, and courier assignments.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="font-semibold gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="size-4" />
          <span>Create New Zone</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search zones by name (e.g. Dhanmondi, Uttara)..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Zones Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-mono">ZONE NAME</TableHead>
              <TableHead className="text-xs font-mono">ZONE ID</TableHead>
              <TableHead className="text-xs font-mono">CREATED AT</TableHead>
              <TableHead className="text-right text-xs font-mono w-[120px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground text-sm">
                  Loading operational zones...
                </TableCell>
              </TableRow>
            ) : filteredZones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <MapPin className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No operational zones configured
                    </p>
                    <Button size="sm" variant="outline" onClick={handleOpenCreate}>
                      Add your first zone
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredZones.map((z) => (
                <TableRow key={z.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        <MapPin className="size-3.5" />
                      </div>
                      <span>{z.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {z.id}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {z.createdAt ? new Date(z.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(z)}
                        title="Edit zone"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(z.id, z.name)}
                        title="Delete zone"
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Zone Modal Dialog */}
      {(isCreateOpen || editingZone) && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-border/50 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <h3 className="text-base font-bold text-foreground">
                {editingZone ? "Edit Delivery Zone" : "Create Delivery Zone"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingZone(null);
                }}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={editingZone ? handleUpdate : handleCreate}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Zone Name</Label>
                <Input
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="e.g. Dhanmondi, Gulshan, Chittagong South"
                  className="text-xs"
                  required
                  autoFocus
                />
                <p className="text-[11px] text-muted-foreground">
                  Must be between 2 and 100 characters. Used for rate calculation.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/30">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingZone(null);
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="gap-1.5 cursor-pointer font-semibold"
                >
                  <Check className="size-3.5" />
                  <span>
                    {editingZone
                      ? updateMutation.isPending
                        ? "Saving..."
                        : "Save Changes"
                      : createMutation.isPending
                      ? "Creating..."
                      : "Create Zone"}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
