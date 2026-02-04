"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function BuildCanadaBanner() {
  const pathname = usePathname();

  // Don't show banner on first-nations pages
  if (pathname?.includes("/first-nations")) {
    return null;
  }

  return (
    <div className="w-full bg-primary text-background py-3 px-4 sm:px-12">
      <div className="max-w-480 m-auto text-center">
        <p className="text-sm sm:text-base">
          <span className="font-semibold">New!</span> — We processed the
          financial statements for all First Nations in Canada —{" "}
          <Link
            href="/first-nations"
            className="font-semibold underline hover:no-underline"
          >
            Explore First Nations Data Now
          </Link>
        </p>
      </div>
    </div>
  );
}

/* Original banner - kept for reference
export function BuildCanadaBannerOriginal() {
  return (
    <div className="w-full bg-primary text-background py-3 px-4 sm:px-12">
      <div className="max-w-480 m-auto text-center">
        <p className="text-sm sm:text-base">
          Help bring transparency to Canadians —{" "}
          <a
            href="https://buildcanada.com/get-involved?utm_source=canadaspends&utm_medium=banner&utm_campaign=transparency"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:no-underline"
          >
            Join Build Canada
          </a>
        </p>
      </div>
    </div>
  );
}
*/
