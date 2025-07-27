'use client';

import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { useBaseTokenList, TokenInfo } from "@/lib/useBaseTokenList";

interface TokenComboBoxProps {
  value: TokenInfo | null;
  onChange: (token: TokenInfo) => void;
}

export default function TokenComboBox({ value, onChange }: TokenComboBoxProps) {
  const tokens = useBaseTokenList();
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? tokens
      : tokens.filter(
          (t) =>
            t.symbol.toLowerCase().includes(query.toLowerCase()) ||
            t.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative mb-3">
        <Combobox.Input
          className="w-full rounded border px-3 py-2 text-black"
          displayValue={(t: TokenInfo) => t?.symbol || ""}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search token…"
        />
        <Combobox.Options className="absolute z-10 w-full mt-1 max-h-56 overflow-auto bg-white text-black rounded shadow-lg">
          {filtered.length === 0 && (
            <div className="px-4 py-2 text-gray-400">No token found.</div>
          )}
          {filtered.map((token) => (
            <Combobox.Option key={token.address} value={token}>
              {({ active, selected }) => (
                <div
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                    active ? "bg-blue-200" : ""
                  }`}
                >
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-6 h-6 rounded-full border"
                  />
                  <span className="font-bold">{token.symbol}</span>
                  <span className="text-xs text-gray-500 ml-2">{token.name}</span>
                  {selected && <span className="ml-auto text-blue-600 font-bold">✔</span>}
                </div>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
