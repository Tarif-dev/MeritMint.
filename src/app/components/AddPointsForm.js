"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  FiEdit,
  FiChevronDown,
  FiTrash,
  FiShare,
  FiPlusCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { updatePoints } from "../cadence/transactions/updatePoints";
import { getPoints } from "../cadence/scripts/getPoints";
import { getFields } from "../cadence/scripts/getFields";
import { addField } from "../cadence/transactions/addField";
import { FaPlus, FaTrash } from "react-icons/fa";
import { db, app } from "../firebase/config";
import { collection, getDocs, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
const initialFieldValues = { id: uuidv4(), name: "", email: "", points: "" };

const AddPointsForm = ({ fcl }) => {
  const [field, setField] = useState("Select Field");
  const [allFields, setAllFields] = useState([]);
  const [data, setData] = useState({});
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [message, setMessage] = useState("Please select a field");
  const [isData, setIsData] = useState(false);

  const router = useRouter();

  const handleChange = (id, event) => {
    const { name, value } = event.target;
    const updatedFormFields = formFields.map((field) => {
      if (field.id === id) {
        return { ...field, [name]: value };
      }
      return field;
    });
    setFormFields(updatedFormFields);
  };

  const addNewStudentField = () => {
    setFormFields([
      ...formFields,
      {
        id: `new-${formFields.length}`,
        name: "",
        email: "",
        points: "",
        addPoints: "",
        walletAddress: "",
      },
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Assuming all entries in formFields are for the currently selected field
    const transformedData = {
      [field]: {
        id: Date.now(), // Example ID, assuming each submission is unique
        names: [],
        emails: [],
        points: [],
        walletAddresses: [],
      },
    };
    console.log(field.name);

    formFields.forEach((formField) => {
      transformedData[field].names.push(formField.name);
      transformedData[field].emails.push(formField.email);
      transformedData[field].walletAddresses.push(formField.walletAddress);
      // Assuming you want to add the new points to the original points
      const addedPoints = formField.addPoints ? Number(formField.addPoints) : 0;
      transformedData[field].points.push(addedPoints);
    });

    console.log("Transformed Form Data:", transformedData);

    // Here, you'd handle the form submission, likely sending the transformedData to a backend server
    const transactionId = await fcl
      .send([
        fcl.transaction(updatePoints),
        fcl.args([
          fcl.arg(field, fcl.t.String), // For a single string
          fcl.arg(transformedData[field].emails, fcl.t.Array(fcl.t.String)), // For an array of strings
          fcl.arg(transformedData[field].points, fcl.t.Array(fcl.t.UInt64)), // For an array of integers
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
    window.location.reload();
  };

  async function getStudents() {
    let arr = [];
    const q = query(collection(db, "students"));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      setStudents(arr);
    });
  }

  // Immediately-invoked function expression (IIFE) to handle async operations
  const getFieldData = async (tempField) => {
    try {
      if (tempField === "Select Field") return;
      const getAllFieldPoints = async () => {
        const allFieldPoints = await fcl
          .send([
            fcl.script(getPoints),
            fcl.args([fcl.arg(tempField, fcl.t.String)]),
          ])
          .then(fcl.decode);

        return allFieldPoints;
      };

      const transformBackendData = async (fieldName, backendData) => {
        // Initialize the structure with the field name as the key
        const transformedData = {
          [fieldName]: {
            id: Date.now(), // Placeholder ID
            names: [], // Leave the names array blank as per requirement
            emails: [],
            points: [],
            walletAddresses: [],
          },
        };

        // Iterate over the backend data object to fill the emails and points arrays
        Object.entries(backendData).forEach(([email, point]) => {
          transformedData[fieldName].emails.push(email);
          transformedData[fieldName].points.push(parseInt(point, 10)); // Ensure points are stored as numbers
        });

        let arr = students;
        // arr = arr.slice(0, arr.length / 2);
        const filteredData = arr.filter((item) =>
          transformedData[fieldName].emails.includes(item.email)
        );

        // console.log("FD", filteredData);

        transformedData[fieldName].emails.forEach((transformedItem) => {
          const matchedItem = filteredData.find(
            (filteredItem) => filteredItem.email === transformedItem
          );
          if (matchedItem) {
            transformedData[fieldName].names.push(matchedItem.name);
            transformedData[fieldName].walletAddresses.push(
              matchedItem.walletAddress
            );
          }
        });
        console.log("NTD", transformedData[fieldName]);

        return transformedData;
      };

      // Fetch and transform the data
      const allFieldPoints = await getAllFieldPoints();
      const transformedData = await transformBackendData(
        tempField,
        allFieldPoints
      );
      console.log("Transformed Data:", transformedData);
      if (
        field !== "Select Field" &&
        transformedData[tempField].emails.length == 0
      ) {
        setMessage("No data to display");
        setIsData(false);
      }
      if (
        field !== "Select Field" &&
        transformedData[tempField].emails.length !== 0
      ) {
        setMessage("");
        setIsData(true);
      }
      setData(transformedData);
    } catch (error) {
      console.error("Error fetching or transforming data:", error);
    }
  };

  const handleFieldSelect = async (fieldKey) => {
    console.log("Data accessed in handleFieldSelect:", data);
    setField(fieldKey);
    setOpen(false);
    // Populate form fields based on selected field
    const fieldData = data[fieldKey];
    const newFormFields = fieldData.emails.map((email, index) => ({
      id: `${fieldKey}-${index}`, // Unique ID for each field
      name: fieldData.names[index],
      email: email,
      points: fieldData.points[index],
      addPoints: "",
      walletAddress: fieldData.walletAddresses[index],
    }));
    setFormFields(newFormFields);
  };

  const SpringModal = ({ isOpen, setIsOpen, fcl }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer h-72"
          >
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
            >
              <FiPlusCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
              <div className="relative z-10">
                <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                  <FiPlusCircle />
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">
                  Add a Field
                </h3>
                <div className="flex justify-center items-center my-6">
                  <input
                    id="add_field"
                    placeholder="Field"
                    className="text-black py-1.5 px-3 outline-none rounded-sm w-3/4"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      addAField(fcl);
                    }}
                    className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const addAField = async (fcl) => {
    const field = document.getElementById("add_field").value;
    field.toString();
    const transactionId = await fcl
      .send([
        fcl.transaction(addField),
        fcl.args([fcl.arg(field, fcl.t.String)]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionId);

    await fcl.tx(transactionId).onceSealed();
    console.log("Transaction sealed");

    // Immediately-invoked function expression (IIFE) to use async-await
    (async () => {
      try {
        const fetchedFields = await fcl
          .send([fcl.script(getFields), fcl.args([])])
          .then(fcl.decode);

        setAllFields(fetchedFields);
      } catch (error) {
        console.error("Failed to fetch fields:", error);
      }
    })();
  };

  useEffect(() => {
    // This effect listens for changes in `data` and `field`
    // and calls `handleFieldSelect` if the selected field's data is available
    if (field !== "Select Field" && data[field]) {
      handleFieldSelect(field);
    }
  }, [data, field]); // Reacts to changes in `data` or `field`

  useEffect(() => {
    // Immediately-invoked function expression (IIFE) to use async-await
    getStudents();
    (async () => {
      try {
        const fetchedFields = await fcl
          .send([fcl.script(getFields), fcl.args([])])
          .then(fcl.decode);

        setAllFields(fetchedFields);
      } catch (error) {
        console.error("Failed to fetch fields:", error);
      }
    })();
  }, []);

  return (
    <main className="overflow-x-hidden w-screen h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="flex flex-col justify-center w-11/12 border-2 border-blue-700 rounded-xl px-20 bg-white/25 backdrop-blur-sm z-10">
        <motion.div animate={open ? "open" : "closed"} className="relative">
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setOpen(!open)}
              className="gilroy-bold flex w-1/2 items-center gap-2  rounded-md text-indigo-50 bg-indigo-500 hover:bg-indigo-600 transition-colors justify-between"
            >
              <h1></h1>
              <span className="font-medium text-lg">{field}</span>
              <span className="border-l-2 px-4">
                <FiChevronDown size={25} />
              </span>
            </button>
            <button
              onClick={() => setModalIsOpen(true)}
              className="gilroy-bold w-1/2 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
            >
              Add field
            </button>
            <SpringModal
              isOpen={modalIsOpen}
              setIsOpen={setModalIsOpen}
              fcl={fcl}
            />
          </div>

          {open && (
            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { opacity: 1, scaleY: 1 },
                closed: { opacity: 0, scaleY: 0 },
              }}
              className="w-1/2 bg-white shadow-xl rounded-lg "
            >
              {allFields.map((field) => (
                <motion.li
                  key={field}
                  onClick={async () => {
                    setField(field);
                    await getFieldData(field);
                  }}
                  className="p-2 text-sm border-b-2 border-blue-700 gilroy-light whitespace-nowrap hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  {field}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        {isData && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {formFields.map((field, index) => (
              <div key={field.id} className="flex gap-3 justify-center">
                <input
                  type="text"
                  name="name"
                  value={field.name}
                  onChange={(e) => handleChange(field.id, e)}
                  placeholder="Name"
                  className="w-full py-2 px-4 gilroy-light bg-slate-200 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-700 rounded-md shadow-sm"
                />
                <input
                  type="email"
                  name="email"
                  value={field.email}
                  onChange={(e) => handleChange(field.id, e)}
                  placeholder="Email"
                  className="w-full py-2 px-4 gilroy-light bg-slate-200 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-700 rounded-md shadow-sm"
                />
                <input
                  type="text"
                  name="walletAddress"
                  value={field.walletAddress}
                  onChange={(e) => handleChange(field.id, e)}
                  placeholder="Wallet Address"
                  className="w-full py-2 px-4 gilroy-light bg-slate-200 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-700 rounded-md shadow-sm"
                />
                <input
                  type="number"
                  name="points"
                  value={field.points}
                  readOnly // Assuming original points should not be editable
                  className="w-1/4 py-2 px-4 gilroy-light bg-slate-200 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-700 rounded-md shadow-sm"
                />
                <input
                  type="number"
                  name="addPoints"
                  value={field.addPoints}
                  onChange={(e) => handleChange(field.id, e)}
                  placeholder="Add Points"
                  className="w-1/4 py-2 px-4 gilroy-light bg-slate-200 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-700 rounded-md shadow-sm"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addNewStudentField}
              className="mt-4 px-4 py-2 flex items-center justify-center gilroy-bold bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <FaPlus color="#fff" size={14} />
              {" "}
              Add
            </button>
            <div className="flex justify-end items-center mt-4">
              <button
                type="submit"
                class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 gilroy-bold w-full rounded-lg text-xl px-5 py-2.5 text-center mb-8"
              >
                Submit Form
              </button>
            </div>
          </form>
        )}
        {!isData && (
          <span className="text-center gilroy-light py-4 font-medium text-lg text-white justify-center items-center w-full">
            {message}
          </span>
        )}
      </div>
      <div className="circle absolute -top-5 -left-10 z-0"></div>
      <div className="circle absolute top-10 right-80 z-0"></div>
      <div className="circle absolute bottom-20 left-20 z-0"></div>
      <div className="circle absolute bottom-5 right-5 z-0"></div>
    </main>
  );
};

// Variants for the dropdown animation
const wrapperVariants = {
  open: {
    opacity: 1,
    scaleY: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.2,
    },
  },
  closed: {
    opacity: 0,
    scaleY: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.2,
    },
  },
};

const itemVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -20 },
};

export default AddPointsForm;
