export const getMails = `
    import RewardsSystem from 0xdf568a9864e14d98

    pub fun main(): [String] {
        let emails: [String] = []
    
        // Access the emailToFieldPoints dictionary and get all keys (emails)
        let allEmails = RewardsSystem.emailToFieldPoints.keys
    
        // Iterate through all keys to populate the emails array
        for email in allEmails {
            emails.append(email)
        }
    
        return emails
    }
`;
