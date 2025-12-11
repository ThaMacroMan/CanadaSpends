import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

// Custom MDX Components For Rich Article Formatting
export const MDXComponents = {
  // Headings With Custom Styling
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-[#272727] font-display">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-3xl font-bold mt-8 mb-4 text-[#272727] font-display">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-2xl font-semibold mt-6 mb-3 text-[#272727] font-display">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: ReactNode }) => (
    <h4 className="text-xl font-semibold mt-4 mb-2 text-[#272727] font-display">
      {children}
    </h4>
  ),

  // Paragraphs With Better Spacing
  p: ({ children }: { children: ReactNode }) => (
    <p className="text-base leading-7 text-[#272727] mb-4">{children}</p>
  ),

  // Links With Custom Styling
  a: ({ href, children }: { href?: string; children: ReactNode }) => {
    const isInternal = href?.startsWith("/");
    const Component = isInternal ? Link : "a";

    return (
      <Component
        href={href || "#"}
        className="text-[#38a0b4] hover:text-[#19464F] underline font-medium"
        {...(!isInternal && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
      >
        {children}
      </Component>
    );
  },

  // Lists With Custom Styling
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-[#272727]">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-[#272727]">
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="ml-4">{children}</li>
  ),

  // Blockquotes
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-[#932f2f] pl-4 py-2 my-4 italic text-[#272727] bg-[#A8A19B]/10">
      {children}
    </blockquote>
  ),

  // Code Blocks With Custom Styling
  code: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-[#A8A19B]/20 text-[#272727] px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return (
      <code
        className={`${className} block bg-[#272727] text-[#f6ebe3] p-4 rounded-lg overflow-x-auto my-4 font-mono`}
      >
        {children}
      </code>
    );
  },

  // Pre (For Code Blocks)
  pre: ({ children }: { children: ReactNode }) => (
    <pre className="bg-[#272727] text-[#f6ebe3] p-4 rounded-lg overflow-x-auto my-4 font-mono">
      {children}
    </pre>
  ),

  // Tables
  table: ({ children }: { children: ReactNode }) => (
    <div className="overflow-x-auto my-8 shadow-sm rounded-lg border border-[#A8A19B]">
      <table className="min-w-full divide-y divide-[#A8A19B]">{children}</table>
    </div>
  ),
  thead: ({ children }: { children: ReactNode }) => (
    <thead className="bg-[#A8A19B]/20">{children}</thead>
  ),
  tbody: ({ children }: { children: ReactNode }) => (
    <tbody className="bg-white divide-y divide-[#A8A19B]/30">{children}</tbody>
  ),
  tr: ({ children }: { children: ReactNode }) => (
    <tr className="hover:bg-[#f6ebe3]/50 transition-colors">{children}</tr>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="px-6 py-4 text-left text-sm font-bold text-[#272727] tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="px-6 py-4 text-base text-[#272727]">{children}</td>
  ),

  // Horizontal Rule
  hr: () => <hr className="my-8 border-[#A8A19B]" />,

  // Images With Next.js Image Component
  img: ({ src, alt, ...props }: { src?: string; alt?: string }) => (
    <span className="block my-6">
      <Image
        src={src || ""}
        alt={alt || ""}
        width={800}
        height={400}
        className="rounded-lg w-full h-auto"
        {...props}
      />
      {alt && (
        <span className="block text-center text-sm text-[#272727]/70 mt-2 italic">
          {alt}
        </span>
      )}
    </span>
  ),

  // Custom Callout Component
  Callout: ({
    type = "info",
    children,
  }: {
    type?: "info" | "warning" | "success" | "error";
    children: ReactNode;
  }) => {
    const styles = {
      info: "bg-[#38a0b4]/10 border-[#38a0b4] text-[#272727]",
      warning: "bg-[#932f2f]/10 border-[#932f2f] text-[#272727]",
      success: "bg-pine-100 border-pine-600 text-[#272727]",
      error: "bg-[#471717]/10 border-[#471717] text-[#272727]",
    };

    return (
      <div
        className={`border-l-4 px-4 pt-4 pb-1 my-6 rounded ${styles[type]}`}
        role="alert"
      >
        {children}
      </div>
    );
  },

  // Custom Image With Caption Component
  Figure: ({
    src,
    alt,
    caption,
  }: {
    src: string;
    alt: string;
    caption?: string;
  }) => (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={400}
        className="rounded-lg w-full h-auto"
      />
      {caption && (
        <figcaption className="text-center text-sm text-[#272727]/70 mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  ),
};
