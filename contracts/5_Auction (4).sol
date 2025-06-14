// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Auctopus is IERC721Receiver{
    uint private auctioncount;
    struct Auction  {
        string name;
        string desc;
        address payable owner;
        uint initial_value;
        uint endtime;
        uint tokenid;
        string imageuri;
        string tokenuri;
        uint currentbid;
        address payable currentbidder;
        uint minincrement;
        uint totalbidders;
        bool finalized;
    }
    mapping(uint => address[]) public bidders; //for each tokein id
    mapping(uint => mapping(address => uint)) public bids; //bids done by bidder on each token
    mapping(uint => Auction)  mpp;
    uint[] public alltokens;

    event AuctionCreated(uint indexed tokenId, address indexed owner, uint endTime);
    event BidPlaced(address indexed bidder, uint tokenid, uint amount);
    event AuctionFinalized(uint indexed tokenid, address winner, uint finalbid);
    event FundRefunded(uint indexed tokenid, address bidder, uint amount);
    event NFTheldbyAuctopus(uint indexed tokenid, address from, address to);
    event NFTgiventoWinner(address indexed winner, uint tokenid);

    IERC721 public nftaddress;
    constructor(address _nftaddress){ nftaddress = IERC721(_nftaddress); }

    function onERC721Received(address , address from, uint256 tokenId, bytes calldata ) external override  returns   (bytes4){
        emit NFTheldbyAuctopus(tokenId, from, address(this));
        return this.onERC721Received.selector;
    }

    function createAuction(string memory _name, string memory _desc,  uint _initialvalue, uint _endtime, uint _tokenid, string memory _tokenuri, string memory _imageuri, uint _increment) public {
        require(mpp[_tokenid].owner == address(0), "An Auction already exist for this token");
        require(_endtime > block.timestamp, "End time must be in the future");
        Auction storage temp = mpp[_tokenid];
        alltokens.push(_tokenid);
        auctioncount++;
        temp.minincrement = _increment;
        temp.name = _name;
        temp.desc = _desc;
        temp.owner = payable(msg.sender);
        temp.initial_value = _initialvalue;
        temp.endtime = _endtime;
        temp.tokenid = _tokenid;
        temp.tokenuri = _tokenuri;
        temp.imageuri = _imageuri;
        temp.finalized = false;
        temp.currentbid = _initialvalue;
        temp.currentbidder = payable(msg.sender);
        temp.totalbidders = 0;
        emit AuctionCreated(_tokenid, msg.sender, _endtime);
    }   

    function bid(uint _tokenid) public payable {
        require(mpp[_tokenid].owner != address(0), "Auction does not exist for this token");
        require(block.timestamp < mpp[_tokenid].endtime, "Auction has already ended");
        require(!mpp[_tokenid].finalized, "Auction already ended");
        require(msg.value >= mpp[_tokenid].currentbid + mpp[_tokenid].minincrement, "Bid too low");
        if (mpp[_tokenid].totalbidders > 0){
            require(msg.sender != bidders[_tokenid][mpp[_tokenid].totalbidders - 1], "You can't challenge your own bid");
        }
        if(bids[_tokenid][msg.sender] != 0){
            //matlab he/she is bidding again
            mpp[_tokenid].currentbid = bids[_tokenid][msg.sender] + msg.value;
            mpp[_tokenid].currentbidder = payable(msg.sender);
            bids[_tokenid][msg.sender] += msg.value;

            emit BidPlaced(msg.sender, _tokenid, bids[_tokenid][msg.sender]);
        }
        else{
            mpp[_tokenid].totalbidders++;
            mpp[_tokenid].currentbid = msg.value;
            mpp[_tokenid].currentbidder = payable(msg.sender);
            bidders[_tokenid].push(msg.sender);
            bids[_tokenid][msg.sender] = msg.value;
            
            emit BidPlaced(msg.sender, _tokenid, msg.value);
        }

    }
    
    function finalizeAuction(uint _tokenid) public {
        require(mpp[_tokenid].owner != address(0), "Auction does not exist for this token");
        require(!mpp[_tokenid].finalized, "Auction already ended");
        require(block.timestamp >= mpp[_tokenid].endtime, "Auction not ended yet");
        require(msg.sender == mpp[_tokenid].owner || msg.sender == mpp[_tokenid].currentbidder, "You cant finalizze the auction");

        mpp[_tokenid].finalized = true;
        (bool success, ) = mpp[_tokenid].owner.call{value: mpp[_tokenid].currentbid}("");
        require(success, "Payment to owner failed");

        nftaddress.safeTransferFrom(address(this), mpp[_tokenid].currentbidder, _tokenid);

        uint n = bidders[_tokenid].length;
        for(uint i = 0; i < n; i++){
            if(bidders[_tokenid][i] != mpp[_tokenid].currentbidder){
                address bidder = bidders[_tokenid][i];
                uint amt = bids[_tokenid][bidder];
                if(amt > 0){                       
                    bids[_tokenid][bidder] = 0;
                    (bool sucess, ) = payable(bidder).call{value: amt}("");
                    require(sucess, "Payment to bidder failed");
                    emit FundRefunded(_tokenid, bidder, amt);
                }
            }
        }
        emit NFTgiventoWinner( mpp[_tokenid].currentbidder, _tokenid);
        emit AuctionFinalized(_tokenid, mpp[_tokenid].currentbidder,  mpp[_tokenid].currentbid);

        delete bidders[_tokenid];
    }

    function getAuction(uint _tokenid) public view returns(Auction memory) {
        require(mpp[_tokenid].owner != address(0), "Auction does not exist");
        Auction storage auction = mpp[_tokenid];
        return auction;
    }

   function getAllTokenIds() public view returns (uint[] memory) {
    return alltokens;
    } 
}