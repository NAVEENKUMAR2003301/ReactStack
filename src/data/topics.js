export const LEVELS = {
  beginner: { label: 'Beginner', badge: 'badge--beginner' },
  intermediate: { label: 'Intermediate', badge: 'badge--intermediate' },
  advanced: { label: 'Advanced', badge: 'badge--advanced' },
};

export const TOPICS = [
  {
    slug: 'jsx',
    icon: '🧩',
    level: 'beginner',
    title: 'Introduction & JSX',
    summary: 'What React is, why it exists, and the syntax that mixes markup with JavaScript.',
  },
  {
    slug: 'components',
    icon: '🏗️',
    level: 'beginner',
    title: 'Components & Rendering',
    summary: 'Splitting UI into reusable, composable functions that return JSX.',
  },
  {
    slug: 'props',
    icon: '📦',
    level: 'beginner',
    title: 'Props',
    summary: 'Passing read-only data from parent to child components.',
  },
  {
    slug: 'state',
    icon: '🔁',
    level: 'beginner',
    title: 'State with useState',
    summary: 'Giving components memory that persists across re-renders.',
  },
  {
    slug: 'events',
    icon: '👆',
    level: 'beginner',
    title: 'Handling Events',
    summary: 'Responding to clicks, input, and other user interaction.',
  },
  {
    slug: 'conditional-rendering',
    icon: '🔀',
    level: 'beginner',
    title: 'Conditional Rendering',
    summary: 'Showing different UI depending on state, with &&, ternaries, and early returns.',
  },
  {
    slug: 'lists-and-keys',
    icon: '📋',
    level: 'beginner',
    title: 'Lists & Keys',
    summary: 'Rendering arrays of data efficiently and correctly with .map() and keys.',
  },
  {
    slug: 'forms',
    icon: '📝',
    level: 'beginner',
    title: 'Forms & Controlled Inputs',
    summary: 'Making inputs a reflection of state, and handling submission.',
  },
  {
    slug: 'use-effect',
    icon: '🌐',
    level: 'intermediate',
    title: 'useEffect & Side Effects',
    summary: 'Synchronizing components with the outside world: timers, fetches, subscriptions.',
  },
  {
    slug: 'use-ref',
    icon: '🎯',
    level: 'intermediate',
    title: 'useRef',
    summary: 'Mutable values and direct DOM access that do not trigger re-renders.',
  },
  {
    slug: 'composition',
    icon: '🧱',
    level: 'intermediate',
    title: 'Composition & children',
    summary: 'Building flexible components with the children prop instead of deep prop-drilling.',
  },
  {
    slug: 'context',
    icon: '🛰️',
    level: 'intermediate',
    title: 'useContext & the Context API',
    summary: 'Sharing data across the tree without passing props through every level.',
  },
  {
    slug: 'lifting-state',
    icon: '⬆️',
    level: 'intermediate',
    title: 'Lifting State Up',
    summary: 'Coordinating sibling components by moving shared state to their common parent.',
  },
  {
    slug: 'styling',
    icon: '🎨',
    level: 'intermediate',
    title: 'Styling in React',
    summary: 'CSS files, inline styles, and conditional class names compared.',
  },
  {
    slug: 'use-reducer',
    icon: '🧮',
    level: 'advanced',
    title: 'useReducer',
    summary: 'Managing complex state transitions with actions and a pure reducer function.',
  },
  {
    slug: 'custom-hooks',
    icon: '🪝',
    level: 'advanced',
    title: 'Custom Hooks',
    summary: 'Extracting reusable stateful logic out of components into your own hooks.',
  },
  {
    slug: 'performance',
    icon: '⚡',
    level: 'advanced',
    title: 'useMemo & useCallback',
    summary: 'Memoizing expensive values and stable function references to skip needless work.',
  },
  {
    slug: 'error-boundaries',
    icon: '🛡️',
    level: 'advanced',
    title: 'Error Boundaries',
    summary: 'Catching render-time errors gracefully instead of crashing the whole app.',
  },
  {
    slug: 'routing',
    icon: '🧭',
    level: 'advanced',
    title: 'React Router Basics',
    summary: 'Building multi-page single-page apps with client-side routing.',
  },
  {
    slug: 'lifecycle',
    icon: '🌀',
    level: 'advanced',
    title: 'The Render & Commit Lifecycle',
    summary: 'What actually happens, in order, from state update to pixels on screen.',
  },
];

export function getTopicIndex(slug) {
  return TOPICS.findIndex((t) => t.slug === slug);
}

export function getAdjacentTopics(slug) {
  const i = getTopicIndex(slug);
  return { prev: i > 0 ? TOPICS[i - 1] : null, next: i < TOPICS.length - 1 ? TOPICS[i + 1] : null };
}
