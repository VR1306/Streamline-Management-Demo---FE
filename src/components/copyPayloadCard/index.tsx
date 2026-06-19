"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyPayloadProps {
  data: unknown;
  title?: string;
}

const CopyPayloadCard = ({
  data,
  title = "Raw Payload",
}: CopyPayloadProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(data, null, 2)
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy payload", error);
    }
  };

  if (!data) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
        <h2 className="font-semibold text-white">
          {title}
        </h2>

        <button
          type="button"
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-slate-800"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="overflow-auto p-6 text-sm text-slate-300">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default CopyPayloadCard;