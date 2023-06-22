// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract PublicationReview {
  struct Review {
    address reviewer;
    uint256 rating;
    string comment;
  }

  enum Status {
    Pending,
    Accepted,
    Rejected
  }

  mapping(address => Review) public userReviews;
  Review[] public reviews;

  event ReviewAdded(address reviewer, uint rating, string comment);

  constructor() {}

  function addReview(uint rating, string memory comment) public {
    require(msg.sender != address(0), "Invalid reviewer address");
    require(rating >= 1 && rating <= 5, "Invalid rating");

    userReviews[msg.sender] = Review(msg.sender, rating, comment);
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
