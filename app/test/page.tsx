export default function TestPage() {
  return (
    <div className="bg-red-500 text-white p-8 m-4">
      <h1 className="text-4xl font-bold">Test Page</h1>
      <p className="text-xl mt-4 bg-blue-500 p-4 rounded-lg">
        If you can see red background and white text, Tailwind is working!
      </p>
      <div className="bg-green-500 p-4 mt-4 rounded">
        This should be green
      </div>
      <div className="bg-slate-900 text-slate-100 p-4 mt-4 rounded">
        This should be dark slate with light text
      </div>
    </div>
  );
}
