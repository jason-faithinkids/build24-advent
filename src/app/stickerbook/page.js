import { getStickerList } from '../../lib/days';
import StickerbookExperience from '../../components/StickerbookExperience';

export const metadata = {
  title: 'Sticker Book — The Christmas Build-Up',
};

export default function StickerbookPage() {
  const stickers = getStickerList();

  return (
    <div className="stickerbook-page">
      <StickerbookExperience stickers={stickers} />
    </div>
  );
}
