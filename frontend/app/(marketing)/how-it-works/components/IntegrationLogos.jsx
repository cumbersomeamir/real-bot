const logos = ['Meta Ads', 'Google Ads', 'WhatsApp Business', 'IndiaMART', 'Twilio', 'Zapier', 'n8n', 'PostgreSQL', 'AWS'];

export default function IntegrationLogos() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {logos.map((logo) => (
        <div key={logo} className="surface-card flex h-16 items-center justify-center text-sm text-slate-300">
          {logo}
        </div>
      ))}
    </div>
  );
}
