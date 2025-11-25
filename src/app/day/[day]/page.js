import Link from 'next/link';
import { notFound } from 'next/navigation';
import UnlockStickerClient from '../../../components/UnlockStickerClient';
import { getAllDays, getDay } from '../../../lib/days';

export function generateStaticParams() {
  return getAllDays().map((day) => ({ day: day.day.toString() }));
}

export async function generateMetadata({ params }) {
  const resolved = await params;
  const day = getDay(resolved.day);
  if (!day) return {};
  return {
    title: `Day ${day.day} — The Christmas Build-Up`,
    description: 'Daily Advent reading from Faith in Kids.',
  };
}

// Days that have "With Copyright" images
const DAYS_WITH_COPYRIGHT_IMAGES = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24];

export default async function DayPage({ params }) {
  const resolved = await params;
  const day = getDay(resolved.day);
  if (!day) {
    notFound();
  }

  // Determine hero image source - always use "With Copyright" images when available
  let heroImageSrc = null;
  if (!day.video) {
    // If day has a "With Copyright" image, always use it (ensure day.day is a number)
    const dayNumber = Number(day.day);
    if (DAYS_WITH_COPYRIGHT_IMAGES.includes(dayNumber)) {
      heroImageSrc = `/img/With Copyright/${dayNumber}.png`;
    } else {
      // For days without "With Copyright" images, use heroImage or picture
      // (even if it's a placeholder, as some days don't have images)
      heroImageSrc = day.heroImage || day.picture || null;
    }
  }

  return (
    <div className="day-page">
      <UnlockStickerClient day={day.day} />
      <h1 className="day-heading">Day {day.day}</h1>
      <div className="day-content">
        <article className="row entry-content text-center day-entry-card">
          {day.video ? (
            <div className="video-container">
              <iframe
                className="advent-video"
                width="100%"
                height="auto"
                src={day.video}
                title={`Day ${day.day} video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : heroImageSrc ? (
            <img 
              className="img-fluid" 
              src={heroImageSrc}
              alt={`Day ${day.day}`}
            />
          ) : null}

          {day.colouring && (
            <div className="thumbnail-container" style={{ textAlign: 'center', maxWidth: 400, margin: '1.5rem auto' }}>
              <a href={day.colouring} download className="btn btn-danger" style={{ textDecoration: 'none' }}>
                <i className="fa fa-download" aria-hidden></i> Download activity
              </a>
            </div>
          )}

          {day.podcast && (
            <div className="p-4">
              <audio controls>
                <source src={day.podcast} />
              </audio>
            </div>
          )}

          {day.scriptureHtml && (
            <div className="scripture-container">
              <img src="/img/bible.svg" alt="Bible icon" className="svg-icon" />
              <div>
                <p className="scripture" dangerouslySetInnerHTML={{ __html: day.scriptureHtml }} />
                {day.scriptureRef && <p className="reference">{day.scriptureRef}</p>}
              </div>
            </div>
          )}

          {day.discussionHtml && (
            <div className="discussion-container">
              <img src="/img/discussion.png" alt="Discussion icon" className="png-icon" />
              <div>
                <p className="discussion" dangerouslySetInnerHTML={{ __html: day.discussionHtml }} />
              </div>
            </div>
          )}
        </article>

        <div className="row text-white sticker-collection pb-4 day-sticker-row">
          <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="sticker-text-container">
              <h3 className="sticker-text">Click to collect your digital sticker and build up your own nativity scene</h3>
            </div>
            <div className="sticker-circle">
              <Link href={`/stickerbook/?unlock=${day.day}`}>
                <img className="img-fluid" src={day.stickerImage} alt={`Sticker for day ${day.day}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-ctas" style={{ justifyContent: 'center' }}>
        <Link className="btn-secondary" href="/">
          Back to calendar
        </Link>
        <Link className="btn-primary" href={`/stickerbook/?unlock=${day.day}`}>
          Place today&apos;s sticker
        </Link>
      </div>
    </div>
  );
}
