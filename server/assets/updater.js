const fs = require("fs");
const fetch = require("sync-fetch")

let mainLink = "https://raw.githack.com/joojn1122/netacad/main/server"

console.log("Looking for updates..")

const json = JSON.parse(fs.readFileSync(__dirname + "/../info.json"), {encoding:'utf8', flag:'r'})
const version = json['version']

const newJson = fetch(`${mainLink}/info.json`).json()
const newVersion = newJson['version']


if(newVersion !== version)
{
        console.log("Update found, updating..")
        try
        {
                let newServerJS = fetch(`${mainLink}/assets/server.js`).text()
                let newUtilJS = fetch(`${mainLink}/assets/util.js`).text()
                let newGoogleJS = fetch(`${mainLink}/assets/google.js`).text()
                
                console.log("Writing updates..")

                fs.writeFileSync(__dirname + "/server.js", newServerJS, "utf8")
                fs.writeFileSync(__dirname + "/util.js", newUtilJS, "utf8")
                fs.writeFileSync(__dirname + "/google.js", newGoogleJS, "utf8")

                fs.writeFileSync(__dirname + "/../info.json", JSON.stringify(newJson, null, 4), "utf8")
        }
        catch(e)
        {
                console.log("Error happened.. " + e)
                process.exit()
        }
}
else
{
        console.log("Up to date!");
}

const server = require("./server")
server.run()