import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
import axios from "axios";

const provider = new ethers.providers.Web3Provider(window.ethereum, "sepolia");
export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [list, setList] = useState([{}]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await provider.listAccounts();

        setAccount(accounts[0]);
        setSigner(provider.getSigner());
      } catch (error) {
        console.error("Fehler beim Verbinden mit MetaMask:", error);
      }
    }

    getAccounts();
  }, [account]);
  useEffect(() => {
    async function fetchEscrows() {
      try {
        const response = await axios.get("http://localhost:3000/api/escrows");
        const fetchedEscrows = response.data;
        setList(fetchedEscrows);
      } catch (error) {
        console.error("Fehler beim Abrufen der Escrows:", error);
      }
    }

    fetchEscrows();
  }, []);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.utils.parseEther(document.getElementById("wei").value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });
        await approve(escrowContract, signer);
      },
    };
    setEscrows([...escrows, escrow]);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/escrows",
        escrow
      );
      const savedEscrow = response.data;
      setList([...escrows, savedEscrow]);
    } catch (error) {
      console.error("Fehler beim Speichern der Escrow:", error);
    }
  }

  return (
    <div className="app">
      <div>
        <h1 className="header">Escrow</h1>
      </div>
      <div className="contract">
        <h1 className="contract-header"> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETH e.g. 1.2)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> New Contract to Approve </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return (
              <Escrow key={escrow.address} {...escrow} disableButton={true} />
            );
          })}
        </div>
      </div>
      <div className="existing-contracts">
        <h1> Contract List </h1>

        <div id="container">
          {list.map((escrow) => {
            return (
              <Escrow key={escrow.address} {...escrow} disableButton={false} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
