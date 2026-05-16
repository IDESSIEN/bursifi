import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    arcTestnet: {
      type: "http",
      url: process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.arc-testnet.network',
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};

export default config;