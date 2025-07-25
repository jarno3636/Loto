
import Hero from "../components/Hero";
import PoolCard from "../components/PoolCard";

export default function HomePage() {
  return (
    <div className="px-6 py-10 space-y-10">
      <Hero />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((id) => (
          <PoolCard key={id} poolId={id} />
        ))}
      </div>
    </div>
  );
}
