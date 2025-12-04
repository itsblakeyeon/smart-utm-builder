import { buildUTMUrl } from "../utils/urlBuilder";
import UTMTableInput from "./UTMTableInput";
import { FIELD_CONFIG } from "../constants";

/**
 * UTM 테이블의 개별 행을 렌더링하는 컴포넌트
 */
function UTMTableRow({
  row,
  index,
  editingCell,
  selectedCell,
  selectedCellRange,
  selectedRowIndex,
  selectedRange,
  onToggleSelect,
  onChange,
  onInputFocus,
  onKeyDown,
  onCellSelectionKeyDown,
  onCompositionStart,
  onCompositionEnd,
  onCopyUrl,
  onTestUrl,
  onRowSelectionKeyDown,
  onCellClick,
}) {
  const generatedUrl = buildUTMUrl(row);

  // 범위 선택 내에 있는지 확인
  const isInRange =
    selectedRange &&
    index >= Math.min(selectedRange.start, selectedRange.end) &&
    index <= Math.max(selectedRange.start, selectedRange.end);

  // 행이 선택되었는지 확인 (단일 선택 또는 범위 선택)
  const isRowSelected = selectedRowIndex === index || isInRange;

  return (
    <tr
      key={row.id}
      data-row-index={index}
      tabIndex={isRowSelected ? 0 : -1}
      onKeyDown={(e) => isRowSelected && onRowSelectionKeyDown(e, index)}
      className={`transition-all duration-200 ${
        isRowSelected
          ? "bg-white/10 ring-2 ring-white/20 backdrop-blur-sm"
          : "hover:bg-white/5"
      }`}
    >
      {/* 체크박스 */}
      <td className="px-3 py-2 text-center border-r border-b border-white/10">
        <input
          type="checkbox"
          checked={row.selected || false}
          onChange={() => onToggleSelect(row.id)}
          className="w-4 h-4 cursor-pointer accent-gray-500"
        />
      </td>

      {/* 행 번호 */}
      <td className="px-3 py-2 text-center text-gray-200 text-sm border-r border-b border-white/10">
        {index + 1}
      </td>

      {/* 입력 필드들 */}
      {FIELD_CONFIG.map((field) => {
        // 단일 셀 선택 확인
        const isCellSelected =
          selectedCell &&
          selectedCell.rowIndex === index &&
          selectedCell.field === field.key;

        // 셀 범위 선택 내에 있는지 확인
        const isInCellRange =
          selectedCellRange &&
          index >=
            Math.min(
              selectedCellRange.start.rowIndex,
              selectedCellRange.end.rowIndex
            ) &&
          index <=
            Math.max(
              selectedCellRange.start.rowIndex,
              selectedCellRange.end.rowIndex
            );

        // 필드가 범위 내에 있는지 확인
        const currentFieldIndex = FIELD_CONFIG.findIndex((f) => f.key === field.key);
        const startFieldIndex = selectedCellRange
          ? FIELD_CONFIG.findIndex((f) => f.key === selectedCellRange.start.field)
          : -1;
        const endFieldIndex = selectedCellRange
          ? FIELD_CONFIG.findIndex((f) => f.key === selectedCellRange.end.field)
          : -1;

        const isFieldInRange =
          selectedCellRange &&
          currentFieldIndex >= Math.min(startFieldIndex, endFieldIndex) &&
          currentFieldIndex <= Math.max(startFieldIndex, endFieldIndex);

        const isCellInRange = isInCellRange && isFieldInRange;

        // 편집 모드 확인
        const isEditing =
          editingCell &&
          editingCell.rowIndex === index &&
          editingCell.field === field.key;

        return (
          <td
            key={field.key}
            className={`px-2 py-1 border-r border-b border-white/10 ${
              isCellSelected || isCellInRange
                ? "bg-white/10 ring-1 ring-white/20 backdrop-blur-sm"
                : ""
            }`}
          >
            <UTMTableInput
              value={row[field.key]}
              field={field.key}
              rowId={row.id}
              rowIndex={index}
              placeholder={field.placeholder}
              onChange={onChange}
              onFocus={onInputFocus}
              onKeyDown={
                isEditing
                  ? onKeyDown  // 편집 모드: 일반 키보드 네비게이션
                  : (isCellSelected || isCellInRange)
                    ? (e) => onCellSelectionKeyDown(e, index, field.key)  // 셀 선택 모드
                    : onKeyDown  // 기본
              }
              onCompositionStart={onCompositionStart}
              onCompositionEnd={onCompositionEnd}
              isEditing={isEditing}
              isCellSelected={isCellSelected}
              onCellClick={onCellClick}
            />
          </td>
        );
      })}

      {/* 생성된 URL */}
      <td
        className={`px-2 py-1 border-r border-b border-white/10 ${
          isRowSelected ? "" : "bg-white/2"
        }`}
      >
        <div
          className={`text-sm max-w-sm overflow-x-auto whitespace-nowrap ${
            generatedUrl ? "text-gray-200" : "text-gray-500 italic"
          }`}
        >
          {generatedUrl || ""}
        </div>
      </td>

      {/* 액션 버튼 */}
      <td className="px-2 py-1 border-b border-white/10">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onCopyUrl(row)}
            disabled={!generatedUrl}
            className="glass-button text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            title="URL 복사"
            aria-label="URL 복사"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={() => onTestUrl(row)}
            disabled={!generatedUrl}
            className="glass-button glass-button-green text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            title="새 탭에서 열기"
            aria-label="새 탭에서 열기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UTMTableRow;
