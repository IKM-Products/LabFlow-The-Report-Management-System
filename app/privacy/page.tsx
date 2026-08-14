import React from "react";
import Link from "next/link";
import { ArrowLeft, FlaskConical, ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Last updated: August 14, 2026
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8 text-sm leading-relaxed text-slate-600">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              1. Information We Collect
            </h2>
            <p>
              We collect user account details (such as your registered email address and institutional affiliations) and diagnostic report data processed through the LabFlow platform to facilitate laboratory workflows.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              2. How We Use Information
            </h2>
            <p>
              The collected information is strictly used for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generating and organizing lab diagnostic reports.</li>
              <li>Authenticating users and providing secure account management.</li>
              <li>Delivering automated password reset OTP tokens and security updates.</li>
              <li>Improving platform speed and throughput performance.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              3. Data Encryption & Security
            </h2>
            <p>
              LabFlow implements industry-standard encryption protocols for data in transit and at rest. Patient information and login security verification tokens are processed with stringent access controls.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              4. Data Sharing & Third Parties
            </h2>
            <p>
              We do not sell or rent personal or medical diagnostic data to third parties. Data is shared only with authorized service integrations necessary for platform functionality (e.g., transactional email/OTP services).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              5. Your Rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of your user credentials and organization records by contacting your lab administrator or reaching out to LabFlow support.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              6. Contact Us
            </h2>
            <p>
              If you have any privacy-related queries or security concerns, please email us at{" "}
              <a href="mailto:privacy@labflow.com" className="text-emerald-600 underline font-medium">
                privacy@labflow.com
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