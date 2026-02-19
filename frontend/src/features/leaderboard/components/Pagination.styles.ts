import styled from 'styled-components';
import { motion } from 'framer-motion';

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const PageButton = styled(motion.button)`
  padding: 0.5rem 1.2rem;
  border: 1px solid var(--bg-primary);
  background: var(--bg-surface);
  border-radius: 2rem;
  font-size: 0.95rem;
  cursor: pointer;
  color: white;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  color: #475569;
  font-size: 0.95rem;
`;
