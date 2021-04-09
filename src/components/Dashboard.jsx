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
    <div class="bg-gray-50">
      <header>
        <div class="bg-white text-center text-6xl font-bold font-body py-8 text-gray-700">
          <span class="text-purple-400">G</span>i
          <span class="text-blue-400">G</span>e<span>!</span>
        </div>
        <div class="text-center my-10 md:absolute md:right-10 md:top-12 md:my-0">
          <Link
            class="font-bold font-body bg-purple-200 p-3 px-5 hover:bg-purple-300 m-3"
            to="/signup"
          >
            Sign Up
          </Link>
          <Link
            class="font-bold font-body bg-blue-200 p-3 px-5 hover:bg-blue-300 m-3"
            to="/login"
          >
            Login
          </Link>
        </div>
      </header>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-24 py-10">
        {products.map((product) => (
          <div class="w-72 shadow-lg m-4 font-body">
            <img
              class="w-full h-36 object-cover"
              src={product.imageUrl1}
              alt={product.productName}
            />
            <div class="p-7">
              <div class="text-2xl font-bold text-center">
                {product.productName}
              </div>
              <hr />
              <div class="mt-3 text-center mb-6">
                <div class="my-2">{product.description}</div>
                <hr />
                <div class="mt-2 font-semibold text-xs">{product.location}</div>
                <div class="m-auto font-semibold my-2 w-20 h-10 rounded-full bg-purple-300 p-2">
                  ETH {product.price}
                </div>
              </div>
              <div class="text-center">
                <Link
                  class="bg-blue-200 p-3 px-5 hover:bg-blue-300"
                  to={`/product/${product.id}`}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <footer class="text-gray-400 font-body text-center">
        © 2021 Gige Team
      </footer>
    </div>
  );
};
