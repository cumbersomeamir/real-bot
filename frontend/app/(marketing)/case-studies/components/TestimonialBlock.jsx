const quotes = [
  '“Our response SLA dropped from hours to minutes and closures went up within weeks.” — VP Sales, Pune Developer',
  '“The reactivation engine paid for itself in one quarter.” — Director, NCR Group',
  '“Broker accountability completely changed team behavior.” — Sales Head, Bengaluru Project'
];

export default function TestimonialBlock() {
  return (
    <div className="space-y-3">
      {quotes.map((quote) => (
        <blockquote key={quote} className="surface-card p-4 text-slate-200">
          {quote}
        </blockquote>
      ))}
    </div>
  );
}
