"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Registration } from "@/lib/registrations";

interface SummaryCardsProps {
  data: Registration[];
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const total = data.length;
  const pending = data.filter((r) => r.status === "PENDING").length;
  const approved = data.filter((r) => r.status === "APPROVED").length;
  const rejected = data.filter((r) => r.status === "REJECTED").length;

  const stats = [
    { label: "Total Registrasi", value: total.toString(), icon: ClipboardList, color: "text-foreground" },
    { label: "Menunggu Validasi", value: pending.toString(), icon: Loader2, color: "text-accent" },
    { label: "Disetujui (Approved)", value: approved.toString(), icon: "text-accent", isApprovedIcon: true },
    { label: "Ditolak (Rejected)", value: rejected.toString(), icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="border-border bg-card hover:border-muted-foreground/30 transition-all duration-300 animate-in fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-semibold mt-1 ${stat.isApprovedIcon ? "text-accent" : stat.color}`}>
                  {stat.value}
                </p>
              </div>
              {stat.isApprovedIcon ? (
                <CheckCircle2 className="w-8 h-8 text-accent opacity-50" />
              ) : (
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-50 ${stat.label.includes("Menunggu") ? "animate-spin-slow" : ""}`} />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}