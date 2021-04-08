pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

import { AuthenticationLib as Auth } from "./AuthenticationLib.sol";
import { ProductLib } from "./ProductLib.sol";

contract Transactions {
   using Auth for Auth.Data;
   Auth.Data authData;

   using ProductLib for ProductLib.Product[];
   ProductLib.Product[] public products;
   
   modifier shouldBeAuthenticated(bool _shouldBeAuthenticated) {
      require(
         authData.has(msg.sender) == _shouldBeAuthenticated, 
         "User has already been Authenticated"
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
      authData.add(
         msg.sender, 
         Auth.UserInfo({
            name: _name,
            email: _email,
            phone: _phone
         })
      );
   }

   function fetchUserInfo() 
   public view shouldBeAuthenticated(true) returns(Auth.UserInfo memory) {
      return authData.get(msg.sender);
   }

   function sellProduct(
      string memory _name,
      string memory _imageUrl,
      string memory _description,
      uint _price
   ) public returns(bool) {
      products.addToSell(_name, _imageUrl, _description, _price);
      return true;
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
