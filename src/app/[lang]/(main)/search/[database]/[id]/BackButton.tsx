"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="mr-1 h-4 w-4" />
      Back to Results
    </button>
  );
}
