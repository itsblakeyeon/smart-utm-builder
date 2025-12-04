/**
 * Saved Tab 테이블의 헤더 컴포넌트
 * 전체 선택 체크박스와 컬럼 헤더를 렌더링
 */
function SavedTableHeader({ allSelected, onToggleSelectAll }) {
  return (
    <thead className="bg-white/5 backdrop-blur-sm">
      <tr>
        <th className="px-3 py-3 text-center text-gray-200 text-xs font-semibold border-r border-b border-white/10">
          <input
            type="checkbox"
            onChange={onToggleSelectAll}
            checked={allSelected}
            className="w-4 h-4 cursor-pointer accent-gray-500"
          />
        </th>
        <th className="px-3 py-3 text-center text-gray-200 text-xs font-semibold border-r border-b border-white/10">
          #
        </th>
        <th className="px-3 py-3 text-left text-gray-200 text-xs font-semibold border-r border-b border-white/10">
          Source
        </th>
        <th className="px-3 py-3 text-left text-gray-200 text-xs font-semibold border-r border-b border-white/10">
          Medium
        </th>
        <th className="px-3 py-3 text-left text-gray-200 text-xs font-semibold border-r border-b border-white/10">
          Campaign
        </th>
        <th className="px-3 py-3 text-left text-gray-200 text-xs font-semibold border-r border-b border-white/10">
          Term
        </th>
        <th className="px-3 py-3 text-left text-gray-200 text-xs font-semibold border-r border-b border-white/10">
          Content
        </th>
        <th className="px-3 py-3 text-left text-gray-200 text-xs font-semibold border-r border-b border-white/10">
          생성된 URL
        </th>
        <th className="px-3 py-3 text-left text-gray-200 text-xs font-semibold border-b border-white/10">
          코멘트
        </th>
      </tr>
    </thead>
  );
}

export default SavedTableHeader;

