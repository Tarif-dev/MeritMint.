export const addField = `
    import RewardsSystem from 0xdf568a9864e14d98

    transaction(fieldName: String) {

        prepare(signer: AuthAccount) {
            // Only the account that deployed the contract or an authorized account should be able to add fields
            RewardsSystem.addField(name: fieldName)
        }
    
        execute {
            log("Added new field: fieldName")
        }
    }

`;
