export const getUserDataQuery = `{
  userReputation(id: "USER_ID") {
    id
    trustScore
    totalFeedbackGot
    totalFeedbackSubmitted
    }
  }`;
