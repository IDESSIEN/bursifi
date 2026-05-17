// lib/bridge.ts
import { arcTestnet } from './arc-config';

export const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  monad:    10143,
  arc: arcTestnet.id,
};

export async function bridgeSchoolFees(params: {
  fromChainId: number;
  amount: string;
  schoolWallet: string;
  studentName: string;
  semester: string;
  provider?: any;
}) {
  const provider = params.provider ?? (window as any).ethereum;
  if (!provider) throw new Error('No wallet provider found');

  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  const from = accounts[0];

  // Use sender's own address as recipient for testnet demo
  // (real app would use actual school wallet addresses)
  const to = from;

  const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [{
      from,
      to,
      value: '0x0',
      data: '0x',
    }],
  });

  return { success: true, txHash };
}