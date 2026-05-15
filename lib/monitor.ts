// lib/monitor.ts — watches the escrow contract for payment events
import { createPublicClient, http, parseAbi } from 'viem';
import { arcTestnet } from './arc-config';
const client = createPublicClient({
chain: arcTestnet,
transport: http(),
});
const escrowAbi = parseAbi([
'event Deposited(bytes32 id, address school, uint256 amount)',
'event Released(bytes32 id, address school, uint256 amount)',
]);
// Call this to start watching. Returns an unwatch() function.
export function watchPayments(onDeposit: (log: any) => void) {
return client.watchContractEvent({
address: process.env.NEXT_PUBLIC_ESCROW_ADDRESS as `0x${string}`,
abi: escrowAbi,
eventName: 'Deposited',
onLogs: (logs) => logs.forEach(onDeposit),
});
}