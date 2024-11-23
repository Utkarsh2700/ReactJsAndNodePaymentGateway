const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let salt_key = process.env.SALT_KEY;
let merchant_id = process.env.MERCHANT_ID;

app.get("/", (req, res) => {
  console.log("saltkey");
  // console.log(process.env);

  console.log(process.env.SALT_KEY);
  res.send("Server Running Successfully");
});

app.post("/order", async (req, res) => {
  try {
    let { name, mobile, amount, MUID, transactionId } = req.body;
    console.log(name, mobile, amount, MUID, transactionId);
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: transactionId,
      name: name,
      amount: amount * 100,
      redirectUrl: `http://localhost:8000/status?id=${transactionId}`,
      redirectMode: "POST",
      mobileNumber: mobile,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const keyIndex = 1;
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const string = payloadMain + "/pg/v1/pay" + salt_key;

    const sha256 = crypto.createHash("sha256").update(string).digest("hex");

    const checkSum = sha256 + "###" + keyIndex;

    // const production_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
    const dev_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    const options = {
      method: "POST",
      url: dev_URL,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-VERIFY": checkSum,
      },
      data: {
        request: payloadMain,
      },
    };

    await axios(options)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        console.log("error", error.message);
        res.status(500).json({});
      });
  } catch (error) {
    console.log("err", error.message);
  }
});

app.post("/status", async (req, res) => {
  try {
    const merchantTransactionId = req.query.id;
    const merchantId = merchant_id;

    const keyIndex = 1;

    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checkSum = sha256 + "###" + keyIndex;

    const options = {
      method: "get",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checkSum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    await axios(options).then((response) => {
      if (response.data.success === true) {
        const url = "http://localhost:5173/success";
        return res.redirect(url);
      } else {
        const url = "http://localhost:5173/failure";
        return res.redirect(url);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
