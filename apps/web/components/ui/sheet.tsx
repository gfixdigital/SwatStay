"use client"; export function Sheet({ open, children }: { open: boolean; children: React.ReactNode }) { return open ? <div className="fixed inset-0 z-50 bg-charcoal/40">{children}</div> : null; }
