import React from "react";

export const avatars: Record<string, React.FC<{ className?: string }>> = {
  "avatar-bear": ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="45" fill="#B45309" />
      <circle cx="30" cy="25" r="12" fill="#B45309" />
      <circle cx="70" cy="25" r="12" fill="#B45309" />
      <circle cx="30" cy="25" r="6" fill="#D97706" />
      <circle cx="70" cy="25" r="6" fill="#D97706" />
      <circle cx="50" cy="55" r="25" fill="#FDE68A" />
      <circle cx="40" cy="45" r="4" fill="#000" />
      <circle cx="60" cy="45" r="4" fill="#000" />
      <ellipse cx="50" cy="55" rx="6" ry="4" fill="#000" />
    </svg>
  ),
  "avatar-cat": ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="45" fill="#94A3B8" />
      <path d="M20 25 L35 10 L45 25 Z" fill="#94A3B8" />
      <path d="M80 25 L65 10 L55 25 Z" fill="#94A3B8" />
      <circle cx="40" cy="45" r="4" fill="#000" />
      <circle cx="60" cy="45" r="4" fill="#000" />
      <path d="M45 55 Q50 60 55 55" fill="none" stroke="#000" strokeWidth="2" />
      <circle cx="50" cy="52" r="3" fill="#FDA4AF" />
    </svg>
  ),
  "avatar-dog": ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="45" fill="#D97706" />
      <ellipse cx="20" cy="40" rx="10" ry="20" fill="#78350F" />
      <ellipse cx="80" cy="40" rx="10" ry="20" fill="#78350F" />
      <circle cx="40" cy="45" r="4" fill="#000" />
      <circle cx="60" cy="45" r="4" fill="#000" />
      <ellipse cx="50" cy="60" rx="15" ry="10" fill="#FDE68A" />
      <circle cx="50" cy="55" r="4" fill="#000" />
    </svg>
  ),
  "avatar-bunny": ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="55" r="40" fill="#F1F5F9" />
      <ellipse cx="35" cy="25" rx="8" ry="25" fill="#F1F5F9" />
      <ellipse cx="65" cy="25" rx="8" ry="25" fill="#F1F5F9" />
      <ellipse cx="35" cy="25" rx="4" ry="15" fill="#FDA4AF" />
      <ellipse cx="65" cy="25" rx="4" ry="15" fill="#FDA4AF" />
      <circle cx="40" cy="50" r="3" fill="#000" />
      <circle cx="60" cy="50" r="3" fill="#000" />
      <circle cx="50" cy="60" r="3" fill="#FDA4AF" />
    </svg>
  ),
  "avatar-panda": ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="45" fill="#FFF" stroke="#E2E8F0" strokeWidth="1" />
      <circle cx="25" cy="25" r="12" fill="#000" />
      <circle cx="75" cy="25" r="12" fill="#000" />
      <ellipse cx="40" cy="45" rx="10" ry="12" fill="#000" />
      <ellipse cx="60" cy="45" rx="10" ry="12" fill="#000" />
      <circle cx="40" cy="42" r="3" fill="#FFF" />
      <circle cx="60" cy="42" r="3" fill="#FFF" />
      <circle cx="50" cy="60" r="4" fill="#000" />
    </svg>
  ),
  "avatar-fox": ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="45" fill="#F97316" />
      <path d="M15 20 L40 30 L20 40 Z" fill="#F97316" />
      <path d="M85 20 L60 30 L80 40 Z" fill="#F97316" />
      <path d="M15 50 Q50 90 85 50 L50 70 Z" fill="#FFF" />
      <circle cx="40" cy="45" r="4" fill="#000" />
      <circle cx="60" cy="45" r="4" fill="#000" />
      <circle cx="50" cy="65" r="4" fill="#000" />
    </svg>
  ),
};
