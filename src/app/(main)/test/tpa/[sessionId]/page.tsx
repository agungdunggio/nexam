import { TestSessionView } from '@/components/test/TestSessionView';

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function TPATestSessionPage({ params }: PageProps) {
  return <TestSessionView sessionId={params.sessionId} testType="tpa" />;
}
