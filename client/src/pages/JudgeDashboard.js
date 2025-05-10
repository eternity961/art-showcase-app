// JudgeDashboard.jsx
import LiteralJudgeDashboard from './LiteralJudgeDashboard';
import VisualJudgeDashboard from './VisualJudgeDashboard';
import VocalJudgeDashboard from './VocalJudgeDashboard';

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function JudgeDashboard() {
  const { user } = useContext(AuthContext);
  if (user.role === 'literal_judge') return <LiteralJudgeDashboard />;
  if (user.role === 'visual_judge') return <VisualJudgeDashboard />;
  if (user.role === 'vocal_judge') return <VocalJudgeDashboard />;
  return <div>Access Denied</div>;
}
export default JudgeDashboard;