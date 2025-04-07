# Foundry Solidity Practice

这是一个使用Foundry框架进行Solidity智能合约开发的练习项目。Foundry是一个快速、可移植且模块化的以太坊应用开发工具包，专为Solidity开发而设计。

## 项目简介

本项目包含了多个示例合约和测试，用于展示Foundry框架的基本功能和使用方法：

- 基础的Counter合约及其测试
- 合约继承示例（A、B、C合约）
- Solidity特性测试
- 部署脚本示例
- 基于OpenZeppelin的ERC721 NFT合约实现

## 安装指南

### 前置要求

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### 安装步骤

1. 克隆仓库

```bash
git clone <仓库URL>
cd hello_foundry
```

2. 安装依赖

```bash
forge install
```

## 项目结构

```
├── src/                    # 源代码目录
│   ├── Counter.sol         # 计数器合约
│   ├── A.sol               # 继承示例合约A
│   ├── B.sol               # 继承示例合约B
│   ├── C.sol               # 继承示例合约C (继承自A和B)
│   └── IERC721.sol         # ERC721接口示例
├── test/                   # 测试目录
│   ├── Counter.t.sol       # Counter合约测试
│   ├── C.t.sol             # C合约测试
│   └── Solidity.t.sol      # Solidity特性测试
├── script/                 # 部署脚本目录
│   └── Counter.s.sol       # Counter部署脚本
└── lib/                    # 依赖库
    └── forge-std/          # Forge标准库
```

## 合约说明

### Counter.sol

一个简单的计数器合约，包含设置数值和递增功能。

### 继承示例 (A.sol, B.sol, C.sol)

展示了Solidity中的合约继承和方法重写机制：
- A合约和B合约各自实现了`foo()`函数
- C合约继承自A和B，并重写了`foo()`函数，同时调用父合约的实现

## 使用方法

### 编译合约

```bash
forge build
```

### 运行测试

```bash
forge test
```

查看详细测试输出：

```bash
forge test -vv
```

### 部署合约

使用部署脚本部署Counter合约：

```bash
forge script script/Counter.s.sol --rpc-url <YOUR_RPC_URL> --private-key <YOUR_PRIVATE_KEY>
```

## 测试说明

### Counter.t.sol

测试Counter合约的基本功能：
- `test_Increment`: 测试递增功能
- `testFuzz_SetNumber`: 模糊测试设置数值功能

### C.t.sol

测试C合约的继承和方法重写：
- `test_Foo`: 测试重写后的`foo()`函数

### Solidity.t.sol

测试Solidity语言特性：
- `test_ContractInherit`: 测试Unicode日志输出
- `test_BlockPrevrandao`: 测试区块随机数

## 学习资源

- [Foundry Book](https://book.getfoundry.sh/)
- [Solidity 文档](https://docs.soliditylang.org/)
- [Foundry GitHub 仓库](https://github.com/foundry-rs/foundry)

## 贡献指南

欢迎提交问题和改进建议！可以通过以下方式获取帮助：

- 在GitHub上开启讨论
- 加入Foundry支持社区

## 许可证

[MIT](LICENSE)

## NFT合约使用指南

本项目新增了一个基于OpenZeppelin ERC721标准的NFT合约实现。

### NFT合约功能

- 基于ERC721标准实现的NFT合约
- 支持铸造新的NFT（仅合约所有者）
- 支持设置和查询NFT的元数据URI
- 使用Counters库自动管理Token ID

### 相关文件

- `src/MyNFT.sol`: NFT合约主文件
- `script/MyNFT.s.sol`: 部署和铸造NFT的脚本
- `test/MyNFT.t.sol`: NFT合约测试文件

### 如何使用NFT合约

#### 编译合约

```bash
forge build
```

#### 测试合约

```bash
forge test --match-contract MyNFTTest -vv
```

#### 部署合约

1. 创建一个`.env`文件，添加你的私钥：

```
PRIVATE_KEY=你的私钥
```

2. 运行部署脚本：

```bash
forge script script/MyNFT.s.sol --rpc-url <你的RPC URL> --broadcast
```

#### 与合约交互

##### 铸造NFT

作为合约所有者，你可以调用`mint`函数为指定地址铸造NFT：

```solidity
// 参数1: 接收NFT的地址
// 参数2: NFT的元数据URI
// 返回值: 新铸造的NFT的ID
mint(address to, string memory tokenURI) public onlyOwner returns (uint256)
```

示例：
```bash
cast send <合约地址> "mint(address,string)" <接收地址> "ipfs://QmExample/metadata.json" --private-key $PRIVATE_KEY
```

##### 查询NFT元数据

你可以通过`tokenURI`函数查询NFT的元数据URI：

```solidity
// 参数: NFT的ID
// 返回值: NFT的元数据URI
tokenURI(uint256 tokenId) public view returns (string memory)
```

示例：
```bash
cast call <合约地址> "tokenURI(uint256)" 1
```

### 元数据格式

NFT元数据应遵循以下JSON格式：

```json
{
  "name": "NFT名称",
  "description": "NFT描述",
  "image": "图片URL",
  "attributes": [
    {
      "trait_type": "属性名称",
      "value": "属性值"
    }
  ]
}
```

### 注意事项

- 只有合约所有者可以铸造NFT
- 确保元数据URI指向有效的JSON文件
- 建议使用IPFS等分布式存储系统存储元数据和图片