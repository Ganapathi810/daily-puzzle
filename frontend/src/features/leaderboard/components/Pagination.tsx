import React from 'react';
import { PaginationContainer, PageButton, PageInfo } from './Pagination.styles';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPrev, onNext }) => (
  <PaginationContainer>
    <PageButton
      onClick={onPrev}
      disabled={page === 1}
      whileTap={{ scale: 0.95 }}
    >
      ← Previous
    </PageButton>
    <PageInfo>
      Page {page} of {totalPages}
    </PageInfo>
    <PageButton
      onClick={onNext}
      disabled={page === totalPages}
      whileTap={{ scale: 0.95 }}
    >
      Next →
    </PageButton>
  </PaginationContainer>
);

export default Pagination;