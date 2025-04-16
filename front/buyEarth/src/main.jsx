import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// RainbowKit和Wagmi配置
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MONAD_TESTNET,ANVIL_CHAIN, isProduction } from './config';

// 根据环境选择链
const chains = isProduction() 
  ? [MONAD_TESTNET] // 生产环境使用Monad Testnet
  : [ANVIL_CHAIN];   // 开发环境使用Anvil本地链

// 配置链和提供者 - 增加多个提供者以提高可靠性
const { publicClient, webSocketPublicClient } = configureChains(
  chains,
  [
    // 直接连接到本地节点
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
    publicProvider(),
  ]
);

// 使用一个有效的WalletConnect projectId
// 注意：以下ID是从WalletConnect官方申请的示例ID
// 生产环境应该从 https://cloud.walletconnect.com/ 获取自己的ID
const projectId = "c9924a37c2a0e54ac3b7750c9de37ae1"; 

// 配置钱包
const { connectors } = getDefaultWallets({
  appName: '像素格子',
  projectId: projectId,
  chains
});

// 创建Wagmi配置
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// 添加开发模式提示
console.log('应用正在连接到:', chains[0].name);
console.log('RPC URL:', chains[0].rpcUrls.default.http[0]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);