import React from "react";
import Link from "next/link";
import { ArrowLeft, FlaskConical, FileText, ShieldCheck } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              LabFlow
            </span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-12 w-full flex-1 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-700 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Terms of Service
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Last updated: August 14, 2026
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-slate-600">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the LabFlow reporting platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              2. Lab Data & Medical Disclaimer
            </h2>
            <p>
              LabFlow provides diagnostic management software designed to assist healthcare facilities and lab administrators. Reports generated through LabFlow are subject to verification by qualified medical professionals. LabFlow is not a substitute for clinical judgment or professional diagnostic evaluation.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              3. User Accounts & Security
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account login credentials and for all activities conducted under your account. You must notify us immediately of any unauthorized access or security breach.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              4. Authorized Usage
            </h2>
            <p>
              Users must confirm that they hold proper authorization to handle patient diagnostic data, request password resets, or perform reporting operations on behalf of their affiliated healthcare organization.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              5. Limitation of Liability
            </h2>
            <p>
              LabFlow Inc. shall not be liable for direct, indirect, incidental, or consequential damages resulting from platform downtime, technical delays, or misuse of report information beyond our reasonable control.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              6. Contact Information
            </h2>
            <p>
              For questions regarding these Terms of Service, please contact our support team at{" "}
              <a href="mailto:support@labflow.com" className="text-emerald-600 underline font-medium">
                support@labflow.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-6 text-center text-xs font-medium text-slate-400">
          © 2026 LabFlow Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}