import type { ReactNode } from "react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Simple markdown-style content renderer
 * Handles basic markdown formatting like bold, lists, headings
 * Preserves line breaks and whitespace
 */
export function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  // Parse the markdown-style content and render it with proper styling
  const renderContent = (text: string): ReactNode[] => {
    const lines = text.split("\n");
    const elements: ReactNode[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle h3 headings (###)
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={key++}
            className="text-2xl font-bold text-neutral-100 mt-6 mb-3"
          >
            {line.replace("### ", "")}
          </h3>
        );
        continue;
      }

      // Handle h2 headings (##)
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={key++}
            className="text-3xl font-bold text-neutral-100 mt-8 mb-4"
          >
            {line.replace("## ", "")}
          </h2>
        );
        continue;
      }

      // Handle unordered list items (-)
      if (line.trim().startsWith("- ")) {
        elements.push(
          <li key={key++} className="ml-6 mb-2">
            {parseInlineFormatting(line.trim().replace(/^- /, ""))}
          </li>
        );
        continue;
      }

      // Handle numbered list items
      const numberedMatch = line.match(/^\d+\.\s+/);
      if (numberedMatch) {
        elements.push(
          <li key={key++} className="ml-6 mb-2">
            {parseInlineFormatting(line.replace(numberedMatch[0], ""))}
          </li>
        );
        continue;
      }

      // Handle empty lines
      if (line.trim() === "") {
        elements.push(<br key={key++} />);
        continue;
      }

      // Regular paragraph
      elements.push(
        <p key={key++} className="mb-4">
          {parseInlineFormatting(line)}
        </p>
      );
    }

    return elements;
  };

  // Parse inline formatting (bold, links)
  const parseInlineFormatting = (text: string): ReactNode[] => {
    const parts: ReactNode[] = [];
    let current = "";
    let i = 0;
    let key = 0;

    while (i < text.length) {
      // Handle bold text (**text**)
      if (text.substring(i, i + 2) === "**") {
        if (current) {
          parts.push(<span key={key++}>{current}</span>);
          current = "";
        }
        const endIndex = text.indexOf("**", i + 2);
        if (endIndex !== -1) {
          const boldText = text.substring(i + 2, endIndex);
          parts.push(
            <strong key={key++} className="font-semibold text-neutral-100">
              {boldText}
            </strong>
          );
          i = endIndex + 2;
          continue;
        }
      }

      // Handle links ([text](url))
      if (text[i] === "[") {
        if (current) {
          parts.push(<span key={key++}>{current}</span>);
          current = "";
        }
        const closeBracket = text.indexOf("]", i);
        const openParen = text.indexOf("(", closeBracket);
        const closeParen = text.indexOf(")", openParen);

        if (
          closeBracket !== -1 &&
          openParen === closeBracket + 1 &&
          closeParen !== -1
        ) {
          const linkText = text.substring(i + 1, closeBracket);
          const url = text.substring(openParen + 1, closeParen);
          const isExternal = url.startsWith("http");

          parts.push(
            <a
              key={key++}
              href={url}
              className="text-orange-400 hover:text-orange-300 underline"
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {linkText}
            </a>
          );
          i = closeParen + 1;
          continue;
        }
      }

      current += text[i];
      i++;
    }

    if (current) {
      parts.push(<span key={key++}>{current}</span>);
    }

    return parts;
  };

  return (
    <div className={`text-lg text-neutral-300 leading-relaxed ${className}`}>
      {renderContent(content)}
    </div>
  );
}
