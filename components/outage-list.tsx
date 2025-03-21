"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, BatteryLow, Clock, MapPin, Eye } from "lucide-react";
import type { OutageReport } from "./outage-reporter";

interface OutageListProps {
  reports: OutageReport[];
}

export default function OutageList({ reports }: OutageListProps) {
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No outages reported yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <OutageCard key={report.id} report={report} />
      ))}
    </div>
  );
}

function OutageCard({ report }: { report: OutageReport }) {
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1">
            {getSeverityIcon(report.severity)}
            <CardTitle className="text-base capitalize">{report.severity} Outage</CardTitle>
          </div>
          {getStatusBadge(report.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-sm">{report.address}</p>
          </div>

          {report.description && <p className="text-sm text-muted-foreground">{report.description}</p>}

          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{formatDate(report.timestamp)}</p>
          </div>

          <div className="pt-2">
            <Link href={`/report/${report.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}