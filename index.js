require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.find(
    ch => ch.name === "welcome"
  );

  if (!channel) return;

  channel.send(`Welcome to the server, ${member}! Please read the rules.`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "!ping") {
    message.reply("Pong!");
  }

  if (command === "!rules") {
    message.reply("Please respect everyone, avoid spam, and follow staff instructions.");
  }

  if (command === "!clear") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("You do not have permission to use this command.");
    }

    const amount = parseInt(args[0]);

    if (!amount || amount < 1 || amount > 100) {
      return message.reply("Use: `!clear 1-100`");
    }

    await message.channel.bulkDelete(amount, true);

    const reply = await message.channel.send(`Deleted ${amount} messages.`);
    setTimeout(() => reply.delete().catch(() => {}), 3000);
  }

  if (command === "!kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("You do not have permission to use this command.");
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply("Use: `!kick @user`");
    }

    await member.kick();
    message.reply(`${member.user.tag} was kicked.`);
  }

  if (command === "!ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("You do not have permission to use this command.");
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply("Use: `!ban @user`");
    }

    await member.ban();
    message.reply(`${member.user.tag} was banned.`);
  }
});

client.login(process.env.DISCORD_TOKEN);