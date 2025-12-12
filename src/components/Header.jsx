'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getAllDays } from '../lib/days';

const TOTAL_DECEMBER_DAYS = 24;
const DECEMBER_MONTH_INDEX = 11;

function getUnlockedDayNumber() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const decemberStart = new Date(currentYear, DECEMBER_MONTH_INDEX, 1);
  const decemberEnd = new Date(currentYear, DECEMBER_MONTH_INDEX, TOTAL_DECEMBER_DAYS, 23, 59, 59, 999);

  if (now < decemberStart) {
    return 0;
  }

  if (now > decemberEnd) {
    return TOTAL_DECEMBER_DAYS;
  }

  return Math.min(now.getDate(), TOTAL_DECEMBER_DAYS);
}

export default function Header() {
  const days = useMemo(() => getAllDays(), []);
  const availableDays = useMemo(() => new Set(days.map((d) => d.day)), [days]);

  const [unlockedThrough, setUnlockedThrough] = useState(0);

  useEffect(() => {
    setUnlockedThrough(getUnlockedDayNumber());
  }, []);

  const isDayUnlocked = (day) => availableDays.has(day) && day <= unlockedThrough;

  return (
    <header className="advent-header">
      <div className="header-content">
        <Link href="/" className="header-logo">
          <span className="logo-brick" aria-hidden>🧱</span>
          <div className="logo-text">
            <div className="logo-title">THE CHRISTMAS STORY</div>
            <div className="logo-subtitle">The Christmas Build-Up by Faith in Kids</div>
          </div>
        </Link>

        <nav className="header-nav">
          <details className="nav-days">
            <summary className="nav-link">Days</summary>
            <div className="nav-days-menu" role="menu" aria-label="Days menu">
              {Array.from({ length: TOTAL_DECEMBER_DAYS }, (_, idx) => {
                const day = idx + 1;
                const unlocked = isDayUnlocked(day);

                if (unlocked) {
                  return (
                    <Link key={day} href={`/day/${day}`} className="nav-day-link" role="menuitem">
                      Day {day}
                    </Link>
                  );
                }

                return (
                  <span
                    key={day}
                    className="nav-day-link is-locked"
                    role="menuitem"
                    aria-disabled="true"
                    title={`Locked until December ${day}`}
                  >
                    Day {day}
                  </span>
                );
              })}
            </div>
          </details>
          <Link href="/stickerbook/" className="nav-link">
            My Sticker Book
          </Link>
          <a href="https://faithinkids.org" target="_blank" rel="noreferrer" className="nav-link-fik">
            <img src="/img/fik-logo.webp" alt="Faith in Kids" className="fik-logo-small" />
            <i className="fas fa-external-link-alt" aria-hidden></i>
            <span className="sr-only">Faith in Kids (opens in new tab)</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
