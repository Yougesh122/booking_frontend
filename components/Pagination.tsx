export default function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const page = i + 1;

        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`rounded-md px-3 py-1 text-sm border ${
              current === page
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
