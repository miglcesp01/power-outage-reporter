import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap, BatteryLow } from "lucide-react";
import type { OutageReport } from "@/components/outage-reporter";
import { Label } from "./ui/label";

interface OutageListProps {
  reports: OutageReport[];
}

export default function OutageList({ reports }: OutageListProps) {
  return (
    <div className="space-y-4">
      {reports.length > 0 ? (
        <div
          className="max-h-[893px] overflow-y-auto space-y-4 pr-2"
          style={{
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "rgba(0, 0, 0, 0.2) transparent", // For Firefox
          }}
        >
          {reports.map((report) => (
            <Card key={report.id} className="min-h-[140px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {report.severity === "critical" && (
                    <span className="flex items-center gap-2 text-red-500">
                      <AlertTriangle className="h-5 w-5" /> Critical Outage
                    </span>
                  )}
                  {report.severity === "major" && (
                    <span className="flex items-center gap-2 text-amber-500">
                      <Zap className="h-5 w-5" /> Major Outage
                    </span>
                  )}
                  {report.severity === "minor" && (
                    <span className="flex items-center gap-2 text-blue-500">
                      <BatteryLow className="h-5 w-5" /> Minor Outage
                    </span>
                  )}
                </CardTitle>
                <Badge>{report.status}</Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <Label htmlFor="address">Address</Label>
                <p className="text-sm text-muted-foreground truncate">{report.address}</p>
                <Label htmlFor="description">Description</Label>
                <p className="text-sm text-muted-foreground truncate">
                  {report.description || "No description provided"}
                </p>
                <Label htmlFor="date">Date</Label>
                <p className="text-sm text-muted-foreground truncate">
                  {new Date(report.timestamp).toLocaleString()}
                </p>
                <Link
                  href={`/report/${report.id}`}
                  className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                >
                  View Details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">No reports available.</div>
      )}
    </div>
  );
}