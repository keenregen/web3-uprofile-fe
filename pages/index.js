import 'sf-font';
import axios from 'axios';
import { userContract } from '../components/config';
import { pinJSONToIPFS, ethConnect, checkNfts, signInUser, getAccount } from '@/components/web3connect';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


export default function Home() {



  const [selectedAddress, setSelectedAddress] = useState(null);
  const [nftId, setNftId] = useState('');
  // const [numOfPassNfts,setNumOfPassNfts] = useState(0)

  const router = useRouter();

  async function connectYourWallet() {
    const output = await ethConnect();
    setSelectedAddress(window.ethereum.selectedAddress);
    console.log("Wallet with address " + output.addressStr + " is connected. ");
    

  }

  useEffect(() => {
    getUser();
    getNftIds();
    if (window.ethereum.selectedAddress !== null) {
    document.getElementById('connectWallet').innerHTML = "Connected";
    }
    else{
      document.getElementById('connectWallet').innerHTML = "Press This Button To Connect Your Wallet";
      document.getElementById("first").value = ""
      document.getElementById("last").value = ""
      document.getElementById("user").value = ""
      document.getElementById("email").value = ""
    }
  }, [selectedAddress])

  async function getNftIds() {
    if (window.ethereum.selectedAddress !== null) {
      const numOfPassNfts = await getNumOfPassNfts();
      if (numOfPassNfts > 0) {
        const output = await signInUser();
        setNftId(output.getNftId[0].toString());
        setSelectedAddress(output.walletAddr);
      }
      else { console.log("You don't have any nft as passport") };
    }
  }

  useEffect(() => {
    if (window.ethereum.selectedAddress === null) {
      setSelectedAddress(window.ethereum.selectedAddress);
      router.push("/")
    }
    else {
      const checkauth = setInterval(() => {
        if (window.ethereum.selectedAddress !== null) {
          checkWallet()
        } else {
          setSelectedAddress(window.ethereum.selectedAddress);
          setNftId("");
          return;
        }
      }, 2000);
      return () => {
        if (window.ethereum.selectedAddress === null) {
          router.push("/");
          return;
        }
        else { clearInterval(checkauth) }
      };
    }
  }, [selectedAddress])

  async function checkWallet() {
    if (window.ethereum.selectedAddress !== null) {
      // console.log("CheckWallet!")
      const output = await checkNfts();
      console.log(output);
      if (output === 0) {
        router.push("/denied")
        return;
      }
    }
    else { return; }
  }

  async function getNumOfPassNfts() {
    const output = await checkNfts();
    console.log(output);
    return output;
  }

  async function addProfile() {
    document.getElementById('displayupdatechanged').innerHTML = "";
    let firstName = document.getElementById("first").value.toString()
    let lastName = document.getElementById("last").value.toString()
    let username = document.getElementById("user").value.toString()
    let eMail = document.getElementById("email").value.toString()

    if (!firstName || !lastName || !username || !eMail) return
    const jsonData = JSON.parse(JSON.stringify({
      firstName, lastName, username, eMail
    }));

    let fileName = "file0";

    const cid = await pinJSONToIPFS(jsonData, fileName);
    console.log(cid);
    document.getElementById('displayupdatechanged').innerHTML = "Waiting for profile update...";
    const connected = await ethConnect();
    await userContract.generateProfile(cid, connected.addressStr, connected.addressStr);
    let confirmation = 'Profile Updated';
    document.getElementById('displayupdatechanged').innerHTML = confirmation;
  }



  async function getUser() {
    if (window.ethereum.selectedAddress !== null) {
      const output = await signInUser();
      if (output.getNftId[0]) {
      setNftId(output.getNftId[0].toString()); }
      setSelectedAddress(output.walletAddr);
      const userData = await getAccount();
      const userUrl = userData.userUrl;
      if (userUrl == undefined) {
        if (output.getNftId[0]) {
        document.getElementById("displayupdatechanged").innerHTML = "Write your info and register below."
        }
        return;
      }
      else {
        const header = {
          "Content-Type": "application/json",
        }
        const userInfo = await axios.get(userUrl, header);
        let first = userInfo.data.firstName;
        let last = userInfo.data.lastName;
        let user = userInfo.data.username;
        let email = userInfo.data.eMail;
        document.getElementById("first").value = first
        document.getElementById("last").value = last
        document.getElementById("user").value = user
        document.getElementById("email").value = email
      }
    }
    else { document.getElementById("displayupdatechanged").innerHTML = "Connect Your Wallet First"}

  }


  return (
    <div
      style={{ color: "white", fontFamily: "SF Pro Display", fontSmooth: "3em" }}
    >
      <div className='container'>
        <main>

        <div className="row d-flex ">
            <div className="col-lg-6 align-items-right">

              <button className="btn btn-primary mb-2 mt-3 d-flex col-md-12 justify-content-center" id="connectWallet" onClick={connectYourWallet}>Connect Your Wallet</button>
              <h6
              className="d-flex col-md-12 justify-content-center"
                style={{
                  color: "#83EEFF",
                  fontSize: "13px",
                }}
              > {selectedAddress}
              </h6>

</div>
              </div>
          <div className="row g-6">
            <div className="col-md-3 col-lg-3 mt-3">
              <form
                className="card p-1"
                style={{
                  backgroundColor: "#00000070",
                  boxShadow: "0px 1px 5px #ffffff",
                }}
              >
                <img
                  className="d-block mx-auto"
                  src="zero.png"
                  alt=""
                  style={{
                    maxWidth: "60px",
                    maxHeight: "60px",
                    position: "absolute",
                    boxShadow: "0px, 1px, 10px, #00000070",
                  }}
                />
                <h5
                  className="d-flex justify-content-end"
                  id="displaypicchanged"
                />
                <img
                  className="d-block mx-auto mb-4"
                  alt=""
                  style={{
                    maxWidth: "250px",
                    maxHeight: "250px",
                    minWidth: "40px",
                    minHeight: "20px",
                  }}
                />

              </form>
              <h4 className="d-flex justify-content-end align-items-right mt-2 mb-3">
                <span className="text-primary bold">Rank</span>
                <span className="badge bg-primary rounded-pill">11</span>
              </h4>
              <ul className="list-group mb-3">
                <li
                  className="list-group-item d-flex justify-content-between"
                  style={{ backgroundColor: "#2E69FF30" }}
                >
                  <div className="text-success">
                    <h4 className="my-0" style={{ color: "white" }}>
                      NFT
                    </h4>

                    <small style={{ color: "white" }}>PASSPORT</small>
                  </div>
                  <span style={{ fontSize: "30px", color: "white" }}>
                    ID {nftId}
                  </span>
                </li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-8">
            <h4
                className="d-flex justify-content-center mt-3"
                id="displayupdatechanged"
              />
              <br />
              <h4 className="mb-3 d-flex justify-content-center">Profile Info</h4>

              <form className="needs-validation" noValidate>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="first" className="form-label">
                      First name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="first"
                      id="first"
                      style={{
                        backgroundColor: "#d3d3d310",
                        fontWeight: "lighter",
                        color: "white",
                      }}
                      required
                    />
                    <div className="invalid-feedback">
                      Valid first name is required.
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="last" className="form-label">
                      Last name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="last"
                      id="last"
                      style={{
                        backgroundColor: "#d3d3d310",
                        fontWeight: "lighter",
                        color: "white",
                      }}
                      required
                    />
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <div className="input-group has-validation">
                      <span className="input-group-text">@</span>
                      <input
                        type="text"
                        className="form-control"
                        name="user"
                        id="user"
                        style={{
                          backgroundColor: "#d3d3d310",
                          fontWeight: "lighter",
                          color: "white",
                        }}
                        required
                      />
                      <div className="invalid-feedback">
                        Your username is required.
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="email" className="form-label">
                      Email{" "}
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      style={{
                        backgroundColor: "#d3d3d310",
                        fontWeight: "lighter",
                        color: "white",
                      }}
                    />
                    <div className="invalid-feedback">
                      Please enter a valid email address for shipping updates.
                    </div>
                  </div>
                </div>
              </form>
              <h6 id="displaysuccess" />
              <button
                className="w-100 btn btn-primary btn-md mt-4"
                style={{
                  backgroundColor: "transparent",
                  fontWeight: "lighter",
                  fontSize: "20px",
                }}
                onClick={addProfile}
              >
                Register / Update Profile
              </button>
            </div>
          </div>
          <hr className="my-3" />

        </main>
      </div>
    </div>
  )
}