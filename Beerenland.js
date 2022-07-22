// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: shopping-basket;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.

//const location = "Wolkersdorf"
let location = "Wolkersdorf";
const color = "0066CC"
const title = "Berries in "+location
const url = `https://arossmann.github.io/beerenland-api/result.json`
const req = new Request(url)
const res = await req.loadJSON() 
const loc = res.pick_conditions[0]

const widget = new ListWidget()
await createWidget()

try {
  location=readParams();
  location.toString();
} catch(err){
    location = "Wolkersdorf";
}

// used for debugging if script runs inside the app
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

function statusImage(status) {
    let symbols;
    symbols = {
        "good" : function(){ return "🟢"; },
        "bad" : function() { return "🟠"; },
        "sale" : function() { return "⚫️"; },
        "closed" : function() { return "🔴"; }
    }
    return symbols[status]();
}


// build the content of the widget
async function createWidget() {
  widget.backgroundColor = new Color(color)
  widget.setPadding(10,10,10,10)
  let titleTxt = widget.addText(title)
  titleTxt.textColor = Color.white()
  titleTxt.font = Font.boldMonospacedSystemFont(12)
  for (let [key,value] of Object.entries(loc[location])){
    const row = widget.addStack()
    let berry = row.addText(value.berry)
    berry.textColor = Color.white()
    berry.font = Font.boldMonospacedSystemFont(10)
    row.addSpacer()
    let image = row.addText(statusImage(value.status))
    image.font = Font.boldMonospacedSystemFont(10)
  }
}