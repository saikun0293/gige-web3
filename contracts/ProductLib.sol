pragma solidity >=0.4.21 <0.6.0;

library ProductLib {
   struct Product {
      uint id; 
      string productName;
      address owner;
      address payable seller;
      string imageUrl1;
      string imageUrl2;
      string description;
      string location;
      uint price;
   }

   struct Data {
      mapping(uint => Product) products;
      uint totalProducts;
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

   function fetch(Data storage self, uint _productId) 
   public view isWithinBounds(self.totalProducts, _productId)
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
      Product memory _product = self.products[_productId];
      return (
         _product.id,
         _product.productName,
         _product.owner,
         _product.seller,
         _product.imageUrl1,
         _product.imageUrl2,
         _product.description,
         _product.location,
         _product.price
      );
   }

   function addToSell(
      Data storage self, 
      string memory _productName,
      string memory _imageUrl1,
      string memory _imageUrl2,
      string memory _description,
      string memory _location,
      uint _price
   ) public {
      self.products[self.totalProducts] = Product({
         id: self.totalProducts,
         productName: _productName,
         owner: msg.sender,
         seller: msg.sender,
         imageUrl1: _imageUrl1,
         imageUrl2: _imageUrl2,
         description: _description,
         location: _location,
         price: _price
      });
      ++self.totalProducts;
   }

   function getToBuy(Data storage self, uint _idx) 
   public 
   isWithinBounds(self.totalProducts, _idx)
   hasDifferentAddress(self.products[_idx].seller) 
   isNotBought(self.products[_idx].owner, self.products[_idx].seller) {
      self.products[_idx].owner = msg.sender;
   }
}
