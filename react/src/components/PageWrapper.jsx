//Title component/wrapper for labeled pages
export default function PageWrapper({ title, children }) {
  return (
    <div data-theme="light" className="m-6 page-wrapper">
      <h1 className="title">{title}</h1>
      <div className="m-6">{children}</div>
    </div>
  );
}
