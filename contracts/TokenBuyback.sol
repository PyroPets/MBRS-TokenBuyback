// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./AutoGovernor.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract TokenBuyback is Ownable, Pausable, ERC721Holder {
    event Deposit(address indexed sender, uint256 amount, uint256 balance);

    event ExecuteTransaction(
        address indexed to,
        uint256 indexed value,
        bytes data
    );

    address public immutable token;
    address public immutable core;
    address public immutable autoGovernor;

    address public governance;

    bool public hodlers = true;

    modifier onlyActive() {
        require(active(), "TokenBuyback: Not active");
        _;
    }

    modifier onlyHodler() {
        uint256 balance = IERC721(core).balanceOf(msg.sender);
        if (hodlers) require(balance > 0, "TokenBuyback: Only hodlers");
        _;
    }

    constructor(
        address coreAddress,
        address tokenAddress,
        address governanceAddress
    ) {
        core = coreAddress;
        token = tokenAddress;
        governance = governanceAddress;
        autoGovernor = address(new AutoGovernor(governanceAddress));
    }

    function active() public view returns (bool isActive) {
        (, , uint256 collateral, , ) = Governance(governance).governors(
            address(autoGovernor)
        );
        isActive = collateral > 0 && payable(address(this)).balance >= 1e8;
    }

    function deposit() public payable {
        if (msg.value > 0) {
            emit Deposit(msg.sender, msg.value, payable(address(this)).balance);
        }
    }

    function rate() public view returns (uint256 r) {
        uint256 s = IERC20(token).totalSupply();
        uint256 l = IERC20(token).balanceOf(address(this));
        uint256 b = payable(address(this)).balance;
        if (b < 1e8) {
            r = 0;
        } else {
            uint256 e = ((s - l) * 1e8) / b;
            r = e > 0 ? e : 1;
        }
    }

    fallback() external payable {
        deposit();
    }

    receive() external payable {
        deposit();
    }

    function migrate(address governanceAddress) public payable onlyOwner {
        governance = governanceAddress;
        AutoGovernor(payable(autoGovernor)).migrate(governanceAddress);
    }

    function setHodlers(bool hodlersOnly) public payable onlyOwner {
        hodlers = hodlersOnly;
    }

    function enroll() public payable onlyOwner {
        if (msg.value > 0) {
            (bool transfer, ) = payable(autoGovernor).call{value: msg.value}(
                ""
            );
            require(
                transfer,
                "TokenBuyback: Failed to tranfer MRX to the AutoGovernor"
            );
        }
        uint256 requiredCollateral = DGP(Governance(governance).dgpAddress())
            .getGovernanceCollateral()[0];
        if (payable(address(autoGovernor)).balance < requiredCollateral) {
            uint256 delta = requiredCollateral -
                payable(address(autoGovernor)).balance;
            if (payable(address(this)).balance >= delta) {
                (bool transfer, ) = payable(autoGovernor).call{value: delta}(
                    ""
                );
                require(
                    transfer,
                    "TokenBuyback: Failed to tranfer MRX to the AutoGovernor"
                );
            }
        }
        AutoGovernor(payable(autoGovernor)).enroll();
    }

    function unenroll(bool force) public onlyOwner {
        AutoGovernor(payable(autoGovernor)).unenroll(force);
    }

    function ping() public onlyOwner {
        AutoGovernor(payable(autoGovernor)).ping();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function executeTransaction(
        address payable _to,
        uint256 _value,
        bytes memory _data
    ) public onlyOwner {
        (bool success, ) = _to.call{value: _value}(_data);
        require(success, "TokenBuyback: Tx failed");
    }

    function exchangeTokenForMetrix(
        uint256 amount
    ) public onlyActive onlyHodler whenNotPaused {
        require(amount > 0, "TokenBuyback: Amount must be greater than zero");
        uint256 r = rate();
        uint256 e = (amount * 1e8) / r;
        require(e >= 1e8, "TokenBuyback: 1 MRX minimum exchange");
        require(
            payable(address(this)).balance >= e,
            "TokenBuyback: Insufficient MRX available for exchange"
        );
        bool transfer = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(transfer, "TokenBuyback: Failed to transfer tokens");
        (bool success, ) = payable(address(msg.sender)).call{value: e}("");
        require(success, "TokenBuyback: Failed to send MRX");
    }
}
