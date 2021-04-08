pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

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
      for(uint pos=0;pos<self.keys.length;++pos)
         if(self.keys[pos] == _key) return true;
      return false;
   }

   function add(Data storage self, address _key, UserInfo memory userInfo) public {
      self.keys.push(_key);
      self.userInfo[_key] = userInfo;
   }

   function get(Data storage self, address _key) public view returns(UserInfo memory) {
      return self.userInfo[_key];
   }
}
