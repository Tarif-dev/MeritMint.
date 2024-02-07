import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useRouter } from "next/navigation";
// import { collection, getDocs, getFirestore } from "firebase/firestore";
// import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { app, db } from "../firebase/config";
const columns = [
  {
    name: "SL No.",
    selector: (row) => row.id,
    center: true,
    style: {
      fontSize: "15px",
    },
  },
  {
    name: "Name",
    selector: (row) => row.name,
    center: true,
    style: {
      fontSize: "15px",
    },
  },
  {
    name: "Email",
    selector: (row) => row.email,
    center: true,
    style: {
      fontSize: "15px",
    },
  },
  {
    name: "Points",
    selector: (row) => row.point,
    center: true,
    style: {
      fontSize: "15px",
    },
  },
];

const customStyles = {
  table: {
    style: {
      color: "white",
      backgroundColor: "#A262DE",
    },
  },
  headCells: {
    style: {
      FontFace: "Gilroy",
      fontSize: "16px",
      fontWeight: "bold",
      backgroundColor: "#F3F4F6",
    },
  },
  rows: {
    style: {
      FontFace: "Gilroy",
      color: "white",
      backgroundColor: "#A262DE",
      minHeight: "72px",
    },
  },
};

function PointsDatatable({
  field,
  setField,
  data,
  setData,
  topThree,
  students,
  setStudents,
}) {
  const [loader, setLoader] = useState(true);
  const [fieldData, setFieldData] = useState([]);
  const router = useRouter();

  const topThreeColumns = [
    {
      name: "SL No.",
      // Use a custom cell render function to display the row index
      cell: (row, index) => index + 1, // Adding 1 because index is 0-based
      center: true,
      style: {
        fontSize: "15px",
      },
    },
    {
      name: "Name",
      selector: (row) => row.name,
      center: true,
      style: {
        fontSize: "15px",
      },
    },
    {
      name: "Email",
      selector: (row) => row.email,
      center: true,
      style: {
        fontSize: "15px",
      },
    },
    {
      name: "Wallet Address",
      selector: (row) => row.walletAddress,
      center: true,
      style: {
        fontSize: "15px",
      },
    },
    {
      name: "Points",
      selector: (row) => row.averagePoints,
      center: true,
      style: {
        fontSize: "15px",
      },
    },
    {
      name: "Actions",
      button: true,
      ignoreRowClick: true,
      allowOverflow: true,
      cell: (row) => (
        <button
          style={{ fontSize: "15px", padding: "5px 10px", cursor: "pointer" }}
          onClick={() => router.push(`/rewards/${row.walletAddress}`)}
        >
          Reward
        </button>
      ),
    },
  ];

  useEffect(() => {
    setLoader(false);
    getStudents();
  }, []);

  useEffect(() => {
    // Checking if the field exists in the data and it has names, emails, and points arrays
    if (data[field] && data[field].emails && data[field].points) {
      const transformedData = data[field].emails.map((email, index) => ({
        id: index + 1,
        name: data[field].names[index],
        email: email,
        point: data[field].points[index],
        walletAddress: data[field].walletAddresses[index],
      }));
      setFieldData(transformedData);
      let emailArray = [];
      transformedData.map((elem) => {
        emailArray.push(elem.email);
      });
      console.log("TD:", transformedData);
      let arr = students;
      arr = arr.slice(0, arr.length / 2);
      const filteredData = arr.filter((item) =>
        emailArray.includes(item.email)
      );

      transformedData.forEach((transformedItem) => {
        const matchedItem = filteredData.find(
          (filteredItem) => filteredItem.email === transformedItem.email
        );
        if (matchedItem) {
          transformedItem.name = matchedItem.name;
          transformedItem.walletAddress = matchedItem.walletAddress;
        }
      });
      console.log("NTD", transformedData);
    }
  }, [field, data]);

  if (loader) {
    return <div>Loading</div>;
  }

  async function getStudents() {
    const q = query(collection(db, "students"));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let arr = students;
        arr.push(doc.data());
        setStudents(arr);
      });
      console.log(students);
    });
  }
  return (
    <div className="flex justify-center">
      <div className="my-16 w-3/4 border-gray-500 border-2">
        <DataTable
          title={topThree.length !== 0 ? "Top Three" : "Student Points"}
          columns={topThree.length !== 0 ? topThreeColumns : columns}
          data={topThree.length !== 0 ? topThree : fieldData}
          pagination
          striped
          
          pointerOnHover
          responsive
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}

export default PointsDatatable;
