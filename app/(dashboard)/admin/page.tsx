"use client";

import {
  Users,
  Building2,
  FlaskConical,
  FileText,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Users",
    value: "0",
    icon: Users,
  },
  {
    title: "Departments",
    value: "0",
    icon: Building2,
  },
  {
    title: "Lab Tests",
    value: "0",
    icon: FlaskConical,
  },
  {
    title: "Reports",
    value: "0",
    icon: FileText,
  },
];

export default function AdminPage() {
  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>

        <p className="text-muted-foreground mt-2">
          Welcome to LabFlow Administration Panel.
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

                <p className="text-xs text-muted-foreground mt-1">
                  Total {item.title.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Use the sidebar to manage users, departments, laboratories,
            doctors, test catalogs, profiles, and reports.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}