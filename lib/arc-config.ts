// lib/arc-config.ts
// Tells App Kit about the Arc Testnet blockchain
import { defineChain } from 'viem';
export const arcTestnet = defineChain({
id: 2181,
name: 'Arc Testnet',
nativeCurrency: {
name: 'USDC',
symbol: 'USDC',
decimals: 6,
},
rpcUrls: {
default: {
http: [process.env.NEXT_PUBLIC_ARC_RPC_URL!],
},
},
blockExplorers: {
default: { name: 'ArcScan',
url: process.env.NEXT_PUBLIC_ARC_EXPLORER! },
},
testnet: true,
});