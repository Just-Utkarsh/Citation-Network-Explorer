"use client";

export function LoadingOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="loader" aria-hidden="true" />
    </div>
  );
}
