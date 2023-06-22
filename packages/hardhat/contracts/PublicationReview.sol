// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {SchemaResolver} from "../eas-contracts/contracts/resolver/SchemaResolver.sol";
import {IEAS, Attestation} from "../eas-contracts/contracts/IEAS.sol";
import {EAS} from "../eas-contracts/contracts/EAS.sol";

contract PublicationReview is SchemaResolver {
  address private immutable _targetAttester;
  address private immutable _easContract;

  struct Review {
    address reviewer;
    uint256 rating;
    Attestation attestation;
    string comment;
  }

  enum Status {
    Pending,
    Accepted,
    Rejected
  }

  /// Modifiers

  /// Errors
  error InvalidSignature();
  error InvalidAttestation();

  mapping(address => Review) public userReviews;
  Review[] public reviews;

  event ReviewAdded(address reviewer, uint rating, string comment);

  constructor(IEAS eas, address targetAttestor) SchemaResolver(eas) {
    _targetAttester = targetAttestor;
    _easContract = address(eas);
  }

  function onAttest(Attestation calldata attestation, uint256 /*value*/) internal view override returns (bool) {
    return attestation.attester == _targetAttester;
  }

  function onRevoke(Attestation calldata /*attestation*/, uint256 /*value*/) internal pure override returns (bool) {
    return true;
  }

  function addReview(uint rating, string memory comment) public {
    require(msg.sender != address(0), "Invalid reviewer address");
    require(rating >= 1 && rating <= 5, "Invalid rating");

    Attestation memory attestation = EAS(_easContract).getAttestation("review");

    // eas.attest(EMPTY_UID, "review", abi.encodePacked(msg.sender, rating, comment), NO_EXPIRATION_TIME, false);

    userReviews[msg.sender] = Review(msg.sender, rating, attestation, comment);
  }

  function getReview(address reviewer) public view returns (Review memory) {
    return userReviews[reviewer];
  }

  function getReviewCount() public view returns (uint256) {
    return reviews.length;
  }

  function getReviewers() public view returns (address[] memory) {
    address[] memory reviewers = new address[](1);
    reviewers[0] = userReviews[msg.sender].reviewer;

    return reviewers;
  }
}
