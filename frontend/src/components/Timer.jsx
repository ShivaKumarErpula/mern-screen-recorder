import React from "react";

export default function Timer({ seconds }) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return <span>{m}:{s}</span>;
}
