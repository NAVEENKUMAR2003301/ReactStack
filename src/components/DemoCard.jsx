import { useState } from 'react';
import CodeBlock from './CodeBlock';

export default function DemoCard({ label = 'Live demo', code, children }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="demo">
      <div className="demo__label">
        <span className="dot" aria-hidden="true" />
        <span className="demo__label-text">{label}</span>
        {code && (
          <button
            type="button"
            className="demo__code-toggle"
            aria-expanded={showCode}
            onClick={() => setShowCode((v) => !v)}
          >
            {showCode ? '▲ Hide code' : '</> View code'}
          </button>
        )}
      </div>
      <div className="demo__stage">{children}</div>
      {code && showCode && (
        <div className="demo__code">
          <CodeBlock title="Source for this demo" code={code} />
        </div>
      )}
    </div>
  );
}
