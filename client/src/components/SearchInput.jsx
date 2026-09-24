export default function SearchInput({ value, onChange }) {
  return (
    <div className="search-input">
      <span aria-hidden="true">⌕</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Найти блюдо" aria-label="Поиск блюда" />
    </div>
  );
}
