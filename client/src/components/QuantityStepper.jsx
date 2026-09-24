export default function QuantityStepper({ value, onChange }) {
  return (
    <div className="stepper" aria-label="Количество порций">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
