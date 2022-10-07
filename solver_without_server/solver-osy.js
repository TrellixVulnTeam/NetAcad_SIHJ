let chapter = "03"

let google_search = async (query) => {
    const root = document.createElement('div');

    const html = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`)
    root.innerHTML = await html.text()

	let h3s = root.querySelectorAll("h3")
	let links = []

	for(let h3 of h3s)
	{
		let el = h3.parentNode

		if(el.getAttribute("href") != null) links.push(el.getAttribute("href").replace("/url?q=", "").split("&amp")[0])
	}

	return links
}

let find_answers_premiumexams = async (link) => {
    const map = {}

    const response = await fetch(link)
    const root = document.createElement("div")
    root.innerHTML = await response.text()

    const ol = root.querySelector(".entry-content > ol");

    for(let li of ol.querySelectorAll(":scope > li"))
    {
        const title = li.querySelector("h3")?.textContent

        const answers = li.querySelector("ul").querySelectorAll("span")

        if(title == undefined || answers.length === 0) continue

        map[
            title.replaceAll(" ", "").replaceAll("\n", "").toLowerCase()
        ] = answers
    }

    return map
}

let find_answers_itexamanswers = async (link) => {
    const map = {}

    const response = await fetch(link)
    const root = document.createElement("div")
    root.innerHTML = await response.text()

    const ol = root.querySelector("#content_box ol");

    for(let li of ol.querySelectorAll(":scope > li"))
    {
        const title = li.querySelector("strong")?.textContent

        const answers = li.querySelector("ul").querySelectorAll("strong")

        if(title == undefined || answers.length === 0) continue

        map[
            title.replaceAll(" ", "").replaceAll("\n", "").toLowerCase()
        ] = answers
    }

    return map
}

let links = await google_search(`netacad linux essentials chapter ${chapter} exam answers`);

let url_map = {
    "premiumexam.net" : find_answers_premiumexams,
    "itexamanswers.net" : find_answers_itexamanswers
}

let find_answers = async () => {
    for(let link of links)
    {
        for(let url in url_map)
        {
            if(link.indexOf(url) !== -1)
            {
                return await url_map[url](link)
            }
        }
    }

    return null
}

// get answers map
let answers_map = await find_answers()
console.log(answers_map)

// for every div in #assertment
for(let div of document.querySelector("#assessment").childNodes)
{
        // if div is not panel continue
        if(!div.classList || !div.classList.contains("panel")) continue;

        // get heading and set css style
        let panel_heading = div.querySelector(".panel-heading")
        panel_heading.style = "display: flex; justify-content: space-between;"
        
        // map values
        let panel_body = div.querySelector(".panel-body")
        let title = panel_body.querySelector("div")
        let question = title.textContent.replaceAll(" ", "").replaceAll("\n", "").toLowerCase()

        let labels = [].slice.call(panel_body.querySelectorAll(":scope > div"), 1)
        
        // create button and insert it
        let button = document.createElement("button")
        button.style = "width:20%; height:20px; padding:0; margin:0; outline: none; border:none; background: transparent;"
        
        // add event listener
        button.addEventListener("click", (e) => {
            e.preventDefault();

            // get values
            let values = answers_map[question];

            // if values not found, return
            if(values == undefined) {
                title.style = "color: red;"

                setTimeout(() => {
                    title.style = "color:black;"
                }, 1000)

                return;
            }
            
            // for every label in labels
            for(let label of labels)
            {
                // get answer and checkbox
                let answer = label.querySelector(".answer_container > div").textContent
                let checkbox = label.querySelector("input")

                // for answers in list
                for(let a of values)
                {
                    // if answer is answer, check checkbox
                    if(a.textContent.replaceAll(" ", "").replaceAll("\n", "").toLowerCase() === answer.replaceAll("\n", "").replaceAll(" ", "").toLowerCase())
                    {
                        checkbox.checked = true;
                        break;
                    }
                }
            }
        })

        // add button
        panel_heading.appendChild(button)
}