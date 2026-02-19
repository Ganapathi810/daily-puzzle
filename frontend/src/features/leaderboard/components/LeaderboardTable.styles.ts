import styled from 'styled-components';

export const TableWrapper = styled.div`
  background: #0d2957;
  border-radius: 1rem;
  border-width: 7px;
  border-color: var(--bg-surface);
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-primary);
  min-width: 700px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 1.2rem 1rem;
  font-weight: 600;
  color: white;
  font-size: 18px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
`;
