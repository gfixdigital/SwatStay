import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { adminRequest, getAdminToken } from "../lib/adminApi";

/**
 * Database-backed persistence for admin records, with the original seed kept
 * as an offline fallback while the API is unavailable.
 */
export function usePreviewState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) { setReady(true); return; }
    adminRequest<T | null>(`/admin/data/${encodeURIComponent(key)}`).then((stored) => { if (stored !== null) setValue(stored); }).catch(() => undefined).finally(() => setReady(true));
  }, [key]);

  useEffect(() => {
    if (!ready || !dirty || !getAdminToken()) return;
    void adminRequest(`/admin/data/${encodeURIComponent(key)}`, { method: "PUT", body: JSON.stringify({ payload: value }) }).catch(() => undefined);
  }, [key, ready, dirty, value]);

  const update: Dispatch<SetStateAction<T>> = (next) => { setDirty(true); setValue(next); };
  return [value, update, ready] as const;
}
