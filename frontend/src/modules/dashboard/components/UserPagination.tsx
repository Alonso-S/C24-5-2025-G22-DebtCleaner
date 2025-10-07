interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

export const UserPagination = ({ currentPage, totalPages, paginate }: UserPaginationProps) => {
  return (
    <div className="mt-8 flex justify-between items-center">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
      >
        Anterior
      </button>
      <span className="text-md text-gray-700 font-medium">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>
  );
};