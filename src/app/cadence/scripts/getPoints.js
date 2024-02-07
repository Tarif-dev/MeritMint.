export const getPoints = `
    import RewardsSystem from 0xdf568a9864e14d98

    pub fun main(fieldName: String): {String: UInt64} {
        return RewardsSystem.getPointsOfAllStudentsInField(fieldName: fieldName)
    }
`;
