"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle, Zap, BatteryLow } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";

// Import map component with no SSR
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-md">Loading map...</div>
  ),
});

// Define the outage report type
export type OutageReport = {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  severity: "critical" | "major" | "minor";
  description: string;
  timestamp: number;
  status: "reported" | "investigating" | "resolved";
};

interface OutageReporterProps {
  reports: OutageReport[];
  setReports: (reports: OutageReport[]) => void;
}

export default function OutageReporter({ reports, setReports }: OutageReporterProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true); // Add loading state
  const [address, setAddress] = useState("");
  const [severity, setSeverity] = useState<"critical" | "major" | "minor">("major");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const pathname = usePathname();

  // Function to fetch the user's location
  const fetchUserLocation = () => {
    setIsFetchingLocation(true);

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsFetchingLocation(false);
        },
        (error) => {
          setPosition({ lat: 40.7128, lng: -74.006 });
          setIsFetchingLocation(false);
          toast({
            title: "Geolocation Failed",
            description: "Unable to fetch your location. Using default location instead.",
            variant: "destructive",
          });
        },
        { timeout: 10000, maximumAge: 0 } // Add timeout and disable cache
      );
    } else {
      setPosition({ lat: 40.7128, lng: -74.006 });
      setIsFetchingLocation(false);
      toast({
        title: "Geolocation Not Supported",
        description: "Geolocation is not supported by your browser. Using default location instead.",
        variant: "destructive",
      });
    }
  };

  // Set initial position on mount
  useEffect(() => {
    fetchUserLocation();
  }, []);

  // Reset position when navigating to the home page
  useEffect(() => {
    if (pathname === "/") {
      fetchUserLocation();
    }
  }, [pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!position) {
      toast({
        title: "Location required",
        description: "Please select a location on the map",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Address required",
        description: "Please provide your address",
        variant: "destructive",
      });
      return;
    }

    // Create new report
    const newReport: OutageReport = {
      id: Date.now().toString(),
      location: position,
      address,
      severity,
      description,
      timestamp: Date.now(),
      status: "reported",
    };

    // Add to reports
    setReports([newReport, ...reports]);

    // Reset form
    setAddress("");
    setDescription("");
    setSeverity("major");

    // Reset map position to user's location after submission
    fetchUserLocation();

    toast({
      title: "Outage reported",
      description: "Your outage report has been submitted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report a Power Outage</CardTitle>
          <CardDescription>Click on the map to pinpoint your location, then fill out the form below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full rounded-md overflow-hidden mb-6 border relative">
            {isFetchingLocation ? (
              <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md">
                Fetching your location...
              </div>
            ) : (
              <MapComponent position={position} setPosition={setPosition} setAddress={setAddress} />
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Outage Severity</Label>
              <RadioGroup
                value={severity}
                onValueChange={(value) => setSeverity(value as "critical" | "major" | "minor")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="critical" />
                  <Label htmlFor="critical" className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Critical (No power, safety concern)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="major" id="major" />
                  <Label htmlFor="major" className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Major (Complete outage)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minor" id="minor" />
                  <Label htmlFor="minor" className="flex items-center gap-1">
                    <BatteryLow className="h-4 w-4 text-blue-500" />
                    Minor (Partial outage, flickering)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide any additional details about the outage"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Submit Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}