import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

export const Dashboard = ({ transactions, account }) => {
  const history = useHistory();

  const [products, setProducts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await transactions.methods
          .fetchUserInfo()
          .call({ from: account });
        console.log(res);
        setUserInfo(res);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [account, transactions.methods, history]);

  useEffect(() => {
    transactions.events.ProductCreated({}).on("data", (event) => {
      console.log(event);
      setProducts((prevProducts) => [...prevProducts, event.returnValues]);
    });
  }, [transactions.events]);

  useEffect(() => {
    (async () => {
      const totalProducts = await transactions.methods.totalProducts().call();
      console.log(totalProducts);

      const productsReceived = Array.from({ length: totalProducts }, (_, idx) =>
        transactions.methods.fetchProduct(idx).call()
      );

      const productsCollected = (await Promise.all(productsReceived)).filter(
        ({ seller, owner }) => owner === seller
      );

      setProducts(productsCollected);
    })();
  }, [transactions]);

  console.log(products);
  console.log(account);

  console.log(userInfo);
  return (
    <div>
      <h1>Dashboard</h1>
      <br />
      {products.map((product) => (
        <div class="w-56 shadow">
          <img
            class="w-full h-36 object-cover"
            src={product.imageUrl1}
            alt={product.productName}
          />
          <div>
            <div>{product.productName}</div>
            <div>
              <div>{product.description}</div>
              <div>Location : {product.location}</div>
              <div>Price : {product.price}</div>
            </div>
            <Link to={`/product/${product.id}`}>Checkout</Link>
          </div>
        </div>
      ))}
    </div>
  );
};
