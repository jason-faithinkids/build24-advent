import { notFound } from 'next/navigation';
import DayPage, { generateMetadata as baseGenerateMetadata } from '../../day/[day]/page';
import { getAllDays, getDay } from '../../../lib/days';

function parseDaySlug(slug) {
  if (typeof slug !== 'string' || !slug.startsWith('day')) {
    return null;
  }
  const numberPortion = slug.slice(3);
  const dayNumber = Number(numberPortion);
  if (!Number.isInteger(dayNumber) || dayNumber <= 0) {
    return null;
  }
  return dayNumber;
}

export function generateStaticParams() {
  return getAllDays().map((entry) => ({
    daySlug: `day${entry.day}`,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dayNumber = parseDaySlug(resolvedParams.daySlug);
  if (!dayNumber) {
    return {};
  }
  return baseGenerateMetadata({
    params: Promise.resolve({ day: dayNumber.toString() }),
  });
}

export default async function LegacyDayPage({ params }) {
  const resolvedParams = await params;
  const dayNumber = parseDaySlug(resolvedParams.daySlug);

  if (!dayNumber) {
    notFound();
  }

  const day = getDay(dayNumber);
  if (!day) {
    notFound();
  }

  return DayPage({
    params: Promise.resolve({ day: dayNumber.toString() }),
  });
}

