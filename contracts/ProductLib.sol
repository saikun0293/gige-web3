pragma solidity >=0.4.21 <0.6.0;

library ProductLib {
   struct Product {
     string name;
     address owner;
     address payable seller;
     string imageUrl;
     string description;
     uint price;
   }

   modifier isWithinBounds(uint _size, uint _idx) {
      require(_size > _idx, "Invalid Product Id specified");
      _;
   }

   modifier hasDifferentAddress(address owner) {
      require(owner != msg.sender, "Seller can not buy his own Product");
      _;
   }

   modifier isNotBought(address owner, address seller) {
      require(owner == seller, "Product has already been bought");
      _;
   }

   function addToSell(
      Product[] storage self, 
      string memory _name,
      string memory _imageUrl,
      string memory _description,
      uint _price
   ) public {
      self.push(Product({
         name: _name,
         owner: msg.sender,
         seller: msg.sender,
         imageUrl: _imageUrl,
         description: _description,
         price: _price
      }));
   }

   function getToBuy(Product[] storage self, uint _idx) 
   public 
   isWithinBounds(self.length, _idx)
   hasDifferentAddress(self[_idx].seller) 
   isNotBought(self[_idx].owner, self[_idx].seller) {
      self[_idx].owner = msg.sender;
   }
}
