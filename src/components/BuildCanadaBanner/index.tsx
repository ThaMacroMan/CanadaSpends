"use client";

import React from "react";

export default function BuildCanadaBanner() {
  return (
    <div className="w-full bg-auburn-burgundy text-white py-3 px-4 sm:px-12">
      <div className="max-w-[120rem] m-auto text-center">
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
