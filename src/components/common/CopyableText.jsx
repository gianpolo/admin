import { useState } from "react";
import { CopyIcon, CheckLineIcon } from "../../icons";

export default function CopyableText({ text, children, className = "" }) {
  const [copied, setCopied] = useState(false);

  const value = text ?? (typeof children === "string" ? children : "");

  function handleCopy() {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  }

  return (
    <div className={`relative group ${className}`}>
      {children ?? text}
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 ${copied ? "flex" : "hidden group-hover:flex"} p-1 rounded-md transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800`}
      >
        {copied ? (
          <CheckLineIcon className="w-4 h-4" />
        ) : (
          <CopyIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
