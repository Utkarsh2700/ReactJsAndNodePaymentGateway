import React, { useState } from "react";
import axios from "axios";

const Hero = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name,
      mobile,
      amount,
      MUID: "MUIDW" + Date.now(),
      transactionId: "T" + Date.now(),
    };
    try {
      const response = await axios.post("http://localhost:8000/order", data);
      if (
        response.data &&
        response.data.data.instrumentResponse.redirectInfo.url
      ) {
        window.location.href =
          response.data.data.instrumentResponse.redirectInfo.url;
        console.log("response", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-red-300 space-y-8 flex flex-col"
        // action=""
        // method="post"
      >
        <label htmlFor="Name">Name</label>
        <input
          className="border border-[#000000]/50 outline-none"
          type="text"
          name="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="Mobile">Mobile</label>
        <input
          className="border border-[#000000]/50 outline-none"
          type="text"
          name="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <label htmlFor="Amount">Amount</label>
        <input
          className="border border-[#000000]/50 outline-none"
          placeholder="0.00"
          type="text"
          name="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-violet-700 text-white font-semibold text-xl"
          type="submit"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Hero;
