import { useReducer } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import FlowDiagram from '../../components/FlowDiagram';
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
      <DemoCard label="A cart driven by dispatched actions">
        <CartDemo />
      </DemoCard>

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
