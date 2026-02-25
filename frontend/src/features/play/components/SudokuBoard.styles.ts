import styled from "styled-components";
import { motion } from "motion/react";

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(9, clamp(30px, 5vw, 50px));
  grid-template-rows: repeat(9, clamp(30px, 5vw, 50px));
  gap: 1px;
  background-color: #d1d5db; /* thin lines between all cells */
  border: 2px solid var(--bg-surface);
  position: relative;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(6px);
  background: rgba(0, 0, 0, 0.55);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: white;
`;

export const OverlayForAlreadySolved = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(6px);
  background: rgba(0, 0, 0, 0.55);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  color: white;
`;

export const Cell = styled(motion.div)<{
  selected: boolean;
  isFixed: boolean;
  isRevealing?: boolean;
  isSubgridRight?: boolean;
  isSubgridBottom?: boolean;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: ${({ isFixed }) => (isFixed ? 700 : 500)};
  background-color: ${({ selected, isFixed, isRevealing }) => {
    if (isRevealing) return "#4ade80"; // green-400 equivalent for revelation
    if (selected) return "rgba(55,163,237,0.5)";
    if (isFixed) return "rgba(55,163,237,0.9)";
    return "white";
  }};
  /* Subgrid Borders */
  border-right: ${({ isSubgridRight }) => (isSubgridRight ? "3px solid var(--bg-surface)" : "1px solid #d1d5db")};
  border-bottom: ${({ isSubgridBottom }) => (isSubgridBottom ? "3px solid var(--bg-surface)" : "1px solid #d1d5db")};
  
  cursor: ${({ isFixed }) => (isFixed ? "default" : "pointer")};
`;