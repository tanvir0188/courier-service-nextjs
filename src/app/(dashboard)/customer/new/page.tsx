"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllZones } from "@/hooks/zone.hook";
import { useGetAllUsers } from "@/hooks/user.hook";
import { useCreateShipment } from "@/hooks/shipment.hook";
import { useCreateCheckoutSession } from "@/hooks/payment.hook";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiClient";
import { formatBDT } from "@/lib/utils";
import {
  PackagePlus,
  ArrowRight,
  CreditCard,
  Building,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import type { Shipment } from "@/types";

export default function CreateShipmentPage() {
  const router = useRouter();

  // Queries
  const { data: zonesRes, isLoading: isZonesLoading } = useGetAllZones();
  const { data: providersRes, isLoading: isProvidersLoading } = useGetAllUsers({
    role: "PROVIDER",
  });

  const zones = zonesRes?.data || [];
  const providers = providersRes?.data || [];

  // Form State
  const [providerId, setProviderId] = useState("");
  const [senderZoneId, setSenderZoneId] = useState("");
  const [receiverZoneId, setReceiverZoneId] = useState("");

  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderAddress, setSenderAddress] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");

  const [parcelDescription, setParcelDescription] = useState("");
  const [weight, setWeight] = useState(1);
  const [quantity, setQuantity] = useState(1);

  // Success State
  const [createdShipment, setCreatedShipment] = useState<Shipment | null>(null);

  // Mutations
  const createMutation = useCreateShipment();
  const checkoutMutation = useCreateCheckoutSession();

  // Live Pricing Calculation
  const estimatedFee = useMemo(() => {
    if (!senderZoneId || !receiverZoneId || weight <= 0) return 0;
    const isIntraZone = senderZoneId === receiverZoneId;
    const baseFee = isIntraZone ? 60 : 120;
    const extraWeight = Math.max(0, weight - 1);
    const weightRate = extraWeight * (isIntraZone ? 15 : 25);
    return baseFee + weightRate;
  }, [senderZoneId, receiverZoneId, weight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!providerId) {
      toast.error("Please select a logistics provider");
      return;
    }
    if (!senderZoneId || !receiverZoneId) {
      toast.error("Please specify both pickup and delivery zones");
      return;
    }

    createMutation.mutate(
      {
        providerId,
        senderZoneId,
        receiverZoneId,
        senderName,
        senderPhone,
        senderAddress,
        receiverName,
        receiverPhone,
        receiverAddress,
        parcelDescription,
        weight: Number(weight),
        quantity: Number(quantity),
      },
      {
        onSuccess: (res) => {
          toast.success("Shipment created successfully!");
          if (res?.data) {
            setCreatedShipment(res.data);
          }
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to create shipment."));
        },
      }
    );
  };

  const handlePayNow = () => {
    if (!createdShipment) return;

    checkoutMutation.mutate(
      {
        shipmentId: createdShipment.id,
        successUrl: `${window.location.origin}/payment/verify?sessionId={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/customer/shipments`,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.url) {
            window.location.href = res.data.url;
          } else {
            toast.error("No checkout URL returned from payment server");
          }
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to launch Stripe checkout."));
        },
      }
    );
  };

  if (createdShipment) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <Card className="p-8 border-border/50 bg-card/80 backdrop-blur-md shadow-2xl text-center space-y-6">
          <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="size-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Shipment Registered!</h1>
            <p className="text-xs text-muted-foreground">
              Tracking Number:{" "}
              <span className="font-mono font-bold text-foreground">
                {createdShipment.trackingNumber}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border/40 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Route:</span>
              <span className="font-medium text-foreground">
                {createdShipment.senderAddress} ➔ {createdShipment.receiverAddress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parcel Weight:</span>
              <span className="font-mono text-foreground">{createdShipment.weight} kg</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-border/30">
              <span>Estimated Delivery Fee:</span>
              <span className="font-mono text-primary text-sm">
                {formatBDT(Number(createdShipment.totalAmount || createdShipment.deliveryFee))}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              onClick={handlePayNow}
              disabled={checkoutMutation.isPending}
              className="flex-1 font-semibold gap-2 cursor-pointer bg-primary text-primary-foreground"
            >
              <CreditCard className="size-4" />
              <span>{checkoutMutation.isPending ? "Connecting to Stripe..." : "Pay with Stripe"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/tracking?number=${createdShipment.trackingNumber}`)}
              className="flex-1 cursor-pointer"
            >
              Track Live
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="text-xs font-mono font-semibold text-primary tracking-wider uppercase mb-1">
          // DISPATCH PROTOCOL
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Create New Shipment
        </h1>
        <p className="text-xs text-muted-foreground">
          Configure pickup, drop-off, and parcel logistics for drone dispatch.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logistics Provider Selection */}
        <Card className="p-5 border-border/50 bg-card space-y-4">
          <div className="flex items-center gap-2 border-b border-border/30 pb-3">
            <Building className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">1. Select Logistics Provider</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Registered Provider</Label>
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                required
              >
                <option value="" disabled className="bg-background text-foreground">
                  {isProvidersLoading ? "Loading providers..." : "Choose a logistics partner"}
                </option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id} className="bg-background text-foreground">
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Sender & Receiver Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pickup / Sender */}
          <Card className="p-5 border-border/50 bg-card space-y-3.5">
            <div className="flex items-center gap-2 border-b border-border/30 pb-2.5">
              <MapPin className="size-4 text-sky-400" />
              <h2 className="text-sm font-semibold">2. Sender (Pickup)</h2>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Pickup Zone</Label>
              <select
                value={senderZoneId}
                onChange={(e) => setSenderZoneId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                required
              >
                <option value="" disabled className="bg-background text-foreground">
                  {isZonesLoading ? "Loading zones..." : "Select Pickup Zone"}
                </option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id} className="bg-background text-foreground">
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Sender Full Name</Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Sender Phone</Label>
              <Input
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="+8801700000000"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Pickup Address</Label>
              <Input
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                placeholder="House 12, Road 4, Sector 7, Uttara"
                className="text-xs"
                required
              />
            </div>
          </Card>

          {/* Delivery / Receiver */}
          <Card className="p-5 border-border/50 bg-card space-y-3.5">
            <div className="flex items-center gap-2 border-b border-border/30 pb-2.5">
              <MapPin className="size-4 text-emerald-400" />
              <h2 className="text-sm font-semibold">3. Receiver (Destination)</h2>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Destination Zone</Label>
              <select
                value={receiverZoneId}
                onChange={(e) => setReceiverZoneId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                required
              >
                <option value="" disabled className="bg-background text-foreground">
                  {isZonesLoading ? "Loading zones..." : "Select Destination Zone"}
                </option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id} className="bg-background text-foreground">
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Receiver Full Name</Label>
              <Input
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="e.g. Farhana Akter"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Receiver Phone</Label>
              <Input
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="+8801800000000"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Receiver Address</Label>
              <Input
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Flat 4B, Plot 19, Dhanmondi 27"
                className="text-xs"
                required
              />
            </div>
          </Card>
        </div>

        {/* Parcel Details */}
        <Card className="p-5 border-border/50 bg-card space-y-4">
          <div className="flex items-center gap-2 border-b border-border/30 pb-2.5">
            <PackagePlus className="size-4 text-amber-400" />
            <h2 className="text-sm font-semibold">4. Parcel Specifications</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="text-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="text-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Estimated Fee</Label>
              <div className="h-9 rounded-md bg-muted/60 border border-border/40 px-3 flex items-center font-mono font-bold text-xs text-primary">
                {formatBDT(estimatedFee)}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Parcel Description / Item Notes</Label>
            <Textarea
              value={parcelDescription}
              onChange={(e) => setParcelDescription(e.target.value)}
              placeholder="e.g. Sensitive electronics, urgent medical supplies, documents"
              rows={2}
              className="text-xs"
            />
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md">
          <div>
            <div className="text-xs text-muted-foreground">Estimated Delivery Cost</div>
            <div className="text-lg font-mono font-extrabold text-foreground">
              {formatBDT(estimatedFee)}
            </div>
          </div>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="font-semibold gap-2 cursor-pointer"
          >
            {createMutation.isPending ? "Submitting..." : "Confirm & Dispatch"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
