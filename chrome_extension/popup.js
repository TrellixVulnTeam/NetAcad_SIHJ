const server_input = document.querySelector("#server_input")
const answer_type_input = document.querySelector("#answer_type")
const key_div = document.querySelector("#key_div")
const key_input = document.querySelector("#key_input")
const direction_div = document.querySelector("#direction_div")
const direction_selector = document.querySelector("#direction_selector")
const no_server_checkbox = document.querySelector("#no_server")
const server_api_div = document.querySelector("#server_api_div")

let activation_;
let no_server_;

let toggleServerApi = () => {	
	server_api_div.style.display = no_server_ ? "none" : "block" 
}

chrome.storage.sync.get("no_server", ({ no_server }) => {

	no_server_ = no_server

	no_server_checkbox.checked = !no_server

	toggleServerApi();
});

no_server_checkbox.addEventListener("change", () => {
	no_server_ = !no_server_;

	chrome.storage.sync.set({ "no_server" : no_server_ })

	toggleServerApi();
})

chrome.storage.sync.get("server_ip", ({ server_ip }) => {
	server_input.value = server_ip;
});

chrome.storage.sync.get("activation", ({ activation }) => {
	activation_ = activation

	key_input.value = activation.key
	answer_type_input.selectedIndex = activation.type
	direction_selector.selectedIndex = activation.position

	toggleKeyDiv(activation.type)
})

server_input.addEventListener("change", (e) => {
	let value = server_input.value.replaceAll(" ", "")
 
	if(!value.startsWith("http"))
	{

		if(value.indexOf("localhost") > -1)
		{
			value = "http://" + value
		}
		else
		{
			value = "https://" + value
		}
	}

	chrome.storage.sync.set({ "server_ip" : value})
})

answer_type_input.addEventListener("change", (e) => {
	activation_.type = answer_type_input.selectedIndex
	update_activation()

	toggleKeyDiv(answer_type_input.selectedIndex)
})

key_input.addEventListener("change", (e) => {
	activation_.key = key_input.value
	update_activation()
})

direction_selector.addEventListener("change", (e) => {
	activation_.position = direction_selector.selectedIndex
	update_activation()
})

function toggleKeyDiv(answer_type) {
	direction_div.style.display = ((answer_type === 0) ? "" : "none")
	key_div.style.display = ((answer_type === 1) ? "" : "none")
}

function update_activation() {
	chrome.storage.sync.set({ "activation" : activation_ })
}