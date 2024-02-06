import React from "react";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  sellTicket,
  getAllPartecipants,
  GetLastTicketSold,
  getNumOfPartecipants,
  extractLottery,
  ShowWinner,
  closeLottery,
} from "./util/interact.js";
let ListPartecipants;
const buttonStyle = {
  padding: "10px 15px",
  backgroundColor: "#3498db",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  margin: "0 10px", // Adjust the margin to add space between buttons
};
const inputStyle = {
  width: "200px",
  padding: "8px",
  border: "1px solid #3498db",
  borderRadius: "5px",
};
const hstyle = {
  textAlign: "center",
  color: "#3498db",
  textShadow: "2px 2px 4px #666",
  fontFamily: "Arial, sans-serif",
  fontSize: "2.5em",
  margin: "20px 0",
};
const Lottery = () => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [Name, setName] = useState("");
  const [Surname, setSurname] = useState("");
  const [Ticket, setTicket] = useState("1");
  const [resultTransaction, setStatusTransaction] = useState("");
  const [Partecipant, setPartecipant] = useState("");
  const [LastPartecipant, setLastPartecipant] = useState("");
  const [NumPartecipant, setNumPartecipant] = useState("");
  const [Winner, setWinner] = useState("");
  const [Close, setCloseLottery] = useState("");
  const [resultExtraction, setStatusExtraction] = useState("");
  const [IdBuyer, setIdBuyer] = useState("");

  //called only once
  useEffect(() => {
    // get the connected wallet
    async function getWalletConnected() {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);
    }
    getWalletConnected();
    walletListener();
  }, []);
  const getAllPatecipants = async () => {
    if (window.ethereum.selectedAddress == null) {
      window.alert("Fai Login con Metamask");
    } else {
      const { Partecipant } = await getAllPartecipants(walletAddress);
      setPartecipant(Partecipant);
      if (Array.isArray(Partecipant)) {
        ListPartecipants = Partecipant.map((Partecipant) => (
          <li>{Partecipant}</li>
        ));
      } else {
        ListPartecipants = <li>{Partecipant}</li>;
      }
    }
  };
  const LastTicketSold = async () => {
    if (window.ethereum.selectedAddress == null) {
      window.alert("Fai Login con Metamask");
    } else {
      const {LastPartecipant } = await GetLastTicketSold(
        walletAddress
      );
      setLastPartecipant(LastPartecipant);
    }
  };
  const NumberOfPartecipants = async () => {
    if (window.ethereum.selectedAddress == null) {
      window.alert("Fai Login con Metamask");
    } else {
      const {NumPartecipant } = await getNumOfPartecipants(
        walletAddress
      );
      setNumPartecipant(NumPartecipant);
    }
  };
  function walletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
          setStatus(
            '🦊 Connect to Metamask using the "Connect Wallet" button.'
          );
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask in your browser.
          </a>
        </p>
      );
    }
  }
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };
  const buyTicket = async (e) => {
    e.preventDefault();
    const { resultTransaction } = await sellTicket(
      walletAddress,
      Name,
      Surname,
      IdBuyer,
      Ticket
    );
    setStatusTransaction(resultTransaction);
  };
  const Extraction = async () => {
    if (window.ethereum.selectedAddress == null) {
      window.alert("Fai Login con Metamask");
    } else {
      setWinner("");
      const { resultExtraction } = await extractLottery(walletAddress);
      setStatusExtraction(resultExtraction);
    }
  };
  const StopLottery = async () => {
    if (window.ethereum.selectedAddress == null) {
      window.alert("Fai Login con Metamask");
    } else {
      const { Close } = await closeLottery(walletAddress);
      setCloseLottery(Close);
      setWinner("");
      setStatusTransaction("");
      setStatusExtraction("");
      setNumPartecipant("");
      setLastPartecipant("");
      setStatus("");
    }
  };
  const showWinner = async () => {
    if (window.ethereum.selectedAddress == null) {
      window.alert("Fai Login con Metamask");
    } else {
      const { Winner } = await ShowWinner(walletAddress);
      if(Winner==="" || Winner==0) setWinner("No Winner Yet");
      else{setWinner(Winner);}
    }
  };

  return (
    <div id="container" style={{ position: "relative" }}>
      <h1 style={hstyle}>Christmas Lottery of Luca Ferrari</h1>
      <button onClick={connectWalletPressed} style={buttonStyle}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <button style={buttonStyle} onClick={StopLottery}>
        Close Lottery
      </button>
      <div style={{}}>
        <div style={{ display: "inline-block", margin: "10px" }}>
          <h2>Get all Participants:</h2>
          <button id="lPButton" onClick={getAllPatecipants} style={buttonStyle}>
            Get All Participants
          </button>
          <ul>
            <p>{ListPartecipants}</p>
          </ul>
        </div>
        <div style={{ display: "inline-block", margin: "10px" }}>
          <h2>Last Ticket Sold:</h2>
          <button id="lPButton" onClick={LastTicketSold} style={buttonStyle}>
            Get Last Ticket Sold
          </button>

          <p>{LastPartecipant}</p>
        </div>
        <div style={{ display: "inline-block", margin: "10px" }}>
          <h2>Number of Participants:</h2>
          <button
            id="lPButton"
            onClick={NumberOfPartecipants}
            style={buttonStyle}
          >
            Get The number of Participants
          </button>
          <p>{NumPartecipant}</p>
        </div>
      </div>
      <form onSubmit={buyTicket}>
        <h2>Buy Ticket:</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <div style={{ flex: 1, marginRight: "10px" }}>
            <p>Insert Name:</p>
            <input
              id="name"
              type="text"
              value={Name}
              required
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              placeholder="Name"
            />
          </div>

          <div style={{ flex: 1, marginRight: "10px" }}>
            <p>Insert Surname:</p>
            <input
              id="surname"
              type="text"
              value={Surname}
              required
              onChange={(e) => setSurname(e.target.value)}
              style={inputStyle}
              placeholder="Surname"
            />
          </div>
          <div style={{ flex: 1, marginRight: "10px" }}>
            <p>Insert Id Buyer:</p>
            <input
              id="idBuyer"
              type="number"
              value={IdBuyer}
              min={1}
              max={1000}
              required
              onChange={(e) => setIdBuyer(e.target.value)}
              style={inputStyle}
              placeholder="Id buyer"
            />
          </div>

          <div style={{ flex: 1 }}>
            <p>Insert Number of Tickets:</p>
            <input
              id="Ticket"
              type="number"
              max={99}
              min={1}
              value={Ticket}
              required
              onChange={(e) => setTicket(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
        <button id="lPButton" /*onClick={buyTicket}*/ style={buttonStyle}>
          Sell Ticket
        </button>
        <p>{resultTransaction}</p>
       
      </form>
      <button id="Extraction" onClick={Extraction} style={buttonStyle}>
          Extract The Winner
        </button>
        <p>{resultExtraction}</p>
        <button id="Winner" onClick={showWinner} style={buttonStyle}>
          Show Winner
        </button>
        <p>  {Winner}</p>
    </div>
  );
};

export default Lottery;
