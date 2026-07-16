"use client";

import {
  Users,
  CalendarDays,
  ClipboardList,
  FileCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "Patients",
    value: "0",
    icon: Users,
  },
  {
    title: "Visits",
    value: "0",
    icon: CalendarDays,
  },
  {
    title: "Orders",
    value: "0",
    icon: ClipboardList,
  },
  {
    title: "Results",
    value: "0",
    icon: FileCheck,
  },
];

export default function TechnicianPage() {
  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Technician Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome to the LabFlow Technician Panel.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>

                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Total {item.title.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Work</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Manage patient registrations, laboratory visits, test orders,
            laboratory results, and reports using the sidebar.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}