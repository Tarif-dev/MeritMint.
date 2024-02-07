"use client";

import {
  FiEdit,
  FiChevronDown,
  FiTrash,
  FiShare,
  FiPlusCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { addField } from "../cadence/transactions/addField";
import { getFields } from "../cadence/scripts/getFields";
import { getPoints } from "../cadence/scripts/getPoints";
import { useRouter } from "next/navigation";

function Buttons({
  fetchResults,
  field,
  setField,
  fcl,
  setData,
  setTopThree,
  students,
  setStudents,
}) {
  const [open, setOpen] = useState(false);
  // const [data, setData] = useState({});
  // const [field, setField] = useState("Select Field");
  const [allFields, setAllFields] = useState([]);
  const [newField, setNewField] = useState("");

  const router = useRouter();

  const Option = ({ text, /* Icon, */ setOpen }) => {
    return (
      <motion.li
        variants={itemVariants}
        onClick={() => {
          setOpen(false);
          setField(text);
        }}
        className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
      >
        {/* <motion.span variants={actionIconVariants}>
          <Icon />
        </motion.span> */}
        <span>{text}</span>
      </motion.li>
    );
  };

  const getFieldData = async (tempField) => {
    try {
      if (tempField === "Select Field") return;
      setOpen(false);
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

        return transformedData;
      };

      // Fetch and transform the data
      const allFieldPoints = await getAllFieldPoints();
      const transformedData = await transformBackendData(
        tempField,
        allFieldPoints
      );
      console.log("Transformed Data:", transformedData);
      setData(transformedData);
    } catch (error) {
      console.error("Error fetching or transforming data:", error);
    }
  };

  // Modified to return transformed data instead of setting it to state
  const getFieldDataModified = async (tempField) => {
    if (tempField === "Select Field") return null;
    const allFieldPoints = await fcl
      .send([
        fcl.script(getPoints),
        fcl.args([fcl.arg(tempField, fcl.t.String)]),
      ])
      .then(fcl.decode);

    // Assuming backendData is structured correctly for transformation
    // Initialize the structure with the field name as the key
    const transformedData = {
      id: Date.now(), // Placeholder ID
      emails: [],
      points: [],
    };

    // Iterate over the allFieldPoints object to fill the emails and points arrays
    Object.entries(allFieldPoints).forEach(([email, point]) => {
      transformedData.emails.push(email);
      transformedData.points.push(parseInt(point, 10)); // Ensure points are stored as numbers
    });

    return transformedData;
  };

  const calculateTopEmailsAcrossFields = async () => {
    const fields = await fcl
      .send([fcl.script(getFields), fcl.args([])])
      .then(fcl.decode);
    const emailPointsMap = {}; // Maps emails to an array of their points across fields

    for (const field of fields) {
      const fieldData = await getFieldDataModified(field);
      if (fieldData) {
        fieldData.emails.forEach((email, index) => {
          if (!emailPointsMap[email]) emailPointsMap[email] = [];
          emailPointsMap[email].push(fieldData.points[index]);
        });
      }
    }

    // Calculate average points for each email
    const emailAverages = Object.entries(emailPointsMap).map(
      ([email, points]) => ({
        email,
        averagePoints:
          points.reduce((acc, cur) => acc + cur, 0) / points.length,
      })
    );

    // Sort by average points and take the top 3
    const topEmails = emailAverages
      .sort((a, b) => b.averagePoints - a.averagePoints)
      .slice(0, 3);

    console.log(topEmails);

    students = students.slice(0, students.length / 2);

    topEmails.forEach((topEmail) => {
      const matchedItem = students.find(
        (student) => student.email === topEmail.email
      );
      if (matchedItem) {
        topEmail.name = matchedItem.name;
        topEmail.walletAddress = matchedItem.walletAddress;
      }
    });

    console.log(topEmails);

    setTopThree(topEmails);
  };

  // const endTerm = async () => {
  //   // start: fetch all fields
  //   const fields = await fcl
  //     .send([fcl.script(getFields), fcl.args([])])
  //     .then(fcl.decode);
  //   console.log(fields);
  //   // end: fetch all fields
  // };

  useEffect(() => {
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
  }, []);

  return (
    <div className=" pt-32 flex items-center justify-center gap-10">
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 gilroy-bold rounded-lg text-sm pl-5 py-2 text-center inline-flex items-center w-40"
        >
          <span className="font-medium text-lg mr-2">{field}</span>
          <span className="px-1 border-l-2">
            <FiChevronDown />
          </span>
        </button>

        {open && (
          <motion.ul
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { opacity: 1, scaleY: 1 },
              closed: { opacity: 0, scaleY: 0 },
            }}
            className="absolute shadow-xl rounded-lg z-50 mt-2 w-40 bg-white"
          >
            {allFields.map((field) => (
              <motion.li
                key={field}
                onClick={async () => {
                  setField(field);
                  await getFieldData(field);
                }}
                className="p-2 gilroy-light text-sm font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
              >
                {field}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>
      <button
        onClick={() => calculateTopEmailsAcrossFields()}
        className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 gilroy-bold rounded-lg text-lg px-5 py-2 text-center inline-flex items-center "
      >
        Results
      </button>
      <button
        onClick={() => router.push("/add")}
        className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 gilroy-bold rounded-lg text-lg px-5 py-2 text-center inline-flex items-center "
      >
        Add Points
      </button>
    </div>
  );
}

export default Buttons;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
