import days from '../../data/days.json';

export function getAllDays() {
  return days;
}

export function getDay(day) {
  const dayNumber = Number(day);
  return days.find((entry) => entry.day === dayNumber);
}

export function getStickerList() {
  return days.map((entry) => ({
    day: entry.day,
    image: entry.stickerImage,
    label: `Day ${entry.day}`,
  }));
}
