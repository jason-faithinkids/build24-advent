'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Draggable from 'react-draggable';

const STORAGE_POSITIONS = 'stickerbook_positions_v1';
const STORAGE_UNLOCKED = 'stickerbook_unlocked_v1';
const STORAGE_SIDEBAR = 'stickerbook_sidebar_open_v1';
const DEFAULT_SIZE = { width: 150, height: 150 };

function getCenteredPosition(container) {
  if (!container) return { x: 0, y: 0 };
  const { width, height } = container.getBoundingClientRect();
  return {
    x: width / 2 - DEFAULT_SIZE.width / 2,
    y: height / 2 - DEFAULT_SIZE.height / 2,
  };
}

export default function StickerbookExperience({ stickers }) {
  const boardRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [unlocked, setUnlocked] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [boardReady, setBoardReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkReady = () => {
      if (boardRef.current) {
        setBoardReady(true);
      }
    };
    checkReady();
    const resizeObserver = new ResizeObserver(() => checkReady());
    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }
    window.addEventListener('resize', checkReady);
    return () => {
      window.removeEventListener('resize', checkReady);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!boardReady || !dataLoaded) return;
    setPositions((prev) => {
      const next = { ...prev };
      let changed = false;
      unlocked.forEach((day) => {
        if (!next[day]) {
          next[day] = getCenteredPosition(boardRef.current);
          changed = true;
        }
      });
      if (changed) {
        persistPositions(next);
        return next;
      }
      return prev;
    });
  }, [boardReady, dataLoaded, unlocked]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedPositions = JSON.parse(localStorage.getItem(STORAGE_POSITIONS) || '{}');
    const storedUnlocked = JSON.parse(localStorage.getItem(STORAGE_UNLOCKED) || '[]');
    const storedSidebar = localStorage.getItem(STORAGE_SIDEBAR);

    setPositions(storedPositions);
    setUnlocked(storedUnlocked);
    if (storedSidebar !== null) {
      setSidebarOpen(storedSidebar === 'true');
    }
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    const url = new URL(window.location.href);
    const param = Number(url.searchParams.get('unlock'));
    if (!Number.isNaN(param)) {
      unlockSticker(param);
    }
  }, [dataLoaded]);

  useEffect(() => {
    if (typeof window === 'undefined' || !dataLoaded) return;
    localStorage.setItem(STORAGE_UNLOCKED, JSON.stringify(unlocked));
  }, [unlocked, dataLoaded]);

  useEffect(() => {
    if (typeof window === 'undefined' || !dataLoaded) return;
    localStorage.setItem(STORAGE_SIDEBAR, String(sidebarOpen));
  }, [sidebarOpen, dataLoaded]);

  const persistPositions = (next) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_POSITIONS, JSON.stringify(next));
    }
  };

  const ensurePosition = (day) => {
    setPositions((prev) => {
      if (prev[day]) return prev;
      const center = getCenteredPosition(boardRef.current);
      const next = { ...prev, [day]: center };
      persistPositions(next);
      return next;
    });
  };

  const unlockSticker = (day) => {
    if (!day) return;
    setUnlocked((prev) => {
      if (prev.includes(day)) return prev;
      const updated = [...prev, day];
      localStorage.setItem(STORAGE_UNLOCKED, JSON.stringify(updated));
      ensurePosition(day);
      return updated;
    });
  };

  const handleStart = () => {
    // Ensure drag starts immediately
  };

  const handleStop = (day, data) => {
    const next = { ...positions, [day]: { x: data.x, y: data.y } };
    setPositions(next);
    persistPositions(next);
  };

  useEffect(() => {
    if (!dataLoaded) return;
    unlocked.forEach((day) => ensurePosition(day));
  }, [unlocked, dataLoaded]);

  const nodeRefs = useMemo(() => {
    const refs = {};
    stickers.forEach((sticker) => {
      refs[sticker.day] = refs[sticker.day] || { current: null };
    });
    return refs;
  }, [stickers]);

  return (
    <div className={`stickerbook-wrapper${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      <div className="stickerbook-stage stickerbook-stage--inline">
        <div className="stickerbook-canvas" ref={boardRef}>
          <div id="stable">
            <img src="/img/stickers/stable_front.png" className="stable-bg" draggable="false" alt="Stable" />
          </div>

          <div id="stickers">
            {stickers.map((sticker) => (
              unlocked.includes(sticker.day) ? (
                <Draggable
                  key={sticker.day}
                  nodeRef={nodeRefs[sticker.day]}
                  bounds="parent"
                  position={positions[sticker.day] || { x: 0, y: 0 }}
                  onStart={handleStart}
                  onStop={(e, data) => handleStop(sticker.day, data)}
                  cancel=""
                  enableUserSelectHack={false}
                  defaultClassNameDragging="sticker-dragging"
                >
                  <div
                    ref={nodeRefs[sticker.day]}
                    className="sticker-piece"
                    style={{ width: DEFAULT_SIZE.width, height: DEFAULT_SIZE.height }}
                  >
                    <img src={sticker.image || '/img/stickers/stable-stickers/placeholder.png'} alt={sticker.label} draggable="false" />
                  </div>
                </Draggable>
              ) : null
            ))}
          </div>
        </div>
      </div>

      <aside className={`sticker-sidebar${sidebarOpen ? '' : ' is-collapsed'}`}>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? 'Hide stickers' : 'Show stickers'}
        </button>
        <div className="sidebar-content">
          <h2>Sticker Shelf</h2>
          <div className="sidebar-grid">
            {stickers.map((sticker) => (
              <div key={sticker.day} className={`sidebar-item${unlocked.includes(sticker.day) ? '' : ' locked'}`}>
                <div className="sidebar-thumb">
                  <img
                    src={unlocked.includes(sticker.day) ? sticker.image : '/img/stickers/stable-stickers/placeholder.png'}
                    alt={sticker.label}
                  />
                </div>
                <span>Day {sticker.day}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
