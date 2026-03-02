export default function BlogContent({ markdown }) {
  const lines = markdown.split('\n');
  return (
    <article className="prose prose-invert max-w-none">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) return <h1 key={idx}>{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={idx}>{line.replace('## ', '')}</h2>;
        if (line.startsWith('- ')) return <li key={idx}>{line.replace('- ', '')}</li>;
        if (/^\d+\.\s/.test(line)) return <p key={idx}>{line}</p>;
        return line ? <p key={idx}>{line}</p> : <br key={idx} />;
      })}
    </article>
  );
}
