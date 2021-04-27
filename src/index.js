const m = {};

const commands = [];
const types = ["subCommand", "subCommandGroup", "string", "integer", "boolean", "user", "channel", "role"]
const embedTypes = "rich video image gifv article link";

class SlashBaseModule{

    data = {};

    setName(n){
        this.data.name = n;
    }

    setDescription(d){
        this.data.description = d;
    }
    
}

class slashMessage{
    
    constructor(interaction, client){

        this.name = interaction.data.name;
        this.id = interaction.id;

        this.interaction = interaction;
        
        this.createdAt = new Date();
        this.client = client;

        if (interaction.data.options && interaction.data.options[0])
        this.options = interaction.data.options;

    }

    reply(response) {

        const fresponse = {

            "type": 4,

            "data": {

                "embeds": []

            }

        }

        if (response && embedTypes.includes(response.type))

             fresponse.data.embeds.push(response);

        else fresponse.data.content = response;

        this.client.api.interactions(this.interaction.id, this.interaction.token).callback.post({data:fresponse}).catch(console.error)

    };



}

m.command = class slashCommand extends SlashBaseModule{

     constructor(guildId){

        super();

        this.data.options = [];

        if(guildId)
        this.guildId = guildId;
    
        commands.push(this);

    }

    addOption(opt){

        if (!opt.data) throw 'The first argument of addOption must be a slashOption.';

        this.data.options.push(opt.data);

    }

}

m.slashOption = class slashOption extends SlashBaseModule{

    isSlashOption = true;

    constructor(){

        super();

        this.data.choices = [];
        this.data.type = 1;

    }
    
    setType(type){

        let intType = 1;

        types.forEach(x => {

            if (x == type) intType = types.indexOf(x);

        })

        this.data.type = intType;

    }

    isRequired(bool){

        if (typeof(bool) != "boolean") throw "The first argument of isRequired must be a boolean.";

        this.data.required = bool;
    }

    addChoice(name, value){

        if (typeof(c) != "string") throw "The first argument of addChoice must be a string.";

        this.data.choices.push({

            "name": name,
            "value": value

        })

    }

}

m.post = (client) => {

    setTimeout(() => {

        if (!client || !client.uptime) throw 'The first argument of post must be a client.';

        commands.forEach(x => {

            if (x.guildId)

                client.api.applications(client.user.id).guild(x.guildId).commands.post({

                    data: x.data,

                }).catch(console.error).then(console.log);

            else

                client.api.applications(client.user.id).commands.post({

                    data: x.data,

                }).catch(console.error).then(console.log);

        })

    },1000)
}

m.getPostedCommands = async(client, guildId) => {

    return typeof(guildId) == "string" ? await client.api.applications(client.user.id).guild(guildId).commands.get() : await client.api.applications(client.user.id).commands.get()

}

m.removeCommand = (client, id, guildId) => {

    if (guildId)

    client.api.applications(client.user.id).guild(guildId).delete(id)

    else

    client.api.applications(client.user.id).delete(id)

}

m.onSlashCommand = (client, f) => {

    setTimeout(() => {

         if (typeof(f) != "function") throw 'The secondary argument of onSlashCommand must be a function.';
         if (!client.uptime) throw 'The first argument of onSlashCommand must be a Discord Client.';

        client.ws.on('INTERACTION_CREATE', async interaction => {

            const msg = new slashMessage(interaction, client);
            msg.channel = client.channels.cache.get(interaction.channel_id);
            msg.guild = client.guilds.cache.get(interaction.guild_id)
            msg.member = await msg.guild.members.fetch(interaction.member.user.id);

            f(msg, interaction);

        })

    },1000)

    
}

module.exports = m;
