import { useState } from 'react';

const KEYWORDS = /\b(import|export|default|function|return|const|let|var|if|else|for|of|in|new|class|extends|useState|useEffect|useRef|useContext|useReducer|useMemo|useCallback|useLayoutEffect|from|null|true|false|typeof|try|catch|throw|async|await|switch|case|break)\b/g;

function highlight(line) {
  let safe = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const parts = [];
  let remaining = safe;
  let key = 0;

  // comments first — everything after // is opaque, so nothing inside it
  // (quotes, tags, keywords) gets tokenized separately and left unresolved
  remaining = remaining.replace(/(\/\/.*$)/g, (m) => {
    const token = `@@TOK${key}@@`;
    parts[key] = `<span class="tok-com">${m}</span>`;
    key++;
    return token;
  });

  // strings
  remaining = remaining.replace(/(&#39;|'|"|`)((?:(?!\1).)*)\1/g, (m) => {
    const token = `@@TOK${key}@@`;
    parts[key] = `<span class="tok-str">${m}</span>`;
    key++;
    return token;
  });

  // JSX tags
  remaining = remaining.replace(/(&lt;\/?[A-Za-z][\w.]*)/g, (m) => {
    const token = `@@TOK${key}@@`;
    parts[key] = `<span class="tok-tag">${m}</span>`;
    key++;
    return token;
  });

  // keywords
  remaining = remaining.replace(KEYWORDS, (m) => `<span class="tok-kw">${m}</span>`);

  // restore tokens (single pass — none of the stored parts contain tokens themselves)
  remaining = remaining.replace(/@@TOK(\d+)@@/g, (_, idx) => parts[Number(idx)]);

  return remaining;
}

export default function CodeBlock({ title = 'Example', lang = 'jsx', code }) {
  const [copied, setCopied] = useState(false);
  const lines = code.trim().split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="code-block">
      <div className="code-block__head">
        <span>{title} · {lang}</span>
        <button type="button" className="copy-btn" onClick={handleCopy}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>
          {lines.map((line, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: highlight(line) || ' ' }} />
          ))}
        </code>
      </pre>
    </div>
  );
}
