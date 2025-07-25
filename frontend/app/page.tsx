import HomePools from '../components/HomePools';

export default function Page() {
  return (
    <main>
      <div className="text-center py-12">
        <h1 className="text-5xl font-extrabold">Welcome to Loto 🌀</h1>
        <p className="text-xl mt-4 text-slate-300">
          Join or create lottery pools with your favorite tokens on Base.
        </p>
      </div>

      <HomePools />
    </main>
  );
}
