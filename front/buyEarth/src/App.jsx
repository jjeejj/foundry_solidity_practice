import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useContractRead, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import styled from 'styled-components';
import './App.css';
import { getContractConfig } from './config';

// BuyEarth合约ABI
import contractABI from './abi.json'; // 正确导入ABI

// 从配置获取合约地址
const contractConfig = getContractConfig();
const contractAddress = contractConfig.address;

// 颜色映射 - 保留6个常用颜色
const colorMap = {
  1: "#FF0000", // 红色
  2: "#00FF00", // 绿色
  3: "#0000FF", // 蓝色
  4: "#FFFF00", // 黄色
  5: "#00FFFF", // 青色
  6: "#FFA500", // 橙色
  7: "custom"   // 自定义颜色
};

// 手印图标 - SVG路径
const handprintIcon = {
  path: "M12,1C5.925,1,1,5.925,1,12s4.925,11,11,11s11-4.925,11-11S18.075,1,12,1z M18.707,9.293l-7,7 C11.512,16.488,11.256,16.585,11,16.585s-0.512-0.098-0.707-0.293l-3-3c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0 L11,14.171l6.293-6.293c0.391-0.391,1.023-0.391,1.414,0S19.098,8.902,18.707,9.293z",
  viewBox: "0 0 24 24"
};

const App = () => {
  const [selectedColor, setSelectedColor] = useState(1); // 默认选择红色
  const [selectedTile, setSelectedTile] = useState(null);
  const [earthData, setEarthData] = useState(Array(100).fill({ color: 0, price: 0, image_url: "" }));
  const [imageUrl, setImageUrl] = useState("");
  const [customColor, setCustomColor] = useState("#FF00FF"); // 默认自定义颜色为紫色
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork(); // 获取当前连接的链

  // 读取所有方块数据
  const { data: earthsData, refetch } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getEarths',
    watch: true,
  });

  // 购买方块
  const { write: buyEarthWrite, data: buyEarthData } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'buyEarth',
    value: parseEther('0.001'),
  });

  // 等待交易完成
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: buyEarthData?.hash,
  });

  // 当交易成功时刷新数据
  useEffect(() => {
    if (isSuccess) {
      refetch();
      setSelectedTile(null);
    }
  }, [isSuccess, refetch]);

  // 当合约数据更新时更新UI
  useEffect(() => {
    if (earthsData) {
      setEarthData(Array.from(earthsData));
    }
  }, [earthsData]);

  // 处理图片URL输入变化
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  // 处理方块点击
  const handleTileClick = (index) => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }

    // 检查方块是否已被购买
    if (earthData[index].color !== 0) {
      alert('这个方块已经被购买了');
      return;
    }

    setSelectedTile(index);
  };

  // 处理购买方块
  const handleBuyEarth = () => {
    if (selectedTile === null) {
      alert('请先选择一个方块');
      return;
    }

    if (!imageUrl.trim()) {
      alert('请输入图片URL');
      return;
    }

    // 如果是自定义颜色，使用颜色值的哈希作为颜色ID
    const colorId = selectedColor === 7 ? 7 : selectedColor;

    buyEarthWrite({
      args: [selectedTile, colorId, imageUrl],
    });
  };

  // 处理自定义颜色变化
  const handleCustomColorChange = (e) => {
    setCustomColor(e.target.value);
    setSelectedColor(7); // 自动选择自定义颜色选项
  };

  // 渲染10x10网格
  const renderGrid = () => {
    return (
      <Grid>
        {Array(100).fill(0).map((_, index) => {
          const earth = earthData[index];
          // 处理自定义颜色的情况
          let color;
          if (earth.color === 7) {
            // 对于自定义颜色，使用紫色作为默认显示
            color = earth.color !== 0 ? "#FF00FF" : '#FFFFFF';
          } else {
            color = earth.color !== 0 ? colorMap[earth.color] : '#FFFFFF';
          }
          const isSelected = selectedTile === index;
          const isPurchased = earth.color !== 0;
          const hasImage = isPurchased && earth.image_url && earth.image_url.trim() !== "";

          return (
            <Tile
              key={index}
              color={color}
              isSelected={isSelected}
              onClick={() => handleTileClick(index)}
              purchased={isPurchased}
            >
              {hasImage && <TileImage src={earth.image_url} alt={`Tile ${index}`} />}
            </Tile>
          );
        })}
      </Grid>
    );
  };

  return (
    <Container>
      <Card>
        <Header>
          <Logo>
            <LogoIcon>🧩</LogoIcon>
            <LogoTextGroup>
              <LogoText>像素格子</LogoText>
              <LogoSubtitle>基于区块链技术的像素艺术画布</LogoSubtitle>
            </LogoTextGroup>
          </Logo>
          <WalletSection>
            {isConnected ? (
              <WalletConnected>
                <WalletAvatar>
                  <WalletAvatarText>{address?.slice(-2)}</WalletAvatarText>
                </WalletAvatar>
                <WalletInfo>
                  <WalletAddress>{`${address?.slice(0, 6)}...${address?.slice(-2)}`}</WalletAddress>
                  <NetworkInfo>
                    <ConnectionStatus connected={isConnected}>
                      <StatusDot connected={isConnected} />
                      已连接
                    </ConnectionStatus>
                    {chain && <NetworkName>{chain.name}</NetworkName>}
                  </NetworkInfo>
                </WalletInfo>
                <LogoutButton onClick={disconnect}>
                  <LogoutIcon>⏏️</LogoutIcon>
                  <span>退出</span>
                </LogoutButton>
              </WalletConnected>
            ) : (
              <WalletConnectContainer>
                <ConnectIcon>🔗</ConnectIcon>
                <ConnectButton />
              </WalletConnectContainer>
            )}
          </WalletSection>
        </Header>
        
        <MainContent>
          {renderGrid()}

          <ControlPanel>
            <ColorSelectionTitle>选择颜色</ColorSelectionTitle>
            <ColorSelection>
              <ColorPicker>
                {Object.entries(colorMap).map(([value, color]) => {
                  const intValue = parseInt(value);
                  // 自定义颜色选项特殊处理
                  if (color === "custom") {
                    return (
                      <CustomColorContainer 
                        key={value} 
                        selected={selectedColor === intValue} 
                        onClick={() => setSelectedColor(intValue)}
                      >
                        <CustomColorLabel>自定义</CustomColorLabel>
                        <CustomColorInput
                          type="color"
                          value={customColor}
                          onChange={handleCustomColorChange}
                          title="点击选择自定义颜色"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColor(intValue);
                          }}
                        />
                      </CustomColorContainer>
                    );
                  }
                  // 常规颜色选项
                  return (
                    <ColorOption
                      key={value}
                      color={color}
                      selected={selectedColor === intValue}
                      onClick={() => setSelectedColor(intValue)}
                    >
                      {selectedColor === intValue && (
                        <HandprintIcon viewBox={handprintIcon.viewBox}>
                          <path d={handprintIcon.path} fill="#fff" />
                        </HandprintIcon>
                      )}
                    </ColorOption>
                  );
                })}
              </ColorPicker>
            </ColorSelection>

            <ConnectButtonWrapper>
              {isConnected ? (
                <PurchaseContainer>
                  <InputContainer>
                    <InputLabel>图片URL</InputLabel>
                    <Input
                      type="text"
                      placeholder="输入图片URL"
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                    />
                  </InputContainer>
                  <BuyButton
                    onClick={handleBuyEarth}
                    disabled={selectedTile === null || isLoading}
                  >
                    {isLoading ? '处理中...' : '购买方块'}
                  </BuyButton>
                </PurchaseContainer>
              ) : (
                <NotConnectedContainer>
                  <PlaceholderText>请先连接钱包以购买方块</PlaceholderText>
                  <ConnectButton />
                </NotConnectedContainer>
              )}
            </ConnectButtonWrapper>
          </ControlPanel>
        </MainContent>
      </Card>
    </Container>
  );
};

// 样式组件
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding-bottom: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 15px 15px 0 0;
  border-bottom: 1px solid #e1e4e8;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIcon = styled.div`
  font-size: 28px;
`;

const LogoTextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoText = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const LogoSubtitle = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  font-weight: normal;
  letter-spacing: 0.3px;
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
`;

const WalletConnected = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(52, 152, 219, 0.08);
  border-radius: 12px;
  padding: 6px 10px;
  border: 1px solid rgba(52, 152, 219, 0.2);
  gap: 10px;
`;

const WalletAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3498db, #2980b9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const WalletAvatarText = styled.div`
  text-transform: uppercase;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const WalletAddress = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const NetworkInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NetworkName = styled.div`
  font-size: 11px;
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
`;

const ConnectionStatus = styled.div`
  font-size: 11px;
  color: ${props => props.connected ? '#27ae60' : '#e74c3c'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props => props.connected ? '#27ae60' : '#e74c3c'};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.2);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    background-color: rgba(231, 76, 60, 0.2);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LogoutIcon = styled.span`
  font-size: 14px;
`;

const WalletConnectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(52, 152, 219, 0.08);
  border-radius: 12px;
  padding: 8px 12px;
  border: 1px solid rgba(52, 152, 219, 0.2);
`;

const ConnectIcon = styled.span`
  font-size: 16px;
`;

const MainContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  margin-top: 10px;
`;

const PlaceholderText = styled.div`
  color: #95a5a6;
  font-size: 14px;
  text-align: center;
  margin: 15px 0;
  font-style: italic;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 2px;
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid #e5e8ec;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 4px;
  background-color: #f9f9fb;
`;

const Tile = styled.div`
  background-color: ${props => props.color};
  border: ${props => props.isSelected ? '2px solid #000' : '1px solid #ccc'};
  cursor: ${props => props.purchased ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  position: relative;
  border-radius: 3px;
  box-shadow: ${props => props.isSelected ? '0 0 8px rgba(0, 0, 0, 0.3)' : 'none'};

  &:hover {
    transform: ${props => props.purchased ? 'none' : 'scale(1.05)'};
    box-shadow: ${props => props.purchased ? 'none' : '0 0 5px rgba(0,0,0,0.2)'};
    z-index: 1;
  }
`;

const TileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.7;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f9f9fb;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-top: 5px;
`;

const ColorSelectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: #333;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background-color: #3498db;
    border-radius: 2px;
  }
`;

const ColorSelection = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 450px;
  padding: 10px;
`;

const ColorOption = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid ${props => props.selected ? '#333' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.12);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

const HandprintIcon = styled.svg`
  width: 24px;
  height: 24px;
  position: absolute;
  opacity: 0.9;
`;

const ConnectButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const PurchaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  align-items: center;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #3498db;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(52, 152, 219, 0.1);
    outline: none;
  }
`;

const CustomColorContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  width: 85px;
  height: 85px;
  border-radius: 10px;
  background-color: ${props => props.selected ? '#f8f0ff' : '#ffffff'};
  border: ${props => props.selected ? '2px solid #FF00FF' : '1px solid #ddd'};
  box-shadow: ${props => props.selected ? '0 0 12px rgba(255, 0, 255, 0.5)' : '0 2px 5px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  padding: 8px;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    background-color: #f8f8ff;
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CustomColorLabel = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: bold;
  margin-top: 5px;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: "🎨";
    margin-right: 4px;
    font-size: 15px;
  }
`;

const CustomColorInput = styled.input`
  width: 65px;
  height: 40px;
  border: 2px solid #ccc;
  padding: 0;
  background: none;
  cursor: pointer;
  opacity: 1;
  transition: all 0.3s;
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  margin-top: 5px;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    border: 2px solid #FF00FF;
  }

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
`;

const BuyButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  max-width: 200px;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
  margin-top: 5px;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(52, 152, 219, 0.25);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const NotConnectedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  padding: 10px 0;
`;

export default App;