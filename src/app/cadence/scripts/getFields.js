export const getFields = `
    import RewardsSystem from 0xdf568a9864e14d98

    pub fun main(): [String] {
        let fieldNames: [String] = []
        let fields = RewardsSystem.fields.keys
    
        for name in fields {
            fieldNames.append(name)
        }
    
        return fieldNames
    }

`;
