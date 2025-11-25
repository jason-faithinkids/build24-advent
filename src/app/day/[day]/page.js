import Link from 'next/link';
import { notFound } from 'next/navigation';
import UnlockStickerClient from '../../../components/UnlockStickerClient';
import { getAllDays, getDay } from '../../../lib/days';

export function generateStaticParams() {
  return getAllDays().map((day) => ({ day: day.day.toString() }));
}

export function generateMetadata({ params }) {
  const day = getDay(params.day);
  if (!day) return {};
  return {
    title: `Day ${day.day} — The Christmas Build-Up`,
    description: 'Daily Advent reading from Faith in Kids.',
  };
}

export default function DayPage({ params }) {
  const day = getDay(params.day);
  if (!day) {
    notFound();
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
          ) : (
            <img className="img-fluid" src={day.heroImage || day.picture} alt={`Day ${day.day}`} />
          )}

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
