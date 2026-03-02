export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <div className="section-wrap flex min-h-screen items-center justify-center py-10">{children}</div>
    </div>
  );
}
