import { useState } from "react";
import { Link } from "react-router-dom";
import BuilderTab from "../components/BuilderTab";
import SavedTab from "../components/SavedTab";
import UTMGuide from "../components/UTMGuide";
import { useLocalStorage } from "../hooks/useLocalStorage";

function UTMBuilderPage() {
  const [activeTab, setActiveTab] = useState("builder");
  const [savedItems, setSavedItems] = useLocalStorage("utmSavedItems", []);

  // 저장 항목 추가
  const handleSave = (newItems) => {
    setSavedItems([...savedItems, ...newItems]);
  };

  // 개별 삭제
  const handleDelete = (id) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setSavedItems(savedItems.filter((item) => item.id !== id));
    }
  };

  // 전체 삭제
  const handleDeleteAll = () => {
    if (confirm("모든 저장된 URL을 삭제하시겠습니까?")) {
      setSavedItems([]);
    }
  };

  // 선택 항목 일괄 삭제
  const handleDeleteSelected = (ids) => {
    if (confirm(`선택한 ${ids.length}개 항목을 삭제하시겠습니까?`)) {
      setSavedItems(savedItems.filter((item) => !ids.includes(item.id)));
    }
  };

  // 코멘트 업데이트
  const handleUpdateComment = (id, comment) => {
    setSavedItems(
      savedItems.map((item) => (item.id === id ? { ...item, comment } : item))
    );
  };

  return (
    <div className="min-h-screen relative z-10">
      <div className="container mx-auto py-8 relative z-10">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-4 glass px-4 py-2 rounded-xl shadow-lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Home
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">UTM Builder</h1>
            <p className="text-gray-300">UTM builder for everyone</p>
          </div>
        </div>

        {/* 탭 전환 UI */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-2xl glass-strong p-1.5 shadow-xl">
            <button
              onClick={() => setActiveTab("builder")}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "builder"
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Builder
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "saved"
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Saved ({savedItems.length})
            </button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === "builder" ? (
          <BuilderTab onSave={handleSave} />
        ) : (
          <SavedTab
            savedItems={savedItems}
            onDelete={handleDelete}
            onDeleteAll={handleDeleteAll}
            onDeleteSelected={handleDeleteSelected}
            onUpdateComment={handleUpdateComment}
          />
        )}

        <UTMGuide />
      </div>
    </div>
  );
}

export default UTMBuilderPage;
