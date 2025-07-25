import Head from 'next/head';
import CreatePool from '../components/CreatePool';
import PoolCard from '../components/PoolCard';

export default function Home() {
  return (
    <div className="p-6">
      <Head>
        <title>Loto App</title>
        <meta name="description" content="Decentralized Lottery DApp" />
      </Head>

      <h1 className="text-3xl font-bold mb-4">🎯 Loto Pools</h1>
      <CreatePool />

      <div className="grid gap-6 mt-6">
        {/* Example pool IDs: 0, 1, 2 */}
        {[0, 1, 2].map((id) => (
          <PoolCard key={id} poolId={id} />
        ))}
      </div>
    </div>
  );
}
