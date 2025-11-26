'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllDays } from '../lib/days';

const TOTAL_DECEMBER_DAYS = 24;
const DECEMBER_MONTH_INDEX = 11;

const doorLayout = [
  1, 6, 11, 16, 21,
  2, 7, 12, 17, 22,
  3, 8, 13, 18, 23,
  4, 9, 14, 19, 24,
  5, 10, 15, 20,
];

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

export default function HomePage() {
  const days = getAllDays();
  const availableDays = new Set(days.map((d) => d.day));

  const [unlockedThrough, setUnlockedThrough] = useState(0);

  useEffect(() => {
    setUnlockedThrough(getUnlockedDayNumber());
  }, []);

  const showPreDecemberNotice = unlockedThrough === 0;
  const isDayUnlocked = (day) => availableDays.has(day) && day <= unlockedThrough;

  return (
    <div className="advent-home">
      <div className="advent-layout">
        <section id="calendar" className="calendar-panel-dark">
          <div className="calendar-scene">
            <img src="/img/cover_pic.jpg" alt="Lego nativity scene" className="calendar-bg" />
            <div className="calendar-doors">
              {doorLayout.map((day) => {
                const unlocked = isDayUnlocked(day);
                return (
                  <Link
                    key={day}
                    href={unlocked ? `/day/${day}` : '#'}
                    className={`advent-door${unlocked ? '' : ' lego-brick-inactive'}`}
                    aria-disabled={!unlocked}
                  >
                    <span className="door-label">{day}</span>
                    {!unlocked && (
                      <>
                        <span className="door-lock" aria-hidden="true">
                          <i className="fas fa-lock" />
                        </span>
                        <span className="sr-only">Locked until December {day}</span>
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="description-panel">
          <h1 className="main-title">The Christmas Build-Up</h1>
          <p className="main-description">
            Explore the Christmas story as a family during Advent through 24 simple, fun and manageable moments.
          </p>
          {showPreDecemberNotice && (
            <p className="availability-notice" role="status">
              Come back on the 1st December to open the first box!
            </p>
          )}

          <h2 className="section-title">Each week follows the same pattern of content:</h2>
          <ul className="content-list">
            <li><strong>Monday</strong> - Lego video</li>
            <li><strong>Tue-Fri</strong> - Bible verses with questions</li>
            <li><strong>Sat</strong> - podcast</li>
            <li><strong>Sun</strong> - activity and reflection</li>
          </ul>

          <h2 className="section-title section-title-pill">How to use this page:</h2>
          <ul className="content-list">
            <li>Find today&apos;s door</li>
            <li>Click to reveal the next part of the story, activity and prayer.</li>
            <li>Unlock a new character each day for your Sticker Book</li>
          </ul>

          <div className="hero-ctas">
            <Link href="/day/1" className="btn-primary">
              Start with Day 1
            </Link>
            <Link href="/stickerbook/" className="btn-secondary">
              Visit Sticker Book
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
