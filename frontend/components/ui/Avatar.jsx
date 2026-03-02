export default function Avatar({ name = 'User', src }) {
  if (src) {
    return <img src={src} alt={name} className="h-9 w-9 rounded-full object-cover" />;
  }
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-700 text-xs font-semibold text-white">
      {initials}
    </div>
  );
}
