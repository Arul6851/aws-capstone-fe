import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "1mb",
//     },
//   },
// };

export async function POST(req: NextRequest, res: NextApiResponse) {
  const data = await req.formData();
  const msg = data.get("msg") as string | null;
  console.log("Payment Response:", msg, "type:", typeof msg);
  if (!msg) {
    return NextResponse.json(
      { error: "Missing msg parameter" },
      { status: 400 }
    );
  }

  const details = msg.split("|");
  const keys = [
    "txn_status",
    "txn_msg",
    "txn_err_msg",
    "clnt_txn_ref",
    "tpsl_bank_cd",
    "tpsl_txn_id",
    "txn_amt",
    "clnt_rqst_meta",
    "tpsl_txn_time",
    "bal_amt",
    "card_id",
    "alias_name",
    "BankTransactionID",
    "mandate_reg_no",
    "token",
    "hash",
  ];

  const transactionData = {} as Record<string, string>;
  keys.forEach((key, index) => {
    transactionData[key] = details[index];
  });
  const tokenmatch = transactionData.clnt_rqst_meta.match(/itc:([^}]*)/);
  const token = tokenmatch ? tokenmatch[1] : null;
  console.log("usertoken", token);
  try {
    const backendResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/updateTuitionPayment`,
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const validationResult = backendResponse.data;

    if (validationResult.status === "success") {
      return NextResponse.redirect(
        new URL(
          `/payment/result?clnt_ref_id=${transactionData.clnt_txn_ref}`,
          process.env.NEXT_PUBLIC_FRONTEND_URL
        ),
        { status: 307 }
      );
    } else {
      return NextResponse.redirect(
        new URL(
          `/payment/result?clnt_ref_id=${transactionData.clnt_txn_ref}&status=failure`,
          process.env.NEXT_PUBLIC_FRONTEND_URL
        ),
        {
          status: 307,
        }
      );
    }
  } catch (error: any) {
    console.error("Error verifying transaction:", error);
    return NextResponse.json(
      {
        status: "failure",
        message: "Verification failed due to a server error.",
      },
      { status: 500 }
    );
  }
}
