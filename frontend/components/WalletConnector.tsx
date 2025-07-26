'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function WalletConnector() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="wallet-connector">
      {isConnected ? (
        <div className="wallet-connected">
          <span className="text-green-500">Connected:</span>{' '}
          <span className="font-mono">{address}</span>
          <button
            onClick={() => disconnect()}
            className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="wallet-options">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded m-1"
              disabled={!connector.ready}
              title={!connector.ready ? "Connector not available" : ""}
            >
              Connect with {connector.name}
              {isLoading && pendingConnector?.id === connector.id && ' (connecting...)'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
