import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import StepThrough from '../../components/StepThrough';
import Callout from '../../components/Callout';
import RealWorld from '../../components/RealWorld';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'routing');

// This whole ReactStack site already runs inside one <BrowserRouter> (see
// main.jsx) — React Router forbids nesting a second Router inside that tree,
// so this demo simulates matching a path to a component with plain state
// instead of mounting a real (Memory)Router, while still illustrating the
// exact same "URL → matched component" idea.
function MiniHome({ onNavigate }) {
  return (
    <div className="card">
      <p style={{ margin: 0 }}>🏠 Home page</p>
      <button className="btn btn--sm" onClick={() => onNavigate('/product/42')}>
        Go to product #42 →
      </button>
    </div>
  );
}
function MiniProduct({ id, onNavigate }) {
  return (
    <div className="card">
      <p style={{ margin: 0 }}>📦 Product page — id "{id}" read from the URL</p>
      <button className="btn btn--sm" onClick={() => onNavigate('/')}>← Back home</button>
    </div>
  );
}

function RoutingDemo() {
  const [path, setPath] = useState('/');
  const productMatch = path.match(/^\/product\/(.+)$/);

  return (
    <>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text-faint)' }}>
        address bar: <code>{path}</code>
      </div>
      {productMatch ? (
        <MiniProduct id={productMatch[1]} onNavigate={setPath} />
      ) : (
        <MiniHome onNavigate={setPath} />
      )}
    </>
  );
}

export default function Routing() {
  return (
    <article>
      <PageHeader topic={topic}>
        React Router maps URL paths to components on the client, so navigating feels
        instant — no full page reload — while the URL still stays shareable and
        bookmarkable.
      </PageHeader>

      <p>
        React itself has no built-in concept of "pages" or a "current URL" — it just
        renders a component tree. React Router bridges that gap: it reads the current
        URL, matches it against a list of paths you define, and renders whichever
        component corresponds to the match. This whole ReactStack site is one page — it
        uses exactly this pattern for every topic you're browsing right now.
      </p>

      <CodeBlock
        title="Basic setup"
        code={`import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<Product />} />
  </Routes>
</BrowserRouter>

// navigate without a full page reload:
<Link to="/product/42">View product</Link>`}
      />

      <h2>Reading URL params</h2>
      <CodeBlock
        title="useParams"
        code={`function Product() {
  const { id } = useParams(); // "42", from /product/42
  return <h1>Product #{id}</h1>;
}`}
      />

      <Callout type="tip" title="Link vs. <a>">
        A plain <code>&lt;a href="/product/42"&gt;</code> triggers a full browser
        navigation — the entire app reloads from scratch. <code>&lt;Link
        to="/product/42"&gt;</code> intercepts the click and updates the URL and rendered
        component in place, keeping all your React state (except in that unmounted
        subtree) intact.
      </Callout>

      <h2>Try it</h2>
      <p>
        A simplified simulation of the same idea — the "address bar" above is just a
        piece of state, matched against a pattern to decide which mini-component to
        render, the same job a real Router does with the browser's actual URL.
      </p>
      <DemoCard
        label="A tiny 2-route app"
        code={`// simplified simulation — a real app uses <Routes>/<Route> from
// react-router-dom instead of this hand-rolled path matcher
function RoutingDemo() {
  const [path, setPath] = useState('/');
  const productMatch = path.match(/^\\/product\\/(.+)$/);

  return productMatch ? (
    <MiniProduct id={productMatch[1]} onNavigate={setPath} />
  ) : (
    <MiniHome onNavigate={setPath} />
  );
}`}
      >
        <RoutingDemo />
      </DemoCard>

      <h2>What actually happens when you click &ldquo;Go to product #42&rdquo;</h2>
      <StepThrough
        title="Tracing one simulated navigation"
        steps={[
          {
            icon: '👆',
            label: 'Click',
            explain: 'You click "Go to product #42", which calls onNavigate(\'/product/42\') — really just setPath(\'/product/42\') under the hood.',
            preview: 'path update scheduled',
          },
          {
            icon: '🔁',
            label: 'Re-run',
            explain: 'React re-runs RoutingDemo. path now holds the new string.',
            preview: 'path === "/product/42"',
          },
          {
            icon: '🔎',
            label: 'Match against pattern',
            explain: 'path.match(/^\\/product\\/(.+)$/) is evaluated again. This time it matches, capturing "42" as productMatch[1].',
            preview: 'productMatch !== null, id === "42"',
          },
          {
            icon: '🔀',
            label: 'Branch selected',
            explain: 'The ternary now picks <MiniProduct id="42" ... /> instead of <MiniHome ... /> — a real Router does exactly this same match-and-select against the actual browser URL.',
            preview: '<MiniProduct id="42" /> selected',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'React swaps the rendered subtree — the home card is replaced by the product card, with no full page reload.',
            preview: '"📦 Product page — id \\"42\\" read from the URL"',
          },
        ]}
      />

      <Quiz
        question="In a real app using react-router-dom, what would replace this demo's regex match against path?"
        options={[
          "Nothing — you'd still write your own regex for every route",
          "The <Routes>/<Route path=\"/product/:id\"> pattern, with useParams() reading the matched id",
          "A full page reload for every route change",
        ]}
        correctIndex={1}
        explanation="React Router's Route component, matching path /product/:id, does the same job as this demo's regex — match a URL pattern and expose the captured segment — but as a declarative, tested API instead of hand-rolled matching."
      />
      <Quiz
        question="Why doesn't clicking the navigate button in this demo (or a real <Link>) cause a full page reload?"
        options={[
          "Because it's not a real navigation, just a visual trick with no URL change",
          "Because it updates a piece of state (or the History API in a real Router) and re-renders the matched component in place, instead of asking the browser to fetch a new page",
          "Modern browsers never reload for any click",
        ]}
        correctIndex={1}
        explanation="client-side routing intercepts navigation and handles it entirely inside the already-loaded JavaScript app — the URL changes, and React swaps components, but the browser never issues a new page request."
      />

      <RealWorld title="An e-commerce site's page structure">
        <p>
          Home, a product page, a cart, and checkout are four different URLs a user can
          bookmark or share, but they're all one React app — this is the exact routing
          table behind a typical storefront.
        </p>
        <CodeBlock
          title="AppRoutes.jsx"
          code={`<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products/:id" element={<ProductPage />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="*" element={<NotFound />} />
</Routes>`}
        />
      </RealWorld>

      <Quiz
        question="Why does clicking a <Link> feel instant, with no full-page flash?"
        options={[
          "Links are always faster than <a> tags at the network level",
          "React Router intercepts the click, updates the URL via the History API, and swaps components in place — no server round-trip or page reload",
          "The browser caches the entire site on the first visit",
        ]}
        correctIndex={1}
        explanation="React Router's <Link> prevents the default browser navigation and instead updates the URL with the History API while React re-renders just the matched component — the page never actually reloads."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
