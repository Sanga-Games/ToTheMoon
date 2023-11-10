var TimeOffset = 0;

async function getTimeOffset() {
    try {
      const startTime = Date.now();
      const response = await fetch('https://worldtimeapi.org/api/ip');
      const endTime = Date.now();
  
      if (!response.ok) {
        throw new Error(`Failed to fetch time from server: ${response.statusText}`);
      }
  
      const serverTime = await response.json();
      const roundTripTime = endTime - startTime;
      const localTime = new Date();
      const serverTimeUTC = new Date(serverTime.utc_datetime);
  
      TimeOffset = serverTimeUTC.getTime() - (localTime.getTime() + roundTripTime / 2);
      console.log("Compensated for timeoffset");
    } catch (error) {
      console.error('Error:', error.message);
      return 0; // Return 0 if there's an error
    }
}

getTimeOffset();
  
function getCurrentUTCSeconds() {
    const currentUTCTime = new Date(Date.now() + TimeOffset);
    //const utcSeconds = Math.floor(currentUTCTime.getTime() / 1000);
    return currentUTCTime.getTime();
}
  

  