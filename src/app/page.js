import Link from 'next/link';
import { getAllDays } from '../lib/days';

const doorLayout = [
  1, 6, 11, 16, 21,
  2, 7, 12, 17, 22,
  3, 8, 13, 18, 23,
  4, 9, 14, 19, 24,
  5, 10, 15, 20,
];

export default function HomePage() {
  const days = getAllDays();
  const availableDays = new Set(days.map((d) => d.day));

  return (
    <div className="advent-home">
      <div className="advent-layout">
        <section id="calendar" className="calendar-panel-dark">
          <div className="calendar-scene">
            <img src="/img/cover_pic.jpg" alt="Lego nativity scene" className="calendar-bg" />
            <div className="calendar-doors">
              {doorLayout.map((day) => (
                <Link
                  key={day}
                  href={availableDays.has(day) ? `/day/${day}` : '#'}
                  className={`advent-door${availableDays.has(day) ? '' : ' lego-brick-inactive'}`}
                  aria-disabled={!availableDays.has(day)}
                >
                  {day}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="description-panel">
          <h1 className="main-title">The Christmas Build-Up</h1>
          <p className="main-description">
            Explore the Christmas story as a family during Advent through 24 simple, fun and manageable moments.
          </p>

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
