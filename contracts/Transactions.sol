pragma solidity >=0.4.21 <0.6.0;

import { AuthenticationLib as Auth } from "./AuthenticationLib.sol";
import { ProductLib } from "./ProductLib.sol";

contract Transactions {
   using Auth for Auth.Data;
   Auth.Data authData;

   using ProductLib for ProductLib.Data;
   ProductLib.Data productsData;

   event ProductCreated(
      uint id,
      string productName,
      address owner,
      address seller,
      string imageUrl1,
      string imageUrl2,
      string description,
      string location,
      uint price
   );

   event ProductBought(
      uint id,
      address owner
   );
   
   modifier shouldBeAuthenticated(bool _shouldBeAuthenticated) {
      require(
         authData.has(msg.sender) == _shouldBeAuthenticated, 
         _shouldBeAuthenticated 
            ? "User has not been Authenticated" 
            : "User has already been Authenticated"
      );
      _;
   }

   modifier hasEnoughAmount(uint _amount) {
      require(_amount <= msg.value, "Transaction Rejected : Not enough credits supplied");
      _;
   }

   function signUp(string memory _name, string memory _email, string memory _phone)
   public shouldBeAuthenticated(false) {
      authData.add(msg.sender, _name, _email, _phone);
   }

   function fetchUserInfo() 
   public view shouldBeAuthenticated(true) 
   returns(string memory name, string memory email, string memory phone) {
      return authData.get(msg.sender);
   }

   function sellProduct(
      string memory _productName,
      string memory _imageUrl1,
      string memory _imageUrl2,
      string memory _description,
      string memory _location,
      uint _price
   ) public {
      productsData.addToSell(_productName, _imageUrl1, _imageUrl2, _description,_location, _price);
      emit ProductCreated({
         id: productsData.totalProducts - 1,
         productName: _productName,
         owner: msg.sender,
         seller: msg.sender,
         imageUrl1: _imageUrl1,
         imageUrl2: _imageUrl2,
         description: _description,
         location: _location,
         price: _price
      });
   }

   function buyProduct(uint _productId) 
   public payable
   hasEnoughAmount(productsData.products[_productId].price)  {
      productsData.getToBuy(_productId);
      address(productsData.products[_productId].seller).transfer(msg.value);
      emit ProductBought({
         id: _productId,
         owner: msg.sender
      });
   }

   function totalProducts() public view returns(uint) {
      return productsData.totalProducts;
   }

   function fetchProduct(uint _productId) public view
   returns(
      uint id, 
      string memory productName,
      address owner,
      address payable seller,
      string memory imageUrl1,
      string memory imageUrl2,
      string memory description,
      string memory location,
      uint price
   ) {
      return productsData.fetch(_productId);
   }
}
