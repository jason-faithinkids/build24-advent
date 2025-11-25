'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'stickerbook_unlocked_v1';

export default function UnlockStickerClient({ day }) {
  useEffect(() => {
    if (!day) return;
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!existing.includes(day)) {
      const updated = [...existing, day];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [day]);

  return null;
}
