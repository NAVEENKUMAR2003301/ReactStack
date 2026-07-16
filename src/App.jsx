import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TopicPage from './pages/TopicPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/learn/:slug" element={<TopicPage />} />
      </Route>
    </Routes>
  );
}

export default App;
