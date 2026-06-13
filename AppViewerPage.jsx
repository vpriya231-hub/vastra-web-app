import { useParams } from 'react-router-dom';
import { Share2, Download } from 'lucide-react';

export default function AppViewerPage() {
  const { appId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">V Astra Create - App Viewer</h1>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Share2 size={16} />
              Share
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-64px)]">
        <iframe
          title="Generated App"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms"
          src={`/api/app/${appId}`}
        />
      </div>
    </div>
  );
}
