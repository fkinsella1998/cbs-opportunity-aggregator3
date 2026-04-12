export default function ChipSelect({
  options,
  selected,
  onChange,
  max,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max?: number;
}) {
  const atMax = max ? selected.length >= max : false;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        const disabled = !isSelected && atMax;
        return (
          <button
            key={option}
            type="button"
            onClick={() => {
              if (isSelected) {
                onChange(selected.filter((item) => item !== option));
              } else if (!disabled) {
                onChange([...selected, option]);
              }
            }}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-[0.08em] border rounded ${
              isSelected
                ? "bg-white text-black border-white"
                : "border-border text-text-secondary"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={disabled}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
