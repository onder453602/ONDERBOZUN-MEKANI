const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("../config.json")
const db = require("quick.db")
const fs = require("fs");


const prefix = config.prefix
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./events/", (err, files) => {
  if (err) console.log(err);

  let jsfile1 = files.filter(f => f.split(".").pop() === "js");
  if (jsfile1.length <= 0) {
    console.log("Could not find any events");
    return;
  }
  jsfile1.forEach(f => {
    const eventName = f.split(".")[0];
    console.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${f}`);

    client.on(eventName, event.bind(null, client));
  });
});


fs.readdir("./cmds/", async (err, files) => {

    if(err) console.log(err)
    if(!files) return console.log("Unable to find commands.")
    let jsfile = files.filter(f => f.split(".").pop() == "js")
    if (jsfile <= 0){
        console.log("Unable to find commands.")
        return;
    }

    for (const f of jsfile){
        let props = require(`./cmds/${f}`)
        console.log(`${f} loaded.`)
        client.commands.set(props.help.name,props)
        for (const aliase of props.conf.aliase){
            client.aliases.set(aliase,props)
        }
    };
    console.log("All Commands have been loaded successfully.")
})


client.on("ready", () => {
console.log(`Ready ;)`)
})

client.on("message", async message => {
    if(message.author.bot) return;
    let prefix;
    if(!message.guild) prefix = "!"
    if(message.guild) prefix = config.prefix
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild) return message.channel.send("You can't use commands via DMs in this bot. You can only use guild").catch(e => client.channels.cache.get("724983000286101636").send(e))
    let messageArray = message.content.split(' ').join(' ').split(" ");
    let cmd = messageArray[0]
    let args = messageArray.slice(1);

    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if(!commandfile) commandfile = client.aliases.get(cmd.slice(prefix.length))
    if(commandfile) commandfile.run(client,message,args);
    
})


client.on(`NzQ2MTk2MjA5MzU3Njg0ODE4.Xz8zXw.V1E_QBpPWOKtz2GGWRIaKCCDdx8`)