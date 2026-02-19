import styled from 'styled-components';
import { motion } from 'framer-motion';

export const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  background: var(--bg-primary);
  padding: 0.25rem;
  border-radius: 2rem;
  border-width: 2px;
  border-color: var(--bg-surface)
`;

export const FilterButton = styled(motion.button)<{ $active: boolean }>`
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'var(--bg-surface)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : 'rgba(216, 222, 232)')};
  box-shadow: ${({ $active }) => ($active ? '0 2px 8px rgba(0,0,0,0.05)' : 'none')};
  transition: color 0.2s;
`;
