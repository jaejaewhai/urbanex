"use client";
import { useRef, useEffect } from "react";

export default function PageLayout({ children }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100vw',
        margin: 0,
        padding: 0,
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
}