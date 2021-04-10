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
      <div class="bg-white w-full h-full md:w-1/2 shadow-2xl p-6 font-body">
        <div class="bg-white text-center text-6xl font-bold font-body py-2 text-gray-700">
          <span class="text-purple-400">G</span>i
          <span class="text-blue-400">G</span>e<span>!</span>
        </div>
        <div class="text-center">
          <div>
            <div class="carousel w-2/3 m-auto relative shadow-2xl bg-white">
              <div class="carousel-inner relative overflow-hidden w-full">
                <input
                  class="carousel-open"
                  type="radio"
                  id="carousel-1"
                  name="carousel"
                  aria-hidden="true"
                  hidden="true"
                  checked="checked"
                />
                <div class="carousel-item absolute opacity-0">
                  <img
                    class="w-full object-cover h-52"
                    src={product?.imageUrl1}
                    alt="product-img"
                  />
                </div>

                <input
                  class="carousel-open"
                  type="radio"
                  id="carousel-2"
                  name="carousel"
                  aria-hidden="true"
                  hidden="true"
                  checked="checked"
                />
                <div class="carousel-item absolute opacity-0">
                  <img
                    class="w-full h-52 object-cover"
                    src={product?.imageUrl2}
                    alt="product-img"
                  />
                </div>

                <ol class="carousel-indicators">
                  <li class="inline-block mr-3">
                    <label
                      for="carousel-1"
                      class="carousel-bullet cursor-pointer block text-4xl text-white hover:text-blue-700"
                    >
                      •
                    </label>
                  </li>
                  <li class="inline-block mr-3">
                    <label
                      for="carousel-2"
                      class="carousel-bullet cursor-pointer block text-4xl text-white hover:text-blue-700"
                    >
                      •
                    </label>
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div class="px-24">
            <div class="text-3xl my-3 font-bold">{product?.productName}</div>
            <hr />
            <div class="h-36 my-2">{product?.description}</div>
            <hr />
            <div class="font-semibold">{product?.location}</div>
            <div class="m-auto font-semibold my-2 w-20 h-10 rounded-full bg-purple-300 p-2">
              ETH {product?.price}
            </div>
            <div>
              <button class="bg-blue-200 p-3 px-6" onClick={onSubmit}>
                Buy Product
              </button>
            </div>
            <div class="text-gray-400 text-xs mt-2">
              Seller : {product?.seller}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
