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
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

// 配置链和提供者
const { chains, publicClient } = configureChains(
  [mainnet, sepolia, hardhat],
  [publicProvider()]
);

// 设置钱包
const { connectors } = getDefaultWallets({
  appName: '像素格子',
  projectId: 'YOUR_PROJECT_ID', // 实际使用时需要替换为真实的projectId
  chains
});

// 创建Wagmi配置
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);