import { useReducer } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import StepThrough from '../../components/StepThrough';
import Callout from '../../components/Callout';
import FlowDiagram from '../../components/FlowDiagram';
import RealWorld from '../../components/RealWorld';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'use-reducer');

const initialCart = { items: 0, total: 0 };

function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return { items: state.items + 1, total: state.total + action.price };
    case 'remove':
      return state.items === 0
        ? state
        : { items: state.items - 1, total: Math.max(0, state.total - action.price) };
    case 'clear':
      return initialCart;
    default:
      return state;
  }
}

function CartDemo() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const price = 8;

  return (
    <>
      <p style={{ margin: 0 }}>
        🛒 <strong>{cart.items}</strong> item{cart.items !== 1 && 's'} · ${cart.total}
      </p>
      <div className="btn-row">
        <button className="btn" onClick={() => dispatch({ type: 'remove', price })}>− Remove</button>
        <button className="btn btn--primary" onClick={() => dispatch({ type: 'add', price })}>+ Add ($8)</button>
        <button className="btn" onClick={() => dispatch({ type: 'clear' })}>Clear</button>
      </div>
    </>
  );
}

export default function UseReducerTopic() {
  return (
    <article>
      <PageHeader topic={topic}>
        useReducer manages state via named actions and a pure reducer function — the
        same pattern as Redux, built into React, for state with several related updates.
      </PageHeader>

      <p>
        A shopping cart has several ways to change: add an item, remove one, clear
        everything — each affecting both <code>items</code> and <code>total</code>{' '}
        together. Modeling that with several <code>useState</code> calls means every
        handler has to remember to update both fields correctly, every time.{' '}
        <code>useReducer</code> centralizes that logic: one function decides how state
        changes, given the current state and a description of what happened.
      </p>

      <CodeBlock
        title="Reducer + dispatch"
        code={`function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return { items: state.items + 1, total: state.total + action.price };
    case 'remove':
      return { items: state.items - 1, total: state.total - action.price };
    case 'clear':
      return { items: 0, total: 0 };
    default:
      return state;
  }
}

const [cart, dispatch] = useReducer(cartReducer, { items: 0, total: 0 });

dispatch({ type: 'add', price: 8 }); // describes *what happened*, not *how to change state*`}
      />

      <FlowDiagram
        steps={[
          { icon: '👆', label: "dispatch({type:'add'})" },
          { icon: '📜', label: 'React calls cartReducer(state, action)' },
          { icon: '🧮', label: 'Reducer computes next state' },
          { icon: '🔁', label: 'Component re-renders with it' },
        ]}
      />

      <h2>useState vs. useReducer</h2>
      <p>
        They're not competitors — <code>useReducer</code> is what you reach for when
        <code>useState</code> starts to strain: many related fields that update together,
        several distinct ways to update them, or update logic complex enough to want its
        own name and its own tests, separate from the component's JSX.
      </p>

      <Callout type="tip" title="Reducers must be pure">
        Given the same <code>state</code> and <code>action</code>, a reducer must always
        return the same result, with no side effects (no API calls, no mutating{' '}
        <code>state</code> in place — always return a new object). That purity is what
        makes reducer logic easy to test in isolation, completely separate from React.
      </Callout>

      <h2>Try it</h2>
      <DemoCard
        label="A cart driven by dispatched actions"
        code={`function cartReducer(state, action) {
  switch (action.type) {
    case 'add': return { items: state.items + 1, total: state.total + action.price };
    case 'remove': return { items: state.items - 1, total: state.total - action.price };
    case 'clear': return { items: 0, total: 0 };
    default: return state;
  }
}

function CartDemo() {
  const [cart, dispatch] = useReducer(cartReducer, { items: 0, total: 0 });
  return (
    <>
      <p>{cart.items} items · \${cart.total}</p>
      <button onClick={() => dispatch({ type: 'remove', price: 8 })}>− Remove</button>
      <button onClick={() => dispatch({ type: 'add', price: 8 })}>+ Add</button>
      <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
    </>
  );
}`}
      >
        <CartDemo />
      </DemoCard>

      <h2>What actually happens when you click &ldquo;+ Add&rdquo;</h2>
      <StepThrough
        title="Tracing one dispatched action"
        steps={[
          {
            icon: '👆',
            label: 'Dispatch',
            explain: 'You click "+ Add", which calls dispatch({ type: \'add\', price: 8 }) — this hands React an action object, not a new state value.',
            preview: 'action queued: { type: "add", price: 8 }',
          },
          {
            icon: '📜',
            label: 'Reducer called',
            explain: 'React calls cartReducer(currentState, action) — currentState is { items: 0, total: 0 }, action is what you just dispatched.',
            preview: 'cartReducer({ items: 0, total: 0 }, { type: "add", price: 8 })',
          },
          {
            icon: '🔀',
            label: 'Switch matches',
            explain: 'Inside the reducer, action.type === "add" matches that case, which computes and returns a brand-new state object — never mutating the old one.',
            preview: 'returns { items: 1, total: 8 }',
          },
          {
            icon: '🔁',
            label: 'Component re-renders',
            explain: 'useReducer gives CartDemo that new object as cart on this render — dispatch itself never touched the UI directly.',
            preview: 'cart === { items: 1, total: 8 }',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'React updates the summary text and total on screen to reflect the reducer\'s output.',
            preview: '"🛒 1 item · $8"',
          },
        ]}
      />

      <Quiz
        question="After dispatch({ type: 'add', price: 8 }) runs, has cart changed yet, in that same line of code?"
        options={[
          "Yes, cart is immediately the new object",
          "No — dispatch only queues the action; cart holds the new value once CartDemo re-renders and useReducer returns it",
          "cart is deleted and recreated from scratch",
        ]}
        correctIndex={1}
        explanation="dispatch works like a state setter — it schedules work (calling the reducer, then re-rendering) rather than mutating anything synchronously in place."
      />
      <Quiz
        question="What would go wrong if cartReducer's 'add' case did state.items++ instead of returning a new object?"
        options={[
          "Nothing, mutating is equally valid",
          "Mutating the existing state object breaks React's ability to detect that state changed, since it often compares old and new state by reference",
          "The switch statement would fail to compile",
        ]}
        correctIndex={1}
        explanation="reducers are expected to be pure and to return new state rather than mutate the old object — this is exactly the same reference-equality concern as with useState, just inside a reducer instead."
      />

      <RealWorld title="A multi-step checkout flow">
        <p>
          A checkout process has several steps (shipping → payment → review), several
          fields per step, and several ways it can be interrupted (going back, editing
          an earlier step). A reducer models each of those as a named action, keeping
          the "how does the form change" logic in one testable place instead of spread
          across a dozen <code>onChange</code> handlers.
        </p>
        <CodeBlock
          title="checkoutReducer.js"
          code={`function checkoutReducer(state, action) {
  switch (action.type) {
    case 'setField':
      return { ...state, [action.field]: action.value };
    case 'nextStep':
      return { ...state, step: state.step + 1 };
    case 'goBack':
      return { ...state, step: Math.max(0, state.step - 1) };
    default:
      return state;
  }
}

dispatch({ type: 'setField', field: 'email', value: 'me@example.com' });
dispatch({ type: 'nextStep' });`}
        />
      </RealWorld>

      <Quiz
        question="What does dispatch({ type: 'add', price: 8 }) actually do?"
        options={[
          "It directly mutates the cart state's items and total fields",
          "It sends an action object to the reducer, which computes and returns the next state",
          "It immediately re-renders the component before computing anything",
        ]}
        correctIndex={1}
        explanation="dispatch doesn't change state itself — it hands the action to your reducer function, which pure-computes the next state object; React then re-renders with that new state."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
