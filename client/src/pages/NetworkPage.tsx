import { GitBranch, Lock } from 'lucide-react';

interface NetworkPageProps {
  badge?: unknown;
}

export function NetworkPage(_props: NetworkPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md">
        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <GitBranch className="w-8 h-8 text-cyan-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Network Visualization</h2>
        
        <p className="text-gray-400 mb-6">
          See your web of trust. Visualize who vouches for you, who you vouch for, 
          and how reputation flows through the network.
        </p>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Features:</h3>
          <ul className="text-sm text-gray-500 space-y-1 text-left">
            <li>• Interactive network graph</li>
            <li>• Stake flow visualization</li>
            <li>• Cascade damage paths</li>
          </ul>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-400">
          <Lock className="w-4 h-4" />
          Coming Soon
        </div>
      </div>
    </div>
  );
}
