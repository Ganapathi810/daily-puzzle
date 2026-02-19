import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import type { LeaderboardEntry, FilterType } from '../types';
import { fetchDailyScores, fetchLifetimeScores } from '../lib';
import LeaderboardTable from '../components/LeaderboardTable';
import LeaderboardFilters from '../components/LeaderboardFilters';
import Pagination from '../components/Pagination';
import { PageContainer, Header, Title, ErrorMessage } from './LeaderboardPage.styles';

const LeaderboardPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('daily');
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (filter === 'daily') {
        const response = await fetchDailyScores(page, limit);
        setData(response.data);
        setTotalPages(Math.ceil(response.total / limit));
      } else {
        const response = await fetchLifetimeScores(page, limit);
        setData(response.data);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      setError('Failed to load leaderboard. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <PageContainer>
      <Header>
        <Title>Leaderboard</Title>
        <LeaderboardFilters 
          currentFilter={filter} 
          onFilterChange={handleFilterChange} 
        />
      </Header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', marginTop: '10px' }}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <LeaderboardTable data={data} type={filter} />
      )}

      {!loading && !error && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      )}
    </PageContainer>
  );
};

export default LeaderboardPage;
