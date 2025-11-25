import Link from 'next/link';

export default function Header() {
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
