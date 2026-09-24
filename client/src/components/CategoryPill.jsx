export default function CategoryPill({ active, children, ...props }) {
  return <button className={`category-pill ${active ? 'active' : ''}`} {...props}>{children}</button>;
}
