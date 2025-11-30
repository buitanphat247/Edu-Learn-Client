interface ContentHeaderProps {
  title: string;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const gradeFilters = [
  "Tất cả",
  "Khối 1",
  "Khối 2",
  "Khối 3",
  "Khối 4",
  "Khối 5",
  "Khối 6",
  "Khối 7",
  "Khối 8",
  "Khối 9",
  "Khối 10",
  "Khối 11",
  "Khối 12",
  "Khác",
];

export default function ContentHeader({ title, activeFilter, onFilterChange }: ContentHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-300">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {gradeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

