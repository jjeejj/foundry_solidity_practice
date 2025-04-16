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
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MONAD_TESTNET, isProduction } from './config';

// 根据环境选择链
const chains = isProduction() 
  ? [MONAD_TESTNET] // 生产环境使用Monad Testnet
  : [hardhat];      // 开发环境使用Hardhat本地网络

// 配置链和提供者
const { publicClient, webSocketPublicClient } = configureChains(
  chains,
  [publicProvider()]
);

// 使用一个有效的projectId
const projectId = "pixel_grid_app_123456"; // 临时ID，生产环境需要替换为WalletConnect的真实projectId

// 配置钱包 - 回到默认方式
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);