import Breadcrumbs from './Breadcrumbs.jsx';
export default function PageHeader({ eyebrow, title, text, current, actions }) {
  return (
    <section className="page-header container">
      <div>
        {current && <Breadcrumbs current={current} />}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </section>
  );
}
