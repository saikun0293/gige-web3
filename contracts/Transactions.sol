pragma solidity >=0.4.21 <0.6.0;

import { AuthenticationLib as Auth } from "./AuthenticationLib.sol";
import { ProductLib } from "./ProductLib.sol";

contract Transactions {
   using Auth for Auth.Data;
   Auth.Data authData;

   using ProductLib for ProductLib.Product[];
   ProductLib.Product[] public products;

   event ProductCreated(
     string name,
     address owner,
     address seller,
     string imageUrl,
     string description,
     uint price
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
      require(_amount >= msg.value, "Transaction Rejected : Extra credits supplied");
      _;
   }

   function signUp(string memory _name, string memory _email, string memory _phone)
   public shouldBeAuthenticated(false) {
      authData.add(_name, _email, _phone);
   }

   function fetchUserInfo() 
   public view shouldBeAuthenticated(true) 
   returns(string memory name, string memory email, string memory phone) {
      return authData.get();
   }

   function sellProduct(
      string memory _name,
      string memory _imageUrl,
      string memory _description,
      uint _price
   ) public {
      products.addToSell(_name, _imageUrl, _description, _price);
      emit ProductCreated({
         name: _name,
         owner: msg.sender,
         seller: msg.sender,
         imageUrl: _imageUrl,
         description: _description,
         price: _price
      });
   }

   function buyProduct(uint _productId) 
   public payable
   hasEnoughAmount(products[_productId].price)  {
      products.getToBuy(_productId);
      address(products[_productId].seller).transfer(msg.value);
   }

   function totalProducts() public view returns(uint) {
      return products.length;
   }
}
