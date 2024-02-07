"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import "../../../cadence/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { app, db } from "../../../firebase/config.js";
function Navbar() {
  const [user, setUser] = useState("");
  const router = useRouter();
  const [teacher, setTeacher] = useState();

  fcl
    .config()
    .put("app.detail.title", "Merit Mint")
    .put(
      "app.detail.icon",
      "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat5.svg"
    )
    .put("accessNode.api", "https://rest-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

  const logIn = async () => {
    fcl.authenticate();
  };
  async function setupCollection() {
    console.log("Fcl authz", fcl.authz);
    const transactionId = await fcl.mutate({
      cadence: `
     import ExampleNFT from 0xDeployer
     import NonFungibleToken from 0xStandard
     import MetadataViews from 0xStandard

     transaction() {
       
       prepare(signer: AuthAccount) {
         if signer.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath) == nil {
           signer.save(<- ExampleNFT.createEmptyCollection(), to: ExampleNFT.CollectionStoragePath)
           signer.link<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(ExampleNFT.CollectionPublicPath, target: ExampleNFT.CollectionStoragePath)
         }
       }

       execute {
         
       }
     }
     `,
      args: (arg, t) => [],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });

    console.log("Transaction Id", transactionId);
  }
  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  useEffect(() => {
    teacherData();
    if (user.addr) {
      if (!teacher.includes(user.addr)) {
        router.push("/studentDash");
      }
    }
    if (!user) {
    }
  }, [user]);
  const teacherData = async () => {
    const q = query(collection(db, "teacher"));
    let arr = [];
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        arr.push(doc.data().walletAddress);
      });
    });
    console.log(arr);
    setTeacher(arr);
  };
  return (
    <>
      <div className="absolute z-10 left-1/4 mt-5 px-8 py-5 bg-white/30 w-1/2 rounded-xl backdrop-blur-sm flex items-center justify-between">
        {/* <ul className="flex">
          <button className="text-lg text-white tracking-wide px-3 py-2 hover:bg-white/10 rounded-lg">
            Product
          </button>
          <button className="text-lg text-white tracking-wide px-3 py-2 hover:bg-white/10 rounded-lg">
            History
          </button>
          <button className="text-lg text-white tracking-wide px-3 py-2 hover:bg-white/10 rounded-lg">
            Contact
          </button>
        </ul> */}
        <a href="#" className="text-white text-3xl font-extrabold ">
          MeritMint.
        </a>

        <span className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => logIn()}
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          >
            {!user.loggedIn ? (
              <div className="flex align-baseline">
                <svg
                  className="w-4 h-4 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 19"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Sign in</span>
              </div>
            ) : (
              user.addr.slice(0, 4) + "..." + user.addr.slice(-5, -1)
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              router.push("/demo");
            }}
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          >
            Demo
          </button>

          {user.loggedIn && (
            <button
              type="button"
              onClick={async () => {
                fcl.unauthenticate;
                await localStorage.setItem("Vault", "");
                setUser("");
              }}
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            >
              Logout
            </button>
          )}
        </span>
      </div>
    </>
  );
}

export default Navbar;
