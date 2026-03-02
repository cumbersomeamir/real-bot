import JsonLd from '@/components/shared/JsonLd';

export default function SEOHead({ schema }) {
  if (!schema) return null;
  return <JsonLd data={schema} />;
}
