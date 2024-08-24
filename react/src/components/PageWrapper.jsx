//Title component/wrapper for labeled pages
export default function PageWrapper({ title, children }) {
  return (
    <div className="">
      {/* <h1 className="text-3xl font-bold">{title}</h1> */}
      <div className="md:m-6">{children}</div>
    </div>
  );
}
