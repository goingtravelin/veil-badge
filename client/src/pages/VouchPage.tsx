
import { Users, Lock } from 'lucide-react';

interface VouchPageProps {
  badge?: unknown;
  currentBlock?: number;
  onVouch?: unknown;
  onUnvouch?: unknown;
}

export function VouchPage(_props: VouchPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-8 h-8 text-purple-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Vouch Network</h2>
        
        <p className="text-gray-400 mb-6">
          Stake your reputation on people you trust. When they succeed, you both benefit. 
          When they fail, you share the damage.
        </p>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-2">How it works:</h3>
          <ul className="text-sm text-gray-500 space-y-1 text-left">
            <li>• Vouch for others with a stake percentage</li>
            <li>• Receive network bonus from incoming vouches</li>
            <li>• Cascade damage flows through vouch chains</li>
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
