let no_server = false;
let server_ip = 'http://localhost:3000';

let activation = {
  type : 0,
  key : "a",
  position : 0
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ "activation" : activation });
  chrome.storage.sync.set({ server_ip });
  chrome.storage.sync.set({ no_server });

  console.log(`Default server ip set to %c${server_ip}`, `color: green`);
  console.log(`Default activation set to %c${JSON.stringify(activation)}`, `color: green`);
});

