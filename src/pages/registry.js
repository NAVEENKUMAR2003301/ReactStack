import Jsx from './topics/Jsx';
import Components from './topics/Components';
import Props from './topics/Props';
import StateTopic from './topics/StateTopic';
import Events from './topics/Events';
import ConditionalRendering from './topics/ConditionalRendering';
import ListsAndKeys from './topics/ListsAndKeys';
import Forms from './topics/Forms';
import UseEffect from './topics/UseEffect';
import UseRef from './topics/UseRef';
import Composition from './topics/Composition';
import ContextTopic from './topics/ContextTopic';
import LiftingState from './topics/LiftingState';
import Styling from './topics/Styling';
import UseReducerTopic from './topics/UseReducerTopic';
import CustomHooks from './topics/CustomHooks';
import Performance from './topics/Performance';
import ErrorBoundaries from './topics/ErrorBoundaries';
import Routing from './topics/Routing';
import Lifecycle from './topics/Lifecycle';

export const REGISTRY = {
  jsx: Jsx,
  components: Components,
  props: Props,
  state: StateTopic,
  events: Events,
  'conditional-rendering': ConditionalRendering,
  'lists-and-keys': ListsAndKeys,
  forms: Forms,
  'use-effect': UseEffect,
  'use-ref': UseRef,
  composition: Composition,
  context: ContextTopic,
  'lifting-state': LiftingState,
  styling: Styling,
  'use-reducer': UseReducerTopic,
  'custom-hooks': CustomHooks,
  performance: Performance,
  'error-boundaries': ErrorBoundaries,
  routing: Routing,
  lifecycle: Lifecycle,
};
