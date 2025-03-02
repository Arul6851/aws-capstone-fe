import axios from "axios";
import { useEffect, useState, useCallback } from "react";

interface PaymentComponentProps {
  total: number;
  consumerId: string;
  txnId: string;
}

interface PaymentResponse {
  paymentMethod?: {
    paymentTransaction?: {
      statusCode?: string;
    };
  };
}

const PaymentComponent = ({
  total,
  consumerId,
  txnId,
}: PaymentComponentProps) => {
  const merchantid = process.env.NEXT_PUBLIC_MERCHANT_CODE;
  const schemecode = process.env.NEXT_PUBLIC_SCHEME_CODE;
  const resulturl = new URL(
    "/paymentapi/paymentResponse",
    window.location.origin
  ).toString();
  const img = new URL("/assets/licet1.jpg", window.location.origin).toString();

  // Initial state with proper typing
  const [reqJson, setReqJson] = useState({
    features: {
      enableAbortResponse: true,
      enableExpressPay: true,
      enableInstrumentDeRegistration: true,
      enableMerTxnDetails: true,
      enableNewWindowFlow: true, // Changed to true for better compatibility
    },
    consumerData: {
      deviceId: "WEBSH2",
      token: "",
      returnUrl: resulturl,
      responseHandler: (res: PaymentResponse) => {},
      paymentMode: "all",
      merchantLogoUrl: img,
      merchantId: merchantid,
      currency: "INR",
      consumerId: consumerId,
      txnId: txnId,
      cartDescription: "",
      items: [
        {
          itemId: schemecode,
          amount: total.toString(),
          comAmt: "0",
        },
      ],
      customStyle: {
        PRIMARY_COLOR_CODE: "#45beaa",
        SECONDARY_COLOR_CODE: "#FFFFFF",
        BUTTON_COLOR_CODE_1: "#2d8c8c",
        BUTTON_COLOR_CODE_2: "#FFFFFF",
      },
    },
  });

  const handleResponse = useCallback(
    (res: PaymentResponse) => {
      if (res?.paymentMethod?.paymentTransaction?.statusCode) {
        switch (res.paymentMethod.paymentTransaction.statusCode) {
          case "0300":
            // Success block
            console.log("Payment Successful:", res);
            // Redirect to success page
            window.location.href = `${window.location.origin}/payment/success?txnId=${txnId}`;
            break;
          case "0398":
            // Initiated block
            console.log("Payment Initiated:", res);
            break;
          case "0399":
            // Initiated block
            console.log("Payment Processing:", res);
            break;
          case "0396":
            // Abort block
            console.log("Payment Aborted:", res);
            break;
          default:
            // Error block
            console.log("Payment Error:", res);
            // Redirect to failure page
            window.location.href = `${window.location.origin}/payment/failure?txnId=${txnId}`;
        }
      }
    },
    [txnId]
  );

  const loadScript = useCallback((src: string, id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.getElementById(id)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.id = id;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }, []);

  const generatetoken = useCallback(async (): Promise<string> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/generatetoken`,
        {
          merchantId: merchantid,
          currency: "INR",
          consumerId: consumerId,
          txnId: txnId,
          totalamount: total,
          accountNo: "",
          consumerMobileNo: "",
          consumerEmailId: "",
          debitStartDate: "",
          debitEndDate: "",
          maxAmount: "",
          amountType: "",
          frequency: "",
          cardNumber: "",
          expMonth: "",
          expYear: "",
          cvvCode: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.token;
    } catch (error) {
      console.error("Token generation failed:", error);
      throw error;
    }
  }, [consumerId, txnId, total, merchantid]);

  const setDetails = useCallback(async () => {
    try {
      const token = await generatetoken();
      const cartDescription = localStorage.getItem("token") || "";

      setReqJson((prev) => ({
        ...prev,
        consumerData: {
          ...prev.consumerData,
          token,
          cartDescription,
          responseHandler: handleResponse,
          consumerId,
          txnId,
          items: [
            {
              itemId: schemecode,
              amount: total.toString(),
              comAmt: "0",
            },
          ],
        },
      }));
    } catch (error) {
      console.error("Failed to set payment details:", error);
    }
  }, [generatetoken, handleResponse, consumerId, txnId, total, schemecode]);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Load jQuery first
        await loadScript(
          "https://www.paynimo.com/paynimocheckout/client/lib/jquery.min.js",
          "jquery"
        );

        // Then load checkout script
        await loadScript(
          "https://www.paynimo.com/paynimocheckout/server/lib/checkout.js",
          "checkout"
        );

        await setDetails();
      } catch (error) {
        console.error("Failed to initialize payment:", error);
      }
    };

    initializePayment();

    // Cleanup function
    return () => {
      ["jquery", "checkout"].forEach((id) => {
        const script = document.getElementById(id);
        if (script) document.body.removeChild(script);
      });
    };
  }, [loadScript, setDetails]);

  const initiatePayment = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      if (!(window as any).$ || !(window as any).$.pnCheckout) {
        throw new Error("Payment SDK not loaded properly");
      }

      (window as any).$.pnCheckout(reqJson);
      if (reqJson.features.enableNewWindowFlow) {
        (window as any).pnCheckoutShared.openNewWindow();
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return (
    <button
      id="btnSubmit"
      onClick={initiatePayment}
      className="btn btn-primary btn-block d-flex justify-between mt-3 text-xl"
      disabled={!reqJson.consumerData.token}
    >
      <span>₹{total}</span>
      <span>
        Pay<i className="fas fa-long-arrow-alt-right ml-1"></i>
      </span>
    </button>
  );
};

export default PaymentComponent;
