export function LastVerified({ date }: { date: string }) {
  return (
    <p className="verified">
      Last verified <time dateTime={date}>{date}</time>
    </p>
  );
}
