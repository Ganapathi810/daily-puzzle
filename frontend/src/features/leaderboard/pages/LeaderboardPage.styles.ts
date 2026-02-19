import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  padding: 2rem;
  background: #fee2e2;
  border-radius: 1rem;
  margin: 2rem 0;
`;
