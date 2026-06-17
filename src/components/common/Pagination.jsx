import { useState, useEffect } from "react";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showRowPerPage = false,
}) => {
  const [itemsPerPageState, setItemsPerPageState] = useState(
    itemsPerPage ?? 10
  );

  useEffect(() => {
    if (
      itemsPerPage !== undefined &&
      itemsPerPage !== itemsPerPageState
    ) {
      setItemsPerPageState(itemsPerPage);
    }
  }, [itemsPerPage]);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setItemsPerPageState(value);

    if (onItemsPerPageChange) {
      onItemsPerPageChange(value);
    }
  };

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      }

      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (!currentPage || !totalPages) return null;

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-3 gap-3 w-full bg-white border-t-4 border-blue-600 rounded-b-lg shadow-sm">
      {/* Left Section */}
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-gray-700 font-medium text-sm">
          Showing {(currentPage - 1) * itemsPerPageState + 1} to{" "}
          {Math.min(currentPage * itemsPerPageState, totalItems)} of{" "}
          {totalItems} Entries
        </p>

        {showRowPerPage && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Rows per page:</span>

            <select
              value={itemsPerPageState}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[5, 10, 15, 20, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2 mx-2">
          {renderPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() =>
                typeof page === "number" && handlePageClick(page)
              }
              disabled={page === "..."}
              className={`
                w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  page === currentPage
                    ? "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
                    : page === "..."
                    ? "text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400"
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;