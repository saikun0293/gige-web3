import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

export const Product = ({ transactions, account }) => {
  const history = useHistory();
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await transactions.methods
          .fetchUserInfo()
          .call({ from: account });
        console.log(res);
      } catch (err) {
        console.log(err);
        history.push("/signUp");
      }
    })();
  }, [account, transactions.methods, history]);

  useEffect(() => {
    (async () => {
      try {
        const product = await transactions.methods
          .fetchProduct(productId)
          .call();
        setProduct(product);
        const userInfo = await transactions.methods
          .fetchUserInfo()
          .call({ from: product.seller });
        setSeller(userInfo);
      } catch (err) {
        history.push("/");
      }
    })();
  }, [transactions, productId, history]);

  function onSubmit() {
    transactions.methods
      .buyProduct(productId)
      .send({
        from: account,
        value: window.web3.utils.toWei(product.price, "Ether"),
      })
      .on("receipt", (receipt) => {
        console.log(receipt);
        history.push("/");
      })
      .on("error", (error) => {
        console.log(error.message);
      });
  }

  console.log("product currently in", product);
  console.log(seller);

  return (
    <div class="h-screen w-screen bg-blue-200 flex justify-center items-center">
      <div class="bg-white w-full h-3/4 md:w-1/2 md:h-4/5 shadow-2xl p-16 font-body">
        <div class="bg-white text-center text-6xl font-bold font-body py-2 text-gray-700">
          <span class="text-purple-400">G</span>i
          <span class="text-blue-400">G</span>e<span>!</span>
        </div>
        <div class="text-center">
          <div>
            <button onClick={onSubmit}>Buy Product</button>

            <div class="text-gray-400 text-xs mt-2">{product.seller}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
