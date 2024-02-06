import Web3 from "web3";
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_infuraKey));
const contractABI = require("../contract-abi.json");
const contractAddress = "0x1Ac4B55ba89c527284EbE2D164306259C68010b1";

export const ChristmasLotteryContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);
export const connectWallet = async () => {
  // checks if window.ethereum is installed in browser
  if (window.ethereum) {
    try {
      // try to connect to Metamask. Calling this function will open up Metamask in the browser
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        // take the first address in the array of addresses and display it to the user in our Wallet
        address: addressArray[0],
      };
      return obj;
      // if user denies access to their Metamask account, .request() will throw an error.
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask in your browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getAllPartecipants = async (walletAddress) => {
  try {
    const message = await ChristmasLotteryContract.methods
      .GetAllPartecipants()
      .call({ from: walletAddress });
    let partecipants = [];
    for (let i = 0; i < message.length; i++) {
      partecipants.push(message[i][1] + " " + message[i][2]+ " "+ message[i][3]);
    }
    if (partecipants.length === 0) {
      partecipants = "No participants yet!";
    }
    return {
      Partecipant: partecipants,
    };
  } catch (error) {
    console.error("Error retrieving participants:", error);
    return {
      Partecipant: "Error in retriving the participants",
    };
  }
};

export const extractLottery = async (walletAddress) => {
  try {
    //set up transaction parameters
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: walletAddress, // must match user's active address.
      data: ChristmasLotteryContract.methods.Extraction.call({
        from: walletAddress,
      }).encodeABI(),
    };
    //sign the transaction
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    // show a message to the user that the transaction has been sent
    return {
      resultExtraction: (
        <span>
          ✅{" "}
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`}>
            Before showing the Winner View the status of your transaction on
            Etherscan !
          </a>
        </span>
      ),
    };
  } catch (error) {
    // in case of an error, show a message to the user
    // a possible error is that the user rejected the transaction
    console.error(`Error during the transaction:`, error);
    return {
      resultExtraction: "😥 " + error.message,
    };
  }
};

export const closeLottery = async (walletAddress) => {
  try {
    //set up transaction parameters
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: walletAddress, // must match user's active address.
      data: ChristmasLotteryContract.methods.closeLottery
        .call({ from: walletAddress })
        .encodeABI(),
    };
    //sign the transaction
    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      Closed: window.alert("Lottery closed"),
    };
  } catch (error) {
    console.error(`Error during the transaction:`, error);
    return {
      Closed: window.alert("Error during closing the Lottery"),    };
  }
};
export const ShowWinner = async (walletAddress) => {
  try {
    const showW = await ChristmasLotteryContract.methods
      .Winner()
      .call({ from: walletAddress });
    let win = [];
    if (showW.length === 0) {
      win = "No participants yet!";
    }

    win.push(showW[1] + " " + showW[2] + " " + showW[3]);
    return {
      Winner: win,
    };
  } catch (error) {
    return {
      Winner: "Error in retriving the Winner",
    };
  }
};
export const GetLastTicketSold = async (walletAddress) => {
  try {
    const lastP = await ChristmasLotteryContract.methods
      .getLastTicketSold()
      .call({ from: walletAddress });
    let last = [];
    last.push(lastP[1] + " " + lastP[2] + " " + lastP[3]);
    if (last.length === 0) {
      last = "No participants yet!";
    }
    return {
      LastPartecipant: last,
    };
  } catch (error) {
    console.error("Error retrieving participants:", error);
    return {
      LastPartecipant: "Error in retriving the last participant",
    };
  }
};
export const getNumOfPartecipants = async (walletAddress) => {
  try {
    const np = await ChristmasLotteryContract.methods
      .GetNumOfPartecipants()
      .call({ from: walletAddress });
    let number = [];
    number.push(np);
    number[0] = number[0].toString();
    return {
      NumPartecipant: number,
    };
  } catch (error) {
    console.error("Error retrieving participants:", error);
    return {
      NumPartecipant: "Error in retriving the Number of participant 😥"    };
  }
};
export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "You must install Metamask in your browser.",
    };
  }
};
export const sellTicket = async (walletAddress, Name, Surname,IdBuyer, Ticket) => {
  try {
    //set up transaction parameters
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: walletAddress, // must match user's active address.
      data: ChristmasLotteryContract.methods
        .SellTicket(Name, Surname, IdBuyer, Ticket)
        .encodeABI(),
    };
    //sign the transaction
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    // show a message to the user that the transaction has been sent
    return {
      resultTransaction: (
        <span>
          ✅{" "}
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
        </span>
      ),
    };
  } catch (error) {
    // in case of an error, show a message to the user
    // a possible error is that the user rejected the transaction
    console.error(`Error during the transaction:`, error);
    return {
      resultTransaction: "😥 " + error.message,
    };
  }
};
