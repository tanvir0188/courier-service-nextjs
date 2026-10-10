"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, ShieldCheck, Zap, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [trackingId, setTrackingId] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/tracking?number=${encodeURIComponent(trackingId.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-24 max-w-5xl mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-8">
        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
        LIVE OPERATIONAL DISPATCH · DHAKA TO ALL DISTRICTS
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-tight">
        Next-Generation <span className="text-primary">Courier Logistics</span> for Bangladesh
      </h1>
      <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl">
        Book shipments, assign on-duty courier fleets, automate bKash, Stripe & SSLCommerz settlements, and track parcels in real time.
      </p>

      {/* Parcel Tracking Search Form */}
      <form
        onSubmit={handleTrack}
        className="mt-8 flex w-full max-w-md items-center gap-2 rounded-xl border border-border/60 bg-card/80 p-1.5 shadow-lg backdrop-blur-md"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID (e.g. TRK-MV1XOQPW-OYDEI)"
            className="border-0 bg-transparent pl-9 text-sm focus-visible:ring-0 shadow-none font-mono"
          />
        </div>
        <Button type="submit" size="sm" className="font-semibold">
          Track Parcel
        </Button>
      </form>

      {/* Quick Portals Switcher */}
      <div className="mt-16 w-full text-left">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center">
          Explore System Portals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/customer" className="group">
            <Card className="p-5 border-border/40 bg-card/50 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-primary font-semibold">CUSTOMER PORTAL</span>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
              </div>
              <h3 className="font-bold text-base text-foreground">Sender & Booking</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Calculate live delivery prices, book door-to-door pickups, and manage personal deliveries.
              </p>
            </Card>
          </Link>

          <Link href="/provider" className="group">
            <Card className="p-5 border-border/40 bg-card/50 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-primary font-semibold">PROVIDER PORTAL</span>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
              </div>
              <h3 className="font-bold text-base text-foreground">Fleet & Dispatch Control</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Dispatch incoming parcels, assign riders and couriers, and track zone workloads.
              </p>
            </Card>
          </Link>

          <Link href="/admin" className="group">
            <Card className="p-5 border-border/40 bg-card/50 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-primary font-semibold">ADMIN CONSOLE</span>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
              </div>
              <h3 className="font-bold text-base text-foreground">Platform Governance</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Moderate accounts, inspect system-wide payment transactions, and monitor KPIs.
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
