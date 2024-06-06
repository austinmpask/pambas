//Title component/wrapper for labeled pages
export default function PageWrapper({ title, children }) {
  return (
    <div className="m-6">
      <h1 className="title">{title}</h1>
      <div className="m-6">{children}</div>
    </div>
  );
}
