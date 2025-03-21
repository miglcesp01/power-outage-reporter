"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, BatteryLow, Clock, MapPin, ArrowLeft } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import dynamic from "next/dynamic";
import type { OutageReport } from "@/components/outage-reporter";

// Dynamically import the map component with no SSR
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-md">Loading map...</div>
  ),
});

export default function ReportDetails() {
  const { id } = useParams();
  const [reports] = useLocalStorage<OutageReport[]>("outage-reports", []);
  const [report, setReport] = useState<OutageReport | null>(null);

  useEffect(() => {
    const foundReport = reports.find((r) => r.id === id);
    if (foundReport) {
      setReport(foundReport);
    }
  }, [id, reports]);

  if (!report) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Report not found.</p>
            <div className="mt-4 flex justify-center">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "major":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "minor":
        return <BatteryLow className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Reported
          </Badge>
        );
      case "investigating":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Investigating
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1">
              {getSeverityIcon(report.severity)}
              <CardTitle className="text-2xl capitalize">{report.severity} Outage</CardTitle>
            </div>
            {getStatusBadge(report.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-base">{report.address}</p>
            </div>

            {report.description && (
              <div>
                <p className="text-sm font-medium">Description:</p>
                <p className="text-base text-muted-foreground">{report.description}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{formatDate(report.timestamp)}</p>
            </div>
          </div>

          <div className="h-[400px] w-full rounded-md overflow-hidden border relative">
            <MapComponent
              position={report.location}
              setPosition={() => {}} // No-op since we don't allow changing position
              setAddress={() => {}} // No-op since we don't need to update address
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}