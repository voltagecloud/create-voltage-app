import { createInterface } from 'readline';
import * as lnd from './lnd.js';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const methods = {
  '1': { name: 'Get Node Info', fn: lnd.getInfo },
  '2': { name: 'List Channels', fn: lnd.listChannels },
  '3': { name: 'List Invoices', fn: lnd.listInvoices },
  '4': { name: 'Create Invoice', fn: async () => {
    const amount = await question('Enter amount in sats: ');
    return lnd.addInvoice(parseInt(amount));
  }},
  '5': { name: 'Pay Invoice', fn: async () => {
    const paymentRequest = await question('Enter payment request: ');
    return lnd.sendPayment(paymentRequest);
  }},
  '6': { name: 'Wallet Balance', fn: lnd.walletBalance },
  '7': { name: 'List Peers', fn: lnd.listPeers },
  '8': { name: 'Connect to Peer', fn: async () => {
    const pubkey = await question('Enter peer pubkey: ');
    const host = await question('Enter peer host: ');
    return lnd.connectPeer({ pubkey, host });
  }},
  '9': { name: 'Generate New Address', fn: lnd.newAddress },
};

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function displayMenu() {
  console.log('\n=== LND Test Menu ===');
  Object.entries(methods).forEach(([key, value]) => {
    console.log(`${key}. ${value.name}`);
  });
  console.log('0. Exit');
  
  const answer = await question('\nSelect an option: ');
  
  if (answer === '0') {
    rl.close();
    return;
  }

  if (methods[answer]) {
    try {
      await methods[answer].fn();
    } catch (error) {
      console.error('Operation failed:', error.message);
    }
  } else {
    console.log('Invalid option');
  }

  displayMenu();
}

// Start the menu
console.log('Testing connection to LND node...');
lnd.getInfo()
  .then(() => {
    console.log('Successfully connected to LND node!');
    displayMenu();
  })
  .catch((error) => {
    console.error('Failed to connect to LND node:', error.message);
    rl.close();
  });
