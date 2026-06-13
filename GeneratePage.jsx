import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserStore } from '../store/userStore';
import { Wand2, Copy, Download, Share2 } from 'lucide-react';

export default function GeneratePage() {
  const { idToken } = useAuth();
  const { generateApp, remainingCredits } = useUserStore();
  const [prompt, setPrompt] = useState('');
  const [appName, setAppName] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (remainingCredits < 1) {
      setError('Insufficient credits. Please upgrade your plan.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      const result = await generateApp(prompt, appName, idToken);
      setGeneratedCode(result.generatedCode);
      setPrompt('');
      setAppName('');
    } catch (err) {
      setError(err.message || 'Failed to generate app');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Code copied to clipboard!');
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedCode], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${appName || 'app'}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-2">Generate App</h1>
        <p className="text-slate-400 mb-8">Describe your app idea and let AI create it for you</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <form onSubmit={handleGenerate} className="card">
              <h2 className="text-xl font-bold text-white mb-4">Your Idea</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  App Name (Optional)
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="My Awesome App"
                  className="input-field"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Describe Your App
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Create a todo list app with a clean dark theme, add button, delete button, and local storage..."
                  className="input-field min-h-32 resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Be specific about features, design, and functionality
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">
                  Credits remaining: <span className="text-indigo-400 font-semibold">{remainingCredits}</span>
                </span>
                <span className="text-xs text-slate-500">1 credit = 1 generation</span>
              </div>

              <button
                type="submit"
                disabled={loading || remainingCredits < 1}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 size={20} />
                {loading ? 'Generating...' : 'Generate App'}
              </button>
            </form>

            {/* Tips */}
            <div className="card mt-6">
              <h3 className="font-semibold text-white mb-3">💡 Tips for Better Results</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>✓ Be specific about features</li>
                <li>✓ Mention design preferences</li>
                <li>✓ Include color scheme ideas</li>
                <li>✓ Describe user interactions</li>
              </ul>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            {generatedCode ? (
              <div className="card">
                <h2 className="text-xl font-bold text-white mb-4">Generated App</h2>

                <div className="bg-slate-900 rounded-lg overflow-hidden mb-4 border border-slate-700">
                  <iframe
                    srcDoc={generatedCode}
                    title="Generated App Preview"
                    className="w-full h-96 border-none"
                    sandbox="allow-scripts"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCopyCode}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <Copy size={20} />
                    Copy Code
                  </button>
                  <button
                    onClick={handleDownloadCode}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    Download HTML
                  </button>
                  <button className="w-full btn-outline flex items-center justify-center gap-2">
                    <Share2 size={20} />
                    Publish & Share
                  </button>
                </div>

                <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <p className="text-xs text-indigo-300">
                    ✨ Your app is ready! You can copy the code, download it, or publish it to share with others.
                  </p>
                </div>
              </div>
            ) : (
              <div className="card text-center py-16">
                <Wand2 size={48} className="text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Create?</h3>
                <p className="text-slate-400">
                  Describe your app idea on the left and watch AI bring it to life
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
