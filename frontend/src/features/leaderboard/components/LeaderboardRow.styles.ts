import styled from 'styled-components';

export const RankCell = styled.td`
  font-weight: 600;
  width: 80px;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: white;
  
`;

export const UserCell = styled.td`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: white;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #d9e2ef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #1e4f8a;
  font-size: 1rem;
`;

export const ScoreCell = styled.td`
  font-weight: 600;
  color: white;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

export const TimeCell = styled.td`
  color: white;
  font-family: 'JetBrains Mono', monospace;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

export const StatCell = styled.td`
  color: white;
  font-family: 'JetBrains Mono', monospace;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
`;
