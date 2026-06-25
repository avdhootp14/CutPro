"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

import { Suspense } from "react";

const VerifyEmailContent = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided in the URL.");
        return;
      }

      try {
        await axios.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setMessage("Your email has been successfully verified! You can now access all features.");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Invalid or expired verification link. Please request a new one.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-bgPrimary flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,229,255,0.06),transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="bg-bgSecondary/60 backdrop-blur-md border border-white/10 p-8 sm:p-12 rounded-2xl max-w-md w-full text-center relative z-10 shadow-2xl">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <Loader2 size={48} className="text-accent animate-spin" />
            <h2 className="font-serif text-[1.5rem] font-bold">Verifying...</h2>
            <p className="text-gray-400">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 animate-fade-up">
            <CheckCircle size={64} className="text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
            <h2 className="font-serif text-[1.8rem] font-bold text-white">Email Verified!</h2>
            <p className="text-gray-400 mb-4">{message}</p>
            <Link href="/dashboard" className="btn btn-accent w-full justify-center">
              Go to Dashboard
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 animate-fade-up">
            <XCircle size={64} className="text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
            <h2 className="font-serif text-[1.8rem] font-bold text-white">Verification Failed</h2>
            <p className="text-gray-400 mb-4">{message}</p>
            <Link href="/" className="btn btn-outline w-full justify-center">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bgPrimary flex items-center justify-center"><Loader2 size={48} className="text-accent animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
