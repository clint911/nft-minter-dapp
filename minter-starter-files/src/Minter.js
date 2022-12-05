import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, MintNFT } from "./utils/interact";


const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");//storing the user address 
  const [status, setStatus] = useState("");//text to be displayed inside of the button 
  const [name, setName] = useState("");//stores the name of the nft 
  const [description, setDescription] = useState("");//stores the description of the nft 
  const [url, setURL] = useState("");//link to the nft's digital asset 

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setStatus("Write a message in the text-field above")
        } else {
          setWallet("")
          setStatus("Connect to MetaMask using the top right button.")
        }
      })
    } else {
      setStatus(
        <p>{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install MetaMask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      )
    }
  }

  useEffect(async () => { //TODO: implement
    const { address, status } = await getCurrentWalletConnected()
    setWallet(address)
    setStatus(status)

    addWalletListener()
  }, []);

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status)
    setStatus(walletResponse.address)
  };

  const onMintPressed = async () => { //TODO: implement
    const { status } = await MintNFT(url, name, description)
    setStatus(status)
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
      <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
