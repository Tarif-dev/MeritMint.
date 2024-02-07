pub contract RewardsSystem {

    pub struct PointsRecord {
        pub(set) var points: UInt64

        init(points: UInt64) {
            self.points = points
        }
    }

    pub struct Field {
        pub let name: String

        init(name: String) {
            self.name = name
        }
    }

    pub var fields: {String: Field}
    pub var emailToFieldPoints: {String: {String: PointsRecord}}

    init() {
        self.fields = {}
        self.emailToFieldPoints = {}
    }

    pub fun addField(name: String) {
        self.fields[name] = Field(name: name)
    }

    pub fun updateStudentPoints(fieldName: String, studentEmails: [String], pointsArray: [UInt64]) {
        // Ensure the field exists
        if self.fields[fieldName] == nil {
            panic("Field not found")
        }

        // Check if the arrays have the same length
        let length = studentEmails.length
        if length != pointsArray.length {
            panic("The length of student emails and points arrays must be equal.")
        }

        var index = 0
        while index < length {
            let email = studentEmails[index]
            let points = pointsArray[index]
            
            var fieldPoints = self.emailToFieldPoints[email] ?? {}
            let currentPoints = fieldPoints[fieldName]?.points ?? 0
            let totalPoints = currentPoints + points
            
            fieldPoints[fieldName] = PointsRecord(points: UInt64(totalPoints))
            self.emailToFieldPoints[email] = fieldPoints

            index = index + 1
        }
    }

    pub fun getStudentPoints(fieldName: String, email: String): UInt64 {
        let fieldPoints = self.emailToFieldPoints[email] ?? {}
        return fieldPoints[fieldName]?.points ?? 0
    }

    // Function to get the points of all students in a specific field
    pub fun getPointsOfAllStudentsInField(fieldName: String): {String: UInt64} {
        var studentPoints: {String: UInt64} = {}
        
        let emails = self.emailToFieldPoints.keys
        var index = 0
        while index < emails.length {
            let email = emails[index]
            let fieldsPoints = self.emailToFieldPoints[email]!

            // Check if the student has points for the given field
            if let pointsRecord = fieldsPoints[fieldName] {
                studentPoints[email] = pointsRecord.points
            }

            index = index + 1
        }

        return studentPoints
    }
}
