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

let linkEntries = {
    "itexamanswers.net" : ".dwqa-question-content",
    "itexam24.com" : ".entry-content",
    "ccna7.org" : ".entry-content",
    "ccnav7.net" : ".entry-content",
    "examict.com" : ".entry-content",
    "premiumexam.net" : ".entry-content",
    "infraexam.com" : ".entry-content",
    "examans.com" : ".entry-content",
    "ccna6rs.com" : ".entry-content"
}

let parseWeb = async (url, elementName) => {
	try{
		const html = await(await fetch(url, {
          headers : {
            "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
          }
        })).text()

        const root = document.createElement("div")
        root.innerHTML = html
		
	    let answerCont = root.querySelector(elementName)
	    
	    if(answerCont == null)
	    {
	    	return { data : null }
	    }
	    
	    let uls = answerCont.querySelectorAll("ul")
	    let imgs = answerCont.querySelectorAll("img")

	    if(uls.length > 0)
	    {
				let answers = []

				for(let ul of uls)
				{
					for(let answer of ul.querySelectorAll("span"))
			        {
			            answers.push(answer.textContent)
			        }
				}
		  
		    return {
		    	data : answers
		    }
	    }
	    
	    // image
	    else if(imgs.length > 0)
	    {
	    	let srcs = [];

	    	for(let image of imgs)
	    	{
	    		let src = image.getAttribute("src")

	    		if(src != null) srcs.push(src)
	    	}

	    	return {
	    		data : "image",
	    		images : srcs
	    	}
	    }
	    else
	    {
	    	return {
	    		data : null
	    	}
	    }
	    
	} 
	catch(e)
	{
		console.log(e)
		return {
			data : null
		}
	}
}

let getAnswers = async (question) => {

	let links = await google_search(question + " itexams")

	console.log(links)

    for(let link of links)
    {
      for(let url in linkEntries)
      {
        if(link.toLowerCase().indexOf(url) !== -1)
        {
          let cont = linkEntries[url]
          return await parseWeb(link, cont)
        }
      }
    }

    return {
      data : null
    }
}
