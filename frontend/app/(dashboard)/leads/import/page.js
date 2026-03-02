import { generateMetadata } from '@/lib/seo';
import FileUploader from './components/FileUploader';
import ColumnMapper from './components/ColumnMapper';
import ImportPreview from './components/ImportPreview';
import DedupeReport from './components/DedupeReport';

export const metadata = generateMetadata({
  title: 'Import Leads',
  description: 'Import leads from CSV and map columns with deduplication checks.',
  path: '/leads/import'
});

export default function ImportLeadsPage() {
  return (
    <div className="space-y-4">
      <h1>Import Leads</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <FileUploader />
        <ColumnMapper />
        <ImportPreview />
        <DedupeReport />
      </div>
    </div>
  );
}
