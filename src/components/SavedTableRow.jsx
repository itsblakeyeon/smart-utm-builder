/**
 * Saved Tab 테이블의 개별 행을 렌더링하는 컴포넌트
 */
function SavedTableRow({
  item,
  index,
  isSelected,
  onToggleSelect,
  editingCommentId,
  editComment,
  onStartEditComment,
  onSaveComment,
  onCancelEditComment,
  onUpdateEditComment,
}) {
  const isEditing = editingCommentId === item.id;

  return (
    <tr
      className={`transition-all duration-200 ${
        isSelected ? "bg-white/10 ring-2 ring-white/20 backdrop-blur-sm" : "hover:bg-white/5"
      }`}
    >
      {/* 체크박스 */}
      <td className="px-3 py-2 text-center border-r border-b border-white/10">
        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={() => onToggleSelect(item.id)}
          className="w-4 h-4 cursor-pointer accent-gray-500"
        />
      </td>

      {/* 행 번호 */}
      <td className="px-3 py-2 text-center text-gray-200 text-sm border-r border-b border-white/10">
        {index + 1}
      </td>

      {/* Source */}
      <td className="px-2 py-1 border-r border-b border-white/10">
        <div className="text-sm text-white">{item.params.source || "-"}</div>
      </td>

      {/* Medium */}
      <td className="px-2 py-1 border-r border-b border-white/10">
        <div className="text-sm text-white">{item.params.medium || "-"}</div>
      </td>

      {/* Campaign */}
      <td className="px-2 py-1 border-r border-b border-white/10">
        <div className="text-sm text-white">{item.params.campaign || "-"}</div>
      </td>

      {/* Term */}
      <td className="px-2 py-1 border-r border-b border-white/10">
        <div className="text-sm text-gray-300">
          {item.params.term || "-"}
        </div>
      </td>

      {/* Content */}
      <td className="px-2 py-1 border-r border-b border-white/10">
        <div className="text-sm text-gray-300">
          {item.params.content || "-"}
        </div>
      </td>

      {/* 생성된 URL */}
      <td
        className={`px-2 py-1 border-r border-b border-white/10 ${
          isSelected ? "" : "bg-white/2"
        }`}
      >
        <div className="text-sm max-w-sm overflow-x-auto whitespace-nowrap text-gray-200">
          {item.fullUrl || ""}
        </div>
      </td>

      {/* 코멘트 */}
      <td className="px-2 py-1 border-b border-white/10">
        {isEditing ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={editComment}
              onChange={(e) => onUpdateEditComment(e.target.value)}
              placeholder="코멘트를 입력하세요"
              className="flex-1 glass-input text-gray-200 px-2 py-1 rounded-lg text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSaveComment(item.id);
                } else if (e.key === "Escape") {
                  onCancelEditComment();
                }
              }}
            />
            <button
              onClick={() => onSaveComment(item.id)}
              className="glass-button glass-button-green text-white px-2 py-1 rounded-lg text-xs"
              title="저장 (Enter)"
            >
              저장
            </button>
            <button
              onClick={onCancelEditComment}
              className="glass-button text-white px-2 py-1 rounded-lg text-xs"
              title="취소 (Esc)"
            >
              취소
            </button>
          </div>
        ) : (
          <div
            onClick={() => onStartEditComment(item)}
            className="glass-subtle text-gray-200 px-2 py-1 rounded-lg cursor-pointer hover:border-white/30 transition duration-200 text-sm min-h-[28px] flex items-center"
          >
            {item.comment || "코멘트를 추가하려면 클릭하세요"}
          </div>
        )}
      </td>
    </tr>
  );
}

export default SavedTableRow;

