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
const title = "Beeren in "+location
const url = `https://arossmann.github.io/beerenland-api/result.json`
const req = new Request(url)
const res = await req.loadJSON() 
const loc = res.pick_conditions[0]

const widget = new ListWidget()

// Add background gradient
let gradient = new LinearGradient()
gradient.locations = [0, 1]
gradient.colors = [
  new Color("141414"),
  new Color("13233F")
]
widget.backgroundGradient = gradient

await createWidget()

const locationParam = args.widgetParameter

//Adds "&" to combined station and replace umlauts
location = locationParam.replace(" ","&").replace("ß","ss").replace("ü","ue").replace("ä","ae").replace("ö","oe")


// used for debugging if script runs inside the app
if (!config.runsInWidget) {
    await widget.presentMedium()
}
Script.setWidget(widget)
Script.complete()

function statusSymbol(row,status){
    let symbol = null;
    switch(status) {
        case "good" : 
            symbol = row.addImage(SFSymbol.named("hand.thumbsup.circle").image); 
            symbol.tintColor = Color.green();
            break;
        case "bad" : 
            symbol = row.addImage(SFSymbol.named("hand.thumbsdown.circle").image); 
            symbol.tintColor = Color.orange();
            break;
        case "sale" : 
            symbol = row.addImage(SFSymbol.named("cart.circle").image); 
            symbol.tintColor = Color.white();
            break;
        case "closed" : 
            symbol = row.addImage(SFSymbol.named("x.circle").image); 
            symbol.tintColor = Color.red();
            break;
        default:
            symbol = row.addImage(SFSymbol.named("exclamationmark.circle").image); 
            symbol.tintColor = Color.grey();
            break;
    }
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
    statusSymbol(row,value.status)
  }
}