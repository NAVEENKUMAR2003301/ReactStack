import { Navigate, useParams } from 'react-router-dom';
import { REGISTRY } from './registry';

export default function TopicPage() {
  const { slug } = useParams();
  const Page = REGISTRY[slug];
  if (!Page) return <Navigate to="/" replace />;
  return <Page />;
}
