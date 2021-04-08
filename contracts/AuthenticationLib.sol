pragma solidity >=0.4.21 <0.6.0;

library AuthenticationLib {
   struct UserInfo {
     string name;
     string email;
     string phone;
   }

   struct Data {
      mapping(address => UserInfo) userInfo;
      address[] keys;
   }

   function has(Data storage self, address _key) public view returns(bool) {
      for (uint pos = 0; pos < self.keys.length; ++pos)
         if (self.keys[pos] == _key) return true;
      return false;
   }

   function add(
      Data storage self,
      string memory _name, 
      string memory _email, 
      string memory _phone
   ) public {
      self.keys.push(msg.sender);
      self.userInfo[msg.sender] = UserInfo({
         name: _name,
         email: _email,
         phone: _phone
      });
   }

   function get(Data storage self) 
   public view returns(string memory name, string memory email, string memory phone) {
      UserInfo memory userInfo = self.userInfo[msg.sender];
      return (userInfo.name, userInfo.email, userInfo.phone);
   }
}
