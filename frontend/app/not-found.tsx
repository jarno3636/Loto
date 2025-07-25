// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-slate-400 mb-6">The page you’re looking for doesn’t exist.</p>
      <a
        href="/"
        className="bg-white text-slate-950 px-6 py-2 rounded-md font-semibold hover:bg-slate-200 transition"
      >
        Go back home
      </a>
    </div>
  );
}
