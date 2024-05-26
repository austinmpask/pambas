export default function PageContent({ title, children }) {
  return (
    <div className="m-6">
      <h1 className="title">{title}</h1>
      <div className="m-6">{children}</div>
    </div>
  );
}
