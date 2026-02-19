import styled, { keyframes } from "styled-components"
import { LoaderCircle } from "lucide-react"

interface SpinnerProps {
  size?: number
  text?: string
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerIcon = styled(LoaderCircle)<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  color: #3b82f6;
  animation: ${spin} 0.8s linear infinite;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`

const Text = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
`

export default function LoadingSpinner({ size = 40, text }: SpinnerProps) {
  return (
    <Wrapper>
      <SpinnerIcon $size={size} />
      {text && <Text>{text}</Text>}
    </Wrapper>
  )
}
