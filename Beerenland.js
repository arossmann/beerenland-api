// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.

const location = "Wolkersdorf"
const url = `https://arossmann.github.io/beerenland-api/result.json`
const req = new Request(url)
const res = await req.loadJSON() 
// console.log(res)
const loc = res.pick_conditions[0]
// console.log(loc)


if (config.runsInWidget) {
  // create and show widget
  let widget = createWidget(`berry picking state in ${location}`, "#0066CC")
  Script.setWidget(widget)
  Script.complete()
} else {
  let table = new UITable()
  let row = new UITableRow()
  row.isHeader = true
  row.addText(`berry picking state in ${location}`)
  table.addRow(row)
  for (let [key,value] of Object.entries(loc[location])){
	console.log(value.berry+" "+value.status)
    table.addRow(createRow(value.berry, value.status))
  }
 table.present()
}
function createRow(title, image) {
  let row = new UITableRow()
  row.addText(title)
  row.addImageAtURL(image)
  return row
}

function createWidget(title, color) {
  let w = new ListWidget()
  w.backgroundColor = new Color(color)
  let titleTxt = w.addText(title)
  titleTxt.textColor = Color.white()
  titleTxt.font = Font.systemFont(12)
  return w
}