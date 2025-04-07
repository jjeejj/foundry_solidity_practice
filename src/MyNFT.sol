// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIds;
    
    // 存储每个NFT的URI
    mapping(uint256 => string) private _tokenURIs;
    
    constructor() ERC721("AvatarNFT", "AT") Ownable(msg.sender) {}
    
    /**
     * @dev 铸造新的NFT
     * @param to 接收NFT的地址
     * @param tokenURI NFT的元数据URI
     * @return 新铸造的NFT的ID
     */
    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds += 1;
        uint256 newTokenId = _tokenIds;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        return newTokenId;
    }
    
    /**
     * @dev 设置NFT的URI
     * @param tokenId NFT的ID
     * @param _tokenURI NFT的元数据URI
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(tokenId <= _tokenIds, "ERC721: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    /**
     * @dev 获取NFT的URI
     * @param tokenId NFT的ID
     * @return NFT的元数据URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(tokenId <= _tokenIds, "ERC721: URI query for nonexistent token");
        
        string memory _tokenURI = _tokenURIs[tokenId];
        
        // 如果没有设置特定的URI，则返回基础URI
        if (bytes(_tokenURI).length > 0) {
            return _tokenURI;
        }
        return super.tokenURI(tokenId);
    }
}