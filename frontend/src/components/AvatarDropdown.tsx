import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

/* ---------- Styled Components (no motion here) ---------- */

const StyledDropdown = styled.div`
  position: absolute;
  right: 0;
  margin-top: 8px;
  width: 240px;
  background: var(--bg-surface);
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  padding: 14px;
  z-index: 50;
`;

const DropdownBox = motion(StyledDropdown);

const LogoutButton = styled.button`
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #ef4444;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 0, 0, 0.2);
  }
`;

/* ---------- Animation Variants ---------- */

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: {
      duration: 0.12,
      ease: "easeIn",
    },
  },
};

/* ---------- Component ---------- */

export const AvatarDropdown = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (user) {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    }

    localStorage.removeItem("authMode");
    dispatch(logout());
  };

  return (
    <div className="relative mr-2 sm:mr-5" ref={wrapperRef}>
      {/* Avatar Button (Tailwind handles layout) */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold hover:bg-gray-300 cursor-pointer transition"
      >
        {user?.email?.[0]?.toUpperCase() || "G"}
      </button>

      {/* Animated Dropdown */}
      <AnimatePresence>
        {open && (
          <DropdownBox
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-sm font-medium mb-3 text-gray-200 line-clamp-1">
              {user?.email || "Guest User"}
            </div>

            <LogoutButton onClick={handleLogout}>
              Log out
            </LogoutButton>
          </DropdownBox>
        )}
      </AnimatePresence>
    </div>
  );
};
