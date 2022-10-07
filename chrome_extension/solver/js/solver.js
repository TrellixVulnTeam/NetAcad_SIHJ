//import { getAnswers } from "./util" => globalFunction

let url;
let activation;
let no_server_;

chrome.storage.sync.get("server_ip", ({ server_ip }) => {
  url = server_ip
})

chrome.storage.sync.get("no_server", ({no_server}) => {
  no_server_ = no_server;
})

chrome.storage.sync.get("activation", (activation_) => {

    activation = activation_["activation"]

    // launch everything
    setup()
})

async function solve_netacad()
{
    this.question = document.querySelector(".question:not(.hidden)")

    this.fieldSet = this.question.querySelector(".questionFieldset")

    if(this.fieldSet === null)
    {
      this.questionText = this.question.querySelector("textformat").textContent
    }
    else
    {
      this.questionText = this.fieldSet.querySelector(".questionText > .mattext").textContent
    }
   
    console.log("Searching for answer!")

    let json;

    if(no_server_)
    {
      json = await getAnswers(this.questionText)
    }
    else
    {
      json = await (await fetch(`${url}/api?q=${encodeURIComponent(this.questionText)}`)).json();
    }

    if(json['data'] == null)
    {
     console.error("Answer not found! L")
     return;
    }

    if(json['data'] === "image")
    {
        let imageContent = this.question.querySelector(".questionImageContent");

        if(imageContent === null)
        {
          imageContent = document.createElement("div")
          imageContent.classList.add("questionImageContent")

          this.question.appendChild(imageContent)
        }

        // remove childs
        imageContent.innerHTML = ""

        for(let image of json['images'])
        {
          let img = document.createElement("img")
          img.src = image

          imageContent.appendChild(img)
        }

        return;
    }

    this.data = json['data']

    console.log("Answer found " + this.data);

    this.clickAnswers = this.fieldSet.querySelectorAll(".coreContent > li")

    for(let an of this.clickAnswers)
    {
      try
      {
        let el = an.querySelector("label")
        if(el == null) continue;

        let text = el.querySelector(".mattext").textContent
        let checkBox = el.querySelector("input")

        for(let dat of this.data)
        {
          let strDat = dat.replaceAll(" ", "").toLowerCase().replaceAll("\n", "")
          let strText = text.replaceAll(" ", "").toLowerCase().replaceAll("\n", "")

          if(strDat === strText)
          {
            console.log("Found answer -> clicking")

            checkBox.checked = true
          }
        }
      }  
      catch (e){ console.error(e) }
    }
}

function create_button() {

    let button = document.createElement("button")
    button.id = "insane_id";

    switch(activation.position)
    {
        case 0:
          button.style = "left: 0; top: 0;";
          break

        case 1:
          button.style = "right: 0; top: 0;";
          break

        case 2:
          button.style = "left: 0; bottom: 0;";
          break

        case 3:
          button.style = "right: 0; bottom: 0;";
          break
    }

    document.body.appendChild(button)
 
    button.addEventListener('click', solve_netacad)
}

function create_key() {

  document.addEventListener("keypress", (e) => {
      if(e.key.toLowerCase() === activation.key.toLowerCase())
      {
        solve_netacad()
      }
  })
}


function setup(){

    switch(activation.type)
    {
      case 0:
        create_button()
        break

      case 1:
        create_key()
        break

      default:
        console.log("Something went wrong..")
    }
}