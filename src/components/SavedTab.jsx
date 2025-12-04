import { useState, useEffect } from "react";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import SavedTableHeader from "./SavedTableHeader";
import SavedTableRow from "./SavedTableRow";

function SavedTab({ savedItems, onDelete, onDeleteAll, onDeleteSelected, onUpdateComment }) {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editComment, setEditComment] = useState("");
  
  // 행 선택 상태 관리 (각 항목에 selected 속성 추가)
  const [itemsWithSelection, setItemsWithSelection] = useState(() =>
    savedItems.map((item) => ({ ...item, selected: false }))
  );

  // savedItems가 변경되면 itemsWithSelection도 업데이트
  useEffect(() => {
    setItemsWithSelection((prev) => {
      const prevMap = new Map(prev.map((item) => [item.id, item.selected]));
      return savedItems.map((item) => ({
        ...item,
        selected: prevMap.get(item.id) || false,
      }));
    });
  }, [savedItems]);

  // 토스트 알림 훅
  const { toast, showToast, hideToast } = useToast();

  // 코멘트 편집 시작
  const startEditComment = (item) => {
    setEditingCommentId(item.id);
    setEditComment(item.comment || "");
  };

  // 코멘트 저장
  const saveComment = (id) => {
    onUpdateComment(id, editComment);
    setEditingCommentId(null);
    setEditComment("");
  };

  // 코멘트 편집 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditComment("");
  };

  // 코멘트 편집 값 업데이트
  const updateEditComment = (value) => {
    setEditComment(value);
  };

  // 행 선택 토글
  const toggleSelect = (id) => {
    setItemsWithSelection((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    const allSelected = itemsWithSelection.every((item) => item.selected);
    setItemsWithSelection((prev) =>
      prev.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  // 선택된 항목 일괄 삭제
  const handleDeleteSelected = () => {
    const selectedItems = itemsWithSelection.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      showToast("삭제할 항목을 선택해주세요!", "warning");
      return;
    }
    onDeleteSelected(selectedItems.map((item) => item.id));
  };

  // 전체 선택 여부 확인
  const allSelected =
    itemsWithSelection.length > 0 &&
    itemsWithSelection.every((item) => item.selected);

  // 선택된 행이 있는지 확인
  const hasSelectedRows = itemsWithSelection.some((item) => item.selected);

  if (savedItems.length === 0) {
    return (
      <div className="max-w-full mx-auto p-6">
        <div className="glass-strong rounded-2xl p-12 text-center shadow-xl">
          <p className="text-gray-200 text-lg">저장된 URL이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">
            Builder 탭에서 URL을 선택하고 저장해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-6">
      {/* 컨트롤 버튼들 */}
      <div className="mb-4 flex gap-3 items-center">
        {/* 우측으로 밀기 */}
        <div className="flex-1"></div>

        {/* 선택 관련 */}
        <button
          onClick={toggleSelectAll}
          className="glass-button glass-button-purple text-white px-4 py-2 rounded-xl font-medium shadow-lg"
        >
          {allSelected ? "전체 해제" : "전체 선택"}
        </button>

        {/* 구분선 */}
        <div className="h-8 w-px bg-white/10"></div>

        {/* 선택된 항목 액션 */}
        <button
          onClick={handleDeleteSelected}
          disabled={!hasSelectedRows}
          className={`glass-button glass-button-red text-white px-4 py-2 rounded-xl font-medium shadow-lg ${
            !hasSelectedRows ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="선택한 항목 삭제"
        >
          선택 삭제
        </button>
      </div>

      {/* 테이블 형식 */}
      <div className="overflow-x-auto rounded-2xl glass-strong shadow-2xl">
        <table className="w-full">
          <SavedTableHeader
            allSelected={allSelected}
            onToggleSelectAll={toggleSelectAll}
          />
          <tbody>
            {itemsWithSelection.map((item, index) => (
              <SavedTableRow
                key={item.id}
                item={item}
                index={index}
                isSelected={item.selected}
                onToggleSelect={toggleSelect}
                editingCommentId={editingCommentId}
                editComment={editComment}
                onStartEditComment={startEditComment}
                onSaveComment={saveComment}
                onCancelEditComment={cancelEditComment}
                onUpdateEditComment={updateEditComment}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 토스트 알림 */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}

export default SavedTab;
