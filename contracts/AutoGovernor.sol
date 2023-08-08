// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "./dgp/DGP.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AutoGovernor is Ownable {
    address public governance;

    constructor(address governanceAddress) {
        governance = governanceAddress;
    }

    fallback() external payable {
        if (msg.value > 0 && msg.sender != owner()) {
            payable(owner()).call{value: msg.value}("");
        }
        if (msg.sender == governance) {
            (uint256 blockHeight, , , , ) = Governance(governance).governors(
                address(this)
            );
            if (blockHeight > 0) {
                //&& block.number - lastPing >= 960 * 28
                Governance(governance).ping();
            }
        }
    }

    receive() external payable {
        if (msg.value > 0 && msg.sender != owner()) {
            payable(owner()).call{value: msg.value}("");
        }
        if (msg.sender == governance) {
            (uint256 blockHeight, uint256 lastPing, , , ) = Governance(governance).governors(
                address(this)
            );
            if (blockHeight > 0 && block.number - lastPing >= 960 * 28) {
                Governance(governance).ping();
            }
        }
    }

    function executeTransaction(
        address payable _to,
        uint256 _value,
        bytes memory _data
    ) public onlyOwner {
        (bool success, ) = _to.call{value: _value}(_data);
        require(success, "AutoGovernor: Tx failed");
    }

    function migrate(address governanceAddress) public payable onlyOwner {
        (, , uint256 collateral, , ) = Governance(governance).governors(
            address(this)
        );
        if (collateral > 0) {
            Governance(governance).unenroll(true);
        }
        governance = governanceAddress;
        uint256 requiredCollateral = DGP(Governance(governance).dgpAddress())
            .getGovernanceCollateral()[0];
        if (payable(address(this)).balance >= requiredCollateral) {
            Governance(governance).enroll{value: requiredCollateral}();
        }
    }

    function enroll() public onlyOwner {
        uint256 requiredCollateral = DGP(Governance(governance).dgpAddress())
            .getGovernanceCollateral()[0];
        require(
            payable(address(this)).balance >= requiredCollateral,
            "AutoGovernor: Failed to enroll"
        );
        Governance(governance).enroll{value: requiredCollateral}();
    }

    function unenroll(bool force) public onlyOwner {
        Governance(governance).unenroll(force);
    }

    function ping() public onlyOwner {
        Governance(governance).ping();
    }
}
