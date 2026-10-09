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
  useGetAllCouriers,
  useCreateCourier,
  useUpdateCourier,
  useDeleteCourier,
} from "@/hooks/courier.hook";
import { useGetAllZones, useCreateZone } from "@/hooks/zone.hook";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiClient";
import {
  Bike,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Phone,
  MapPin,
  Activity,
  Loader2,
} from "lucide-react";
import type { Courier, CourierStatus } from "@/types";

export default function ProviderCouriersPage() {
  const { data: couriersRes, isLoading } = useGetAllCouriers();
  const { data: zonesRes } = useGetAllZones();

  const couriers = couriersRes?.data || [];
  const zones = zonesRes?.data || [];

  // Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [status, setStatus] = useState<CourierStatus>("AVAILABLE");

  // Inline Zone Creation State
  const [isAddingZoneInline, setIsAddingZoneInline] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");

  // Mutations
  const createMutation = useCreateCourier();
  const updateMutation = useUpdateCourier();
  const deleteMutation = useDeleteCourier();
  const createZoneMutation = useCreateZone();

  const handleCloseModal = () => {
    setIsCreateOpen(false);
    setEditingCourier(null);
    setIsAddingZoneInline(false);
    setNewZoneName("");
  };

  const handleOpenCreate = () => {
    setName("");
    setPhone("");
    setZoneId(zones[0]?.id || "");
    setStatus("AVAILABLE");
    setIsAddingZoneInline(false);
    setNewZoneName("");
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (c: Courier) => {
    setEditingCourier(c);
    setName(c.name);
    setPhone(c.phone);
    setZoneId(c.zoneId);
    setStatus(c.status);
    setIsAddingZoneInline(false);
    setNewZoneName("");
  };

  const handleCreateZoneInline = () => {
    if (!newZoneName.trim() || newZoneName.trim().length < 2) {
      toast.error("Zone name must be at least 2 characters.");
      return;
    }

    createZoneMutation.mutate(
      { name: newZoneName.trim() },
      {
        onSuccess: (res) => {
          toast.success(`Zone "${res.data.name}" created successfully!`);
          setZoneId(res.data.id);
          setNewZoneName("");
          setIsAddingZoneInline(false);
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to create zone."));
        },
      }
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        name,
        phone,
        zoneId,
        status,
      },
      {
        onSuccess: () => {
          toast.success("Courier registered successfully!");
          setIsCreateOpen(false);
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to create courier."));
        },
      }
    );
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourier) return;

    updateMutation.mutate(
      {
        id: editingCourier.id,
        payload: {
          name,
          phone,
          zoneId,
          status,
        },
      },
      {
        onSuccess: () => {
          toast.success("Courier updated successfully!");
          setEditingCourier(null);
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to update courier."));
        },
      }
    );
  };

  const handleDelete = (id: string, courierName: string) => {
    if (confirm(`Are you sure you want to remove courier ${courierName}?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Courier removed successfully!");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to remove courier."));
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
            // FLEET LOGISTICS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Courier Management
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your on-ground and drone rider personnel across zones.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="font-semibold gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="size-4" />
          <span>Add Courier</span>
        </Button>
      </div>

      {/* Couriers Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-mono">COURIER NAME</TableHead>
              <TableHead className="text-xs font-mono">PHONE</TableHead>
              <TableHead className="text-xs font-mono">ZONE</TableHead>
              <TableHead className="text-xs font-mono">STATUS</TableHead>
              <TableHead className="text-right text-xs font-mono w-[120px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                  Loading courier roster...
                </TableCell>
              </TableRow>
            ) : couriers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Bike className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No couriers registered yet
                    </p>
                    <Button size="sm" variant="outline" onClick={handleOpenCreate}>
                      Add your first courier
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              couriers.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {c.phone}
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3 text-muted-foreground" />
                      <span>{c.zone?.name || "Unassigned"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                        c.status === "AVAILABLE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : c.status === "BUSY"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {c.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        title="Edit courier"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, c.name)}
                        title="Delete courier"
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

      {/* Create / Edit Modal Dialog */}
      {(isCreateOpen || editingCourier) && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <h3 className="text-base font-bold text-foreground">
                {editingCourier ? "Edit Courier" : "Register New Courier"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={editingCourier ? handleUpdate : handleCreate}
              className="space-y-3.5"
            >
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rakib Hasan"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Phone Number</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801700000000"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Operational Zone</Label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingZoneInline((prev) => !prev);
                      setNewZoneName("");
                    }}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Plus className="size-3" />
                    {isAddingZoneInline ? "Cancel" : "Add New Zone"}
                  </button>
                </div>

                {isAddingZoneInline && (
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-primary/20 bg-primary/5">
                    <Input
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      placeholder="New zone name (e.g. Uttara)"
                      className="h-8 text-xs bg-background"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateZoneInline();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={createZoneMutation.isPending || !newZoneName.trim()}
                      onClick={handleCreateZoneInline}
                      className="h-8 px-3 text-xs shrink-0 cursor-pointer"
                    >
                      {createZoneMutation.isPending ? (
                        <>
                          <Loader2 className="size-3 animate-spin mr-1" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                )}

                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                >
                  <option value="" disabled className="bg-background text-foreground">
                    Select zone
                  </option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id} className="bg-background text-foreground">
                      {z.name}
                    </option>
                  ))}
                </select>
                {zones.length === 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    No zones registered yet. Click &quot;Add New Zone&quot; above to create one.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CourierStatus)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="AVAILABLE" className="bg-background text-foreground">
                    AVAILABLE
                  </option>
                  <option value="BUSY" className="bg-background text-foreground">
                    BUSY
                  </option>
                  <option value="OFFLINE" className="bg-background text-foreground">
                    OFFLINE
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/30">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
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
                    {editingCourier
                      ? updateMutation.isPending
                        ? "Saving..."
                        : "Save Changes"
                      : createMutation.isPending
                      ? "Registering..."
                      : "Create Courier"}
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
