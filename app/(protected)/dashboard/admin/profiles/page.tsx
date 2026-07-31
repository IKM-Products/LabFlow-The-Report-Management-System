"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, ShieldAlert, Mail, Phone, User2 } from "lucide-react";
import { profileService } from "@/services/profile.service";
import { Profile } from "@/types/profile.types";

import UserForm from "./_components/UserForm";
import EditProfile from "./_components/EditProfile";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileRecords = async () => {
    setIsLoading(true);
    try {
      const data = await profileService.getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error("Critical error fetching profile records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileRecords();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            User Accounts Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage user accounts, contact details, and permission roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProfileRecords}
            disabled={isLoading}
            className="rounded-xl h-10 border-slate-200 text-slate-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <UserForm onSuccess={fetchProfileRecords} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border border-slate-200 rounded-2xl">
          Loading profile data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              List of all registered profiles.
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-20 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">User Identity</TableHead>
                <TableHead className="font-bold text-slate-600">Contact Specifics</TableHead>
                <TableHead className="font-bold text-slate-600">Permission Role</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">No profile allocations configured.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile, idx) => (
                  <TableRow key={profile.id} className="hover:bg-slate-50/60 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-400">{idx + 1}</TableCell>

                    <TableCell className="space-y-0.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <User2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {profile.first_name} {profile.last_name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 space-y-1 py-3">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{profile.phone || "—"}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {profile.role_name}
                      </span>
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      <EditProfile profile={profile} onSuccess={fetchProfileRecords} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}