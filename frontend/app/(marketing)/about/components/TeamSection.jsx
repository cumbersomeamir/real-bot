const team = [
  { name: 'Aarav Mehta', role: 'Co-Founder & CEO' },
  { name: 'Naina Kapoor', role: 'Head of Product' },
  { name: 'Rohan Iyer', role: 'Head of AI Systems' },
  { name: 'Sanya Verma', role: 'Revenue Operations Lead' }
];

export default function TeamSection() {
  return (
    <section>
      <h3>Team</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {team.map((member) => (
          <div key={member.name} className="surface-card p-4">
            <p className="font-semibold">{member.name}</p>
            <p className="text-sm text-slate-400">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
