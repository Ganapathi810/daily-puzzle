import styled from "styled-components";
import { motion } from "motion/react";

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(9, clamp(30px, 5vw, 50px));
  grid-template-rows: repeat(9, clamp(30px, 5vw, 50px));
  gap: 2px;
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
}>`
  width: clamp(30px, 5vw, 50px);
  height: clamp(30px, 5vw, 50px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: ${({ isFixed }) => (isFixed ? 700 : 500)};
  background-color: ${({ selected, isFixed }) => {
    if (selected) return "rgba(55,163,237,0.5)";
    if (isFixed) return "rgba(55,163,237,0.9)";
    return "white";
  }};
  border: 1px solid #d1d5db;
  border-radius: 5px;
  cursor: ${({ isFixed }) => (isFixed ? "default" : "pointer")};
`;