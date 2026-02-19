import React from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../../../lib/formatTime';
import { RankCell, UserCell, Avatar, ScoreCell, TimeCell, StatCell } from './LeaderboardRow.styles';

interface LeaderboardRowProps {
  rank: number;
  email: string;
  score: number;
  time?: number | null;
  puzzlesSolved?: number;
  avgSolveTime?: number;
  index: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ 
  rank, 
  email, 
  score, 
  time, 
  puzzlesSolved, 
  avgSolveTime, 
  index 
}) => {
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      style={{ display: 'table-row', borderBottom: "2px solid var(--bg-surface)" }}
      className=''
    >
      <RankCell>
        {rankEmoji ? `${rankEmoji} ${rank}` : rank}
      </RankCell>
      <UserCell>
        <Avatar>{email.charAt(0).toUpperCase()}</Avatar>
        {email}
      </UserCell>
      <ScoreCell>{score}</ScoreCell>
      {time !== undefined && time !== null ? (
        <TimeCell>{formatTime(time)}</TimeCell>
      ) : (
        <>
          <StatCell>{puzzlesSolved ?? 0}</StatCell>
          <StatCell>{avgSolveTime ? formatTime(avgSolveTime) : '—'}</StatCell>
        </>
      )}
    </motion.tr>
  );
};

export default LeaderboardRow;

