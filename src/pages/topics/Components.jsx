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

const topic = TOPICS.find((t) => t.slug === 'components');

function Avatar({ emoji, name }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem' }}>{emoji}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{name}</div>
    </div>
  );
}

function TeamDemo() {
  return (
    <div className="btn-row">
      <Avatar emoji="🦊" name="Fox" />
      <Avatar emoji="🐼" name="Panda" />
      <Avatar emoji="🐧" name="Penguin" />
    </div>
  );
}

export default function Components() {
  return (
    <article>
      <PageHeader topic={topic}>
        A component is a JavaScript function that returns JSX. That's the whole
        definition — everything else is a consequence of that one idea.
      </PageHeader>

      <p>
        Components are how React lets you build a big, complex UI out of small, isolated,
        reusable pieces. A component name must start with a{' '}
        <strong>capital letter</strong> — that's how React tells a custom component
        (<code>&lt;Avatar /&gt;</code>) apart from a built-in HTML tag
        (<code>&lt;div /&gt;</code>).
      </p>

      <CodeBlock
        title="Defining and using a component"
        code={`function Avatar({ emoji, name }) {
  return (
    <div>
      <span>{emoji}</span>
      <p>{name}</p>
    </div>
  );
}

function Team() {
  return (
    <div>
      <Avatar emoji="🦊" name="Fox" />
      <Avatar emoji="🐼" name="Panda" />
    </div>
  );
}`}
      />

      <FlowDiagram
        steps={[
          { icon: '🔤', label: '<Team /> called' },
          { icon: '🧩', label: 'Renders 2× <Avatar />' },
          { icon: '🌳', label: 'Component tree built' },
          { icon: '🖥️', label: 'Painted to screen' },
        ]}
      />

      <h2>Composition over one giant function</h2>
      <p>
        You could write the whole UI as one massive function, but splitting it into
        components buys you three things: each piece is <strong>testable</strong> in
        isolation, <strong>reusable</strong> anywhere, and <strong>readable</strong> —
        the parent component reads like an outline of the page.
      </p>

      <Callout type="why" title="Why capitalization matters">
        JSX compiles <code>&lt;avatar /&gt;</code> (lowercase) to
        <code> React.createElement('avatar', ...)</code> — React treats it as an HTML tag
        named "avatar" and renders nothing useful. Capitalizing it to
        <code> &lt;Avatar /&gt;</code> compiles to
        <code> React.createElement(Avatar, ...)</code>, calling your function instead.
      </Callout>

      <h2>Try it</h2>
      <p>
        <code>Team</code> renders three <code>Avatar</code> components, each with
        different props — the same component, reused three times.
      </p>
      <DemoCard
        label="Component tree in action"
        code={`function Avatar({ emoji, name }) {
  return (
    <div>
      <div>{emoji}</div>
      <div>{name}</div>
    </div>
  );
}

function TeamDemo() {
  return (
    <div>
      <Avatar emoji="🦊" name="Fox" />
      <Avatar emoji="🐼" name="Panda" />
      <Avatar emoji="🐧" name="Penguin" />
    </div>
  );
}`}
      >
        <TeamDemo />
      </DemoCard>

      <h2>What actually happens when this tree mounts</h2>
      <StepThrough
        title="Tracing TeamDemo's first render"
        steps={[
          {
            icon: '🔤',
            label: 'Call',
            explain: 'React calls TeamDemo() as a plain function. It returns JSX describing a <div> wrapping three <Avatar /> elements.',
            preview: 'TeamDemo() → JSX tree (not yet rendered)',
          },
          {
            icon: '🦊',
            label: 'Avatar #1',
            explain: 'React sees <Avatar emoji="🦊" name="Fox" /> is a component (capitalized), so it calls Avatar({ emoji: "🦊", name: "Fox" }).',
            preview: 'Avatar() runs with its own props',
          },
          {
            icon: '🐼',
            label: 'Avatar #2 & #3',
            explain: 'The same Avatar function is called again for Panda and Penguin — each call is independent, with its own props and its own returned JSX.',
            preview: '3 separate Avatar() calls total',
          },
          {
            icon: '🌳',
            label: 'Tree assembled',
            explain: 'React collects every returned JSX (Team\'s own markup plus all three Avatar results) into one component tree.',
            preview: 'one tree, 4 components deep',
          },
          {
            icon: '🖥️',
            label: 'Paint',
            explain: 'That whole tree is turned into real DOM nodes in one pass and painted to the screen.',
            preview: 'DOM shows 3 avatars side by side',
          },
        ]}
      />

      <Quiz
        question="Is Avatar a special kind of function, different from a normal JavaScript function?"
        options={[
          'No — it is a plain function that returns JSX; React calls it the same way it would call any function',
          'Yes, components require a special "component" keyword',
          'Yes, only functions defined at the top of a file can be components',
        ]}
        correctIndex={0}
        explanation="the only rules are: it's a function, it returns JSX (or null), and its name is capitalized so JSX treats <Avatar /> as a call to it instead of an HTML tag."
      />
      <Quiz
        question="TeamDemo renders <Avatar /> three times with different props. How many separate calls to the Avatar function does that cause?"
        options={['One call, reused three times', 'Three separate calls, each with its own props', 'Zero — Avatar only defines the shape, it never actually runs']}
        correctIndex={1}
        explanation="each JSX usage of a component is an independent call to that function — three <Avatar /> tags mean Avatar() runs three separate times, once per set of props."
      />

      <RealWorld title="An Instagram-style feed">
        <p>
          A social feed is one component, <code>Post</code>, rendered once per item in a
          list of posts fetched from a server. Each post itself is built from smaller
          components — <code>Avatar</code>, <code>LikeButton</code>,{' '}
          <code>CommentList</code> — the exact same "small pieces, composed" idea as
          <code> Team</code> above, just at the scale of a real app.
        </p>
        <CodeBlock
          title="Feed.jsx"
          code={`function Feed({ posts }) {
  return (
    <div className="feed">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

function Post({ post }) {
  return (
    <article>
      <Avatar user={post.author} />
      <p>{post.caption}</p>
      <LikeButton postId={post.id} likes={post.likes} />
    </article>
  );
}`}
        />
      </RealWorld>

      <Quiz
        question="Why does <avatar /> (lowercase) fail to render your component?"
        options={[
          'React only supports uppercase HTML tags',
          'React treats lowercase tags as built-in DOM elements, not your function',
          'JSX requires component names to be exactly 5 letters',
        ]}
        correctIndex={1}
        explanation="capitalization is how JSX decides whether a tag is a native DOM element or a call to your component function."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
