"use client";

import React, { useEffect, useState } from "react";
import Buttons from "../components/Buttons";
import PointsDatatable from "../components/PointsDatatable";
import { getFields } from "../cadence/scripts/getFields";
import { updatePoints } from "../cadence/transactions/updatePoints";
import { getPoints } from "../cadence/scripts/getPoints";
import { getMails } from "../cadence/scripts/getMails";
import * as fcl from "@onflow/fcl";
import "../cadence/config";
// Signer - 0xfe62afac91a25d47
// Contract Address - 0xfe62afac91a25d47fcl
function Demo() {
  const [field, setField] = useState("Select Field");
  const [user, setUser] = useState("Select Field");
  const [data, setData] = useState({});
  const [topThree, setTopThree] = useState([]);
  const [students, setStudents] = useState([]);
  fcl
    .config()
    .put("app.detail.title", "Merit Mint")
    .put(
      "app.detail.icon",
      "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat5.svg"
    )
    .put("accessNode.api", "https://rest-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

  const getAllFields = async () => {
    const fields = await fcl
      .send([fcl.script(getFields), fcl.args([])])
      .then(fcl.decode);
    console.log(fields);
  };

  const getAllMails = async () => {
    const mails = await fcl
      .send([fcl.script(getMails), fcl.args([])])
      .then(fcl.decode);
    console.log(mails);
  };

  const getAllPoints = async () => {
    const field = "Computer";
    const points = await fcl
      .send([fcl.script(getPoints), fcl.args([fcl.arg(field, fcl.t.String)])])
      .then(fcl.decode);

    // Log the entire array of points
    console.log(points);

    // Example: Process each point in the array
    // points.forEach((point, index) => {
    //   console.log(`Point ${index + 1}:`, point);
    // You can do more here, like updating the UI or storing the points in state
    // });

    // If you're using React and want to display these points, you might set them to state
    // Assuming you have a useState hook set up for storing points
    // this.setState({ points }); // For class components
    // setPoints(points); // For functional components with useState
  };

  const updateStudentPoints = async () => {
    var field = "physics";
    var emails = ["123@gmail.com", "abc@gmail.com"];
    var points = [5, 6];

    const transactionId = await fcl
      .send([
        fcl.transaction(updatePoints),
        fcl.args([
          fcl.arg(field, fcl.t.String), // For a single string
          fcl.arg(emails, fcl.t.Array(fcl.t.String)), // For an array of strings
          fcl.arg(points, fcl.t.Array(fcl.t.UInt64)), // For an array of integers
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log("TR ID:", transactionId);

    await fcl.tx(transactionId).onceSealed();
    console.log("Transaction sealed");
  };

  const fetchResults = async (field) => {
    if (field === "Select Field") return;
  };

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  return (
    <>
      <Buttons
        fetchResults={fetchResults}
        field={field}
        setField={setField}
        setData={setData}
        fcl={fcl}
        setTopThree={setTopThree}
        students={students}
        setStudents={setStudents}
      />
      {/* <button onClick={logIn}>Log In</button> */}
      {/* <button onClick={getAllFields}>Get Fields</button>
      <button onClick={getAllMails}>Get All Emails</button> */}
      {/* <h2>Current Address: {user && user.addr ? user.addr : "----------"}</h2> */}
      {/* <button onClick={updateStudentPoints}>Update Points</button>
      <button onClick={getAllPoints}>Get All Points</button> */}
      <PointsDatatable
        data={data}
        field={field}
        setField={setField}
        topThree={topThree}
        students={students}
        setStudents={setStudents}
      />
      <div className="circle2 absolute -bottom-16 -right-10"></div>
      <div className="circle2 absolute top-12 right-8 "></div>
      <div className="circle2 absolute bottom-20 -left-10"></div>
      <div className="circle2 absolute top-0 left-40"></div>
    </>
  );
}

export default Demo;
