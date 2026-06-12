"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Mail, Phone, Calendar, ArrowRight } from "lucide-react";
import { Registration } from "@/lib/registrations";

interface RegistrationCardProps {
  registration: Registration;
  index: number;
  isSelected: boolean;
  onSelect: (reg: Registration) => void;
}

export function RegistrationCard({ registration, index, isSelected, onSelect }: RegistrationCardProps) {
  return (
    <Card
      onClick={() => onSelect(registration)}
      className={`border-border bg-card hover:border-accent/50 transition-all duration-300 group cursor-pointer animate-in fade-in slide-in-from-bottom-2 ${
        isSelected ? "border-accent ring-1 ring-accent/30 shadow-md translate-x-1" : ""
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 bg-secondary">
              <AvatarFallback className="bg-secondary text-foreground font-semibold uppercase">
                {registration.fullName ? registration.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "CR"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors capitalize">
                {registration.fullName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {registration.package?.name || "Layanan Custom"}
              </p>
            </div>
          </div>
          <Badge className={`border font-bold text-[10px] ${
            registration.status === "APPROVED" ? "bg-accent/20 text-accent border-accent/30"
              : registration.status === "REJECTED" ? "bg-destructive/20 text-destructive border-destructive/30"
              : "bg-accent/20 text-accent border-accent/30"
          }`}>
            {registration.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground truncate max-w-[180px]">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{registration.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground truncate max-w-[180px]">
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate">{registration.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5" />
              {registration.phone}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tarif</span>
              <span className="font-medium text-foreground">
                {registration.package?.price ? `Rp ${registration.package.price.toLocaleString("id-ID")}` : "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(registration.createdAt).toLocaleDateString("id-ID")}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-accent group-hover:translate-x-1 transition-transform p-0 bg-transparent">
            Periksa Berkas <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}