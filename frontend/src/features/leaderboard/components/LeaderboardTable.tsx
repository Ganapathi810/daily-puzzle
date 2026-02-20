import React from 'react';
import type { LeaderboardEntry, DailyScoreEntry, LifetimeScoreEntry, FilterType } from '../types';
import LeaderboardRow from './LeaderboardRow';
import { Table, TableWrapper, Th, EmptyState } from './LeaderboardTable.styles';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  type: FilterType;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data, type }) => {
  if (!data.length) {
    return <EmptyState>No entries found</EmptyState>;
  }

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr style={{ borderBottom: "3px solid var(--bg-surface)"}}>
            <Th>Rank</Th>
            <Th>User</Th>
            <Th>Score</Th>
            {type === 'daily' ? (
              <Th>Time taken</Th>
            ) : (
              <>
                <Th style={{ textAlign: 'center' }}>Puzzles Solved</Th>
                <Th style={{ textAlign: 'center' }}>Avg Solve Time</Th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            if (type === 'daily') {
              const daily = item as DailyScoreEntry;
              return (
                  <LeaderboardRow
                    key={`${daily.userId}-${idx}`}
                    rank={idx + 1}
                    name={daily.name}
                    email={daily.email}
                    score={daily.score}
                    time={daily.timeTaken}
                    index={idx}
                  />
              );
            } else {
              const lifetime = item as LifetimeScoreEntry;
              return (
                  <LeaderboardRow
                    key={`${lifetime.userId}-${idx}`}
                    rank={idx + 1}
                    name={lifetime.name}
                    email={lifetime.email}
                    score={lifetime.totalPoints}
                    time={null}
                    puzzlesSolved={lifetime.puzzlesSolved}
                    avgSolveTime={lifetime.avgSolveTime}
                    index={idx}
                  />
              );
            }
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default LeaderboardTable;
