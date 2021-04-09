import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

export const SignUp = ({ transactions, account }) => {
  const history = useHistory();

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();

  function onSignUp(event) {
    event.preventDefault();
    transactions.methods
      .signUp(
        nameRef.current.value,
        emailRef.current.value,
        phoneRef.current.value
      )
      .send({ from: account })
      .on("receipt", (receipt) => {
        console.log(receipt);
        history.push("/");
      })
      .on("error", (error) => {
        console.error(error);
      });
  }

  return (
    <div class="w-screen h-screen flex place-items-center flex-col">
      <div class="bg-white text-center text-6xl font-bold font-body py-8 text-gray-700">
        <span class="text-purple-400">G</span>i
        <span class="text-blue-400">G</span>e<span>!</span>
      </div>

      <form
        class="w-2/3 h-2/3 md:w-1/2 md:h-2/3 shadow-2xl p-16 font-body"
        onSubmit={onSignUp}
      >
        <div class="text-2xl text-center">Sign Up</div>
        <input
          class="input"
          autocomplete="off"
          type="text"
          ref={nameRef}
          placeholder="Name"
        />
        <input
          class="input"
          autocomplete="off"
          type="text"
          ref={emailRef}
          placeholder="Email"
        />
        <input
          class="input"
          autocomplete="off"
          type="text"
          ref={phoneRef}
          placeholder="Phone"
        />
        <div class="text-center mt-10">
          <button class="w-48 h-12 bg-purple-300 focus:outline-none">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
