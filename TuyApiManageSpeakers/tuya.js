const TuyAPI = require('tuyapi');

const powerOn = process.argv[2] === "on"

const devices = [
  new TuyAPI({
  id: '03200172dc4f22245775',
  key: ']/g`=C`6sD?h1>))'}),
  new TuyAPI({
    id: '03200172b4e62d0b831c',
    key: 'Bh_f9T=-:;Cozt.-'}),
]

// Find device on network
devices.forEach((device, index) => {
    turnOnOff(device, index)
})

function turnOnOff(device, index) {
  let stateHasChanged = false

  device.find().then(() => {
    // Connect to device
    device.connect();
  });
  
  // Add event listeners
  device.on('connected', () => {
    console.log('Connected to device!');
  });
  
  device.on('disconnected', () => {
    console.log('Disconnected from device.');
  });
  
  device.on('error', error => {
    console.log('Error!', error);
    throw new Error('error...');
    /*
    if (String(error).includes("ECONNRESET")) {
      console.log('lets try something')
      setTimeout(() => {
        console.log("wait repeat")
        turnOnOff(device, index)
      }, 100)
    }
    */
  });
  
  device.on('data', data => {


    console.log('Data from device:', data);
  
    let status = !! data.dps['1']
    console.log(`Boolean status of default property: ${status}.`);

    if (status === powerOn) {
      device.disconnect()
    }
  
    // Set default property to opposite
    if (!stateHasChanged && status !== powerOn) {
      device.set({set: powerOn});
  
      // Otherwise we'll be stuck in an endless
      // loop of toggling the state.
      stateHasChanged = true;
    }
  });
}