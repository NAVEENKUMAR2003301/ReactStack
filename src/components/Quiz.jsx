import { useState } from 'react';

export default function Quiz({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="quiz">
      <div className="quiz__q">
        <span aria-hidden="true">🧠</span>
        <span>{question}</span>
      </div>
      <div className="quiz__options" role="radiogroup" aria-label={question}>
        {options.map((opt, i) => {
          let cls = 'quiz__option';
          if (selected !== null) {
            if (i === correctIndex) cls += ' correct';
            else if (i === selected) cls += ' incorrect';
          }
          return (
            <button
              key={opt}
              type="button"
              className={cls}
              role="radio"
              aria-checked={selected === i}
              onClick={() => setSelected(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="quiz__feedback" aria-live="polite">
          {selected === correctIndex ? '✅ Correct — ' : '❌ Not quite — '}
          {explanation}
        </p>
      )}
    </div>
  );
}
