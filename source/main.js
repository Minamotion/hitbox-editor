/**
 * Converts a blob to a Base64 URL
 * @param {Blob} blob Blob to convert to Base64
 * @returns {Promise<string>} A Base64 URL containing the blob
 */
function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
	//#region [Setup Defaults]
	/**
	 * @typedef {{frame:{source:string,size:{w:number,h:number}},hitbox:{x:number,y:number,w:number,h:number}}} RenderData
	 * @type {RenderData}
	 */
	let data = await fetch("./default.json").then(raw => raw.json())
	//#endregion
	//#region [Setup Canvas]
	/**
	 * @type {HTMLCanvasElement}
	 */
	const renderer = document.getElementById("renderer")
	const pen = renderer.getContext("2d")
	/**
	 * @type {CanvasImageSource}
	 */
	const frame = document.getElementById("frame")
	frame.src = data.frame.source

	function drawSprite() {
		//#region [Setup draw]
		renderer.width = data.frame.size.w
		renderer.height = data.frame.size.h
		pen.lineWidth = 1
		//#endregion
		//#region [Draw background]
		pen.fillStyle = "#0000006f"
		pen.fillRect(0, 0, frame.width, frame.height)

		pen.strokeStyle = "#ff0000a0"
		pen.strokeRect(-.5, -.5, frame.width +1, frame.height +1)
		//#endregion
		//#region [Draw frame]
		pen.drawImage(frame, 0, 0)
		//#endregion
		//#region [Draw hitbox]
		pen.fillStyle = "#ffffff2f"
		pen.fillRect(data.hitbox.x, data.hitbox.y, data.hitbox.w, data.hitbox.h)

		pen.strokeStyle = "#ffffffa0"
		pen.strokeRect(data.hitbox.x +.5, data.hitbox.y +.5, data.hitbox.w -1, data.hitbox.h -1)

		pen.fillStyle = "#ff00ffa0"
		pen.fillRect(data.hitbox.x, data.hitbox.y, 1, 1)
		//#endregion
	}
	//#endregion
	//#region [Setup Inputs]
	const inputs = {
		hitboxX: document.getElementById("hitboxX"),
		hitboxY: document.getElementById("hitboxY"),
		hitboxWidth: document.getElementById("hitboxWidth"),
		hitboxHeight: document.getElementById("hitboxHeight"),
		frameWidth: document.getElementById("frameWidth"),
		frameHeight: document.getElementById("frameHeight"),
		frameFileSource: document.getElementById("frameFileSource"),
		frameSource: document.getElementById("frameSource"),
		reset: document.getElementById("reset"),
		save: document.getElementById("save"),
		load: document.getElementById("load")
	}

	function resetInputs() {
		inputs.hitboxX.value = data.hitbox.x
		inputs.hitboxY.value = data.hitbox.y
		inputs.hitboxWidth.value = data.hitbox.w
		inputs.hitboxHeight.value = data.hitbox.h
		inputs.frameWidth.value = data.frame.size.w
		inputs.frameHeight.value = data.frame.size.h
		inputs.frameSource.value = data.frame.source
		inputs.frameFileSource.value = ""
		inputs.load.value = ""
		frame.src = data.frame.source
	}

	resetInputs()
	
	inputs.hitboxX.addEventListener("change", () => {
		data.hitbox.x = Number.parseFloat(inputs.hitboxX.value)
		drawSprite()
	})

	inputs.hitboxY.addEventListener("change", () => {
		data.hitbox.y = Number.parseFloat(inputs.hitboxY.value)
		drawSprite()
	})

	inputs.hitboxWidth.addEventListener("change", () => {
		data.hitbox.w = Number.parseFloat(inputs.hitboxWidth.value)
		drawSprite()
	})

	inputs.hitboxHeight.addEventListener("change", () => {
		data.hitbox.h = Number.parseFloat(inputs.hitboxHeight.value)
		drawSprite()
	})

	inputs.frameWidth.addEventListener("change", () => {
		data.frame.size.w = Number.parseFloat(inputs.frameWidth.value)
		drawSprite()
	})

	inputs.frameHeight.addEventListener("change", () => {
		data.frame.size.h = Number.parseFloat(inputs.frameHeight.value)
		drawSprite()
	})

	inputs.frameSource.addEventListener("change", () => {
		data.frame.source = inputs.frameSource.value
		frame.src = data.frame.source
	})

	inputs.frameFileSource.addEventListener("change", async () => {
		inputs.frameSource.value = await blobToBase64(inputs.frameFileSource.files[0])
		data.frame.source = inputs.frameSource.value
		frame.src = data.frame.source
		inputs.frameFileSource.value = ""
	})

	inputs.reset.addEventListener("click", async () => {
		data = await fetch("./default.json").then(raw => raw.json())
		resetInputs()
	})

	inputs.save.addEventListener("click", async () => {
		document.querySelector("a#saveOutput").href = `data:application/json;base64,${btoa(JSON.stringify(data))}`
		document.querySelector("a#saveOutput").click()
	})

	inputs.load.addEventListener("change", async () => {
		data = await inputs.load.files[0].text().then(text => JSON.parse(text))
		resetInputs()
	})
	//#endregion
	//#region [Start]
	frame.addEventListener("load", drawSprite)
	//#endregion
})