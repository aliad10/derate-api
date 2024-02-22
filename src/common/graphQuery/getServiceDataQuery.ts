export const getServiceDataQuery = `{
  serviceReputation(id: "SERVICE_ADDRESS") {
      id
      trustScore
      totalFeedbackGot
    }
  }`;
