/**
 * 키보드 단축키 안내 컴포넌트
 */
function KeyboardShortcuts({ shortcuts }) {
  return (
    <div className="mt-6 glass-subtle rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-gray-300">키보드 단축키</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcuts.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {group.category}
            </h4>
            <div className="space-y-1.5">
              {group.items.map((shortcut, index) => (
                <div key={index} className="flex items-center gap-2">
                  <kbd className="glass-button px-2 py-1 rounded text-xs font-mono text-gray-200 min-w-[90px] text-center">
                    {shortcut.key}
                  </kbd>
                  <span className="text-xs text-gray-400">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KeyboardShortcuts;

