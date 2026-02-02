"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

interface SourceDocumentIconProps {
  sourceUrl: string | null | undefined;
  documentType: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function SourceDocumentIcon({
  sourceUrl,
  documentType,
  isOpen,
  onToggle,
}: SourceDocumentIconProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!sourceUrl) {
    return null;
  }

  return (
    <span className="relative inline-flex items-center ml-2">
      <button
        onClick={onToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-gray-400 hover:text-gray-600 inline-flex items-center"
        aria-label={`View Source ${documentType}`}
        aria-expanded={isOpen}
      >
        <FileText className="h-5 w-5" />
      </button>
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap z-50">
          View Source {documentType}
        </span>
      )}
    </span>
  );
}

interface SourceDocumentViewerProps {
  sourceUrl: string | null | undefined;
  documentType: string;
  isOpen: boolean;
}

export function SourceDocumentViewer({
  sourceUrl,
  documentType,
  isOpen,
}: SourceDocumentViewerProps) {
  if (!sourceUrl || !isOpen) {
    return null;
  }

  return (
    <div className="w-screen -ml-[50vw] left-1/2 relative mt-4">
      <iframe
        src={sourceUrl}
        className="w-full h-[80vh] border-y"
        title={documentType}
      />
    </div>
  );
}

interface FullReportLinkProps {
  sourceUrl: string | null | undefined;
}

export function FullReportLink({ sourceUrl }: FullReportLinkProps) {
  if (!sourceUrl) {
    return null;
  }

  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
    >
      <FileText className="h-5 w-5" />
      <span>Download Full Financial Report (PDF)</span>
    </a>
  );
}
