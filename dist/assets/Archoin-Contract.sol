pragma solidity ^0.4.23;

/**
 * @title Archoin Smart Contract - Handles the Archoin token as well as the ERC exchange logic
 * @author Alex Papageorgiou - <alex.ppg@protonmail.com>
 */
contract Archoin {

    /**
     *  Events
     */

    event Transfer(address indexed from, address indexed to, uint256 value);
    event SetOrder(address indexed from, address indexed tokenProvided, uint256 amountProvided, address indexed tokenWanted, uint256 amountWanted, uint256 timestamp);
    event CompleteOrder(address indexed from, address to, address indexed tokenPurchased, uint256 amountPurchased, address indexed tokenOffered, uint256 amountOffered);

    /**
     *  Constants
     */

    string public constant CONTRACT_NAME = "Archoin";
    string public constant TOKEN_SYMBOL = "ARCH";
	address public constant CONTRACT_OWNER = 0x0;
    uint96 public constant TOKEN_DECIMALS = 8;
	// Unix Timestamp of XXX
	uint256 public constant CONTRACT_CREATION = 1234;
	uint120 public constant DECIMAL_MULTIPLIER = 10**TOKEN_DECIMALS;
	uint8 public constant ORDER_FEE = 25;

    /**
     *  Storage
     */

    uint128 public totalSupply = 100000000 * DECIMAL_MULTIPLIER;


    mapping (address => uint256) private balances;
    mapping (address => mapping (address => uint256)) public allowance;
    mapping (bytes32 => Order) public orderBook;
    mapping (address => bytes32[]) public userOrders;
    mapping (address => mapping (address => uint256)) private tokenBalance;
    mapping (address => bool) private claimedBonus;

    struct Order {
        address beneficiary;
        uint96 timestamp;
        address tokenProvided;
        bool fulfilled;
        uint256 amountProvided;
        address tokenWanted;
        uint256 amountWanted;
    }

    modifier isOwner() {
        require(CONTRACT_OWNER == msg.sender);
        _;
    }

    modifier isValidTarget(address _to) {
        require(_to != 0x0, "Invalid target address");
        _;
    }

    modifier canCancel(bytes32 orderHash) {
        require(msg.sender == orderBook[orderHash].beneficiary && !orderBook[orderHash].fulfilled, "Order fulfilled or unauthorized user");
        _;
    }

    constructor() public {
        balances[this] = totalSupply;
    }

	function() public payable {
	    balances[this] = sub(balances[this], msg.value * 10000, "No tokens available for sale");
	    balances[msg.sender] += msg.value * 10000;
    }

    function transfer(address _to, uint256 _value) public isValidTarget(_to) {
        balances[msg.sender] = sub(balances[msg.sender], _value, "Insufficient balance");
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
    }

    function approve(address _spender, uint256 _value) public {
        allowance[msg.sender][_spender] = _value;
    }

    function transferFrom(address _from, address _to, uint256 _value)
        public
        isValidTarget(_to)
    {
        balances[_from] = sub(balances[_from], _value, "Insufficient balance");
        balances[_to] += _value;
        allowance[_from][msg.sender] = sub(allowance[_from][msg.sender], _value, "Insufficient allowance");
        emit Transfer(_from, _to, _value);
    }

	function withdrawEther(uint256 amount) public isOwner {
	    require(CONTRACT_CREATION < now - (1 years / 12), "Ether time-lock still in effect");
		CONTRACT_OWNER.transfer(amount);
	}

	function placeOrder(
	    uint256 amountProvided,
	    address tokenProvided,
	    uint256 amountWanted,
	    address tokenWanted
	)
	    public

	{
	    Archoin(tokenProvided).transferFrom(msg.sender, this, amountProvided);
	    /**
	     * Overflows already checked by perspective tokens and most
	     * likely impossible as they wouldn't be able to properly
	     * record their total supply.
	     */
	    tokenBalance[msg.sender][tokenProvided] += amountProvided;
	    bytes32 orderHash = keccak256(
	        msg.sender,
	        now,
	        tokenProvided,
	        amountProvided,
	        tokenWanted,
	        amountWanted
	    );
	    orderBook[orderHash] = Order(
	        msg.sender,
	        uint96(now - CONTRACT_CREATION),
	        tokenProvided,
	        false,
	        amountProvided,
	        tokenWanted,
	        amountWanted
	    );
	    userOrders[msg.sender].push(orderHash);
        emit SetOrder(
            msg.sender,
            tokenProvided,
            amountProvided,
            tokenWanted,
            amountWanted,
            now
        );
	}

	function cancelOrder(bytes32 orderHash) public canCancel(orderHash) {

	}

	function balanceOf(address holder) public view returns (uint256) {
	    if (!claimedBonus[holder]) {
	        return balances[holder] + 100 * DECIMAL_MULTIPLIER;
	    }
	    return balances[holder];
	}

    function sub(uint256 a, uint256 b, string error)
        private
        pure
        returns (uint256)
    {
        require(b <= a, error);
        return a - b;
    }
}
