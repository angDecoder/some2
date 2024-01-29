import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import ashokPrasadWalletAbi from "../artifacts/contracts/Assessment.sol/HomeSecuritySystem.json"

export default function HomePage() {
  const [ashokWallet, setAshokWallet] = useState(undefined);
  const [ashokAccount, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);

  const changeKeyPrev = useRef();
  const changeKeyNew = useRef();

  const adminAccessAddr = useRef();

  const accessAddr = useRef();

  const openDoorKey = useRef();


  const contractAddress = "0xD9020c84eF2209323204484ab58106773e686303";
  const atmABI = ashokPrasadWalletAbi.abi;

  const getWalletAddress = async () => {
    if (window.ethereum) {
      setAshokWallet(window.ethereum);
    }

    if (ashokWallet) {
      try {
        const accounts = await ashokWallet.request({ method: "eth_accounts" });
        accoundHandler(accounts);
      } catch (error) {
        console.log("error", error)
      }
    }
  };

  const accoundHandler = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No ashokAccount found");
    }
  };


  const connectToMetamask = async () => {
    if (!ashokWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ashokWallet.request({ method: "eth_requestAccounts" });
    accoundHandler(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ashokWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const changeSecretKey = async () => {

    let prevKey = Number(changeKeyPrev.current.value);
    let newKey = Number(changeKeyNew.current.value);
    try {
      if (atm) {
        let tx = await atm.changeSecretKey(prevKey,newKey);
        await tx.wait();
        console.log(`secret key change`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }
  const giveAdminAccess = async () => {

    let addr = adminAccessAddr.current.value;

    try {
      if (atm) {
        let tx = await atm.giveAdminAccess(addr);
        await tx.wait();
        console.log(`new item added successfully`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }
  const giveAccess = async (addr) => {

    try {
      if (atm) {
        let tx = await atm.giveAccess(addr);
        await tx.wait();
        console.log(`new item added successfully`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }
  const openDoor = async (key) => {

    try {
      if (atm) {
        let tx = await atm.openDoor(key);
        await tx.wait();
        console.log(`new item added successfully`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }

  useEffect(() => {
    getWalletAddress();
  }, []);


  return (
    <main className="container">
      <header>
        <h1>Home Security</h1>
      </header>
      <div className="content">
        {!ashokAccount ? (<button onClick={connectToMetamask}>Start Home Security System</button>)
          : (
            <>
              <div className="div">
                <h2>Only for Admin</h2>
                <div className="btn-group">
                  <button onClick={changeSecretKey}>Change Key</button>
                  <div>
                    <input ref={changeKeyPrev} type="password" placeholder="Previous Password"></input>
                    <input ref={changeKeyNew} type="password" placeholder="New Password"></input>
                  </div>
                </div>
                <div className="btn-group">
                  <button onClick={giveAdminAccess}>Give Admin Access</button>
                  <div>
                    <input ref={changeKeyPrev} type="text" placeholder="Address"></input>
                  </div>
                </div>
              </div>

              <div className="div">
                <h2>For All Admins</h2>
                <div className="btn-group">
                  <button onClick={giveAccess}>Give Access To Users</button>
                  <div>
                    <input ref={accessAddr} type="text" placeholder="Address"></input>
                  </div>
                </div>
              </div>

              <div className="div">
                <h2>For People With Access</h2>
                <div className="btn-group">
                  <button onClick={openDoor}>Open Door</button>
                  <div>
                    <input ref={openDoorKey} type="password" placeholder="Password"></input>
                  </div>
                </div>
              </div>
            </>
          )
        }

      </div>


      <style jsx>{`
      `}</style>
    </main>
  );
}
