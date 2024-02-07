export const updatePoints = `
    import RewardsSystem from 0xdf568a9864e14d98

    transaction(fieldName: String, studentEmails: [String], pointsArray: [UInt64]) {

        prepare(signer: AuthAccount) {
            if studentEmails.length != pointsArray.length {
                panic("The length of student emails and points arrays must be equal.")
            }

            RewardsSystem.updateStudentPoints(fieldName: fieldName, studentEmails: studentEmails, pointsArray: pointsArray)
        }

        execute {
            log("Points updated for students in field fieldName")
        }
    }
`;
