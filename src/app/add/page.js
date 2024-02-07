"use client";

import React from "react";
import AddPointsForm from "../components/AddPointsForm";
import Buttons from "../components/Buttons";
import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("app.detail.title", "My Flow NFT DApp")
  .put(
    "app.detail.icon",
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcryptologos.cc%2Fflow&psig=AOvVaw1TyxWeaD6I6CMxyisapG_Y&ust=1706894077576000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCIDlm4_SioQDFQAAAAAdAAAAABAE"
  )
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

function Add() {
  return (
    <div>
      <AddPointsForm fcl={fcl} />
    </div>
  );
}

export default Add;
