const config = require("../config");
const { command, isPrivate, errorMessage } = require("../lib/");
const { isAdmin, parsedJid, isUrl, isPublic } = require("../lib");
const { cron, saveSchedule } = require("../lib/scheduler");
command(
  {
    pattern: "add ?(.*)",
    fromMe: isPrivate,
    desc: "Adds a person to group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("_This command is for groups_");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("_Mention user to add");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_I'm not admin_");
    let jid = parsedJid(match);
    await message.add(jid);
    return await message.reply(`@${jid[0].split("@")[0]} added`, {
      mentions: jid,
    });
  }
)

command(
  {
    pattern: "kick",
    fromMe: true,
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("```This command is for group only```");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("β«·πππππππ ππππ ππ πππΎπβ«Έ");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("β«·ππ πππ πΌπ πΌπΏπππβ«Έ");
    let jid = parsedJid(match);
    await message.kick(jid);
    return await message.reply(`@${jid[0].split("@")[0]} π ππ ππππ ππππ ππππππ πππππ ππ πππππ`, {
      mentions: jid,
    });
  }
);

command(
  { 
    pattern: "invite", 
    fromMe: isPrivate, 


    type: "group",
  },
  async (message, client) => {
    if (!message.client.isCreator) { global.catchError = true; return await client.sendMessage( message.from, { text: errorMessage(config.reply.owner) }, { quoted: message } ); };
    if (!message.isGroup) { global.catchError = true; return await client.sendMessage( message.from, { text: errorMessage(config.reply.group) }, { quoted: message } ); };
    try {
        const code = await client.groupInviteCode(message.from);
        await client.sendMessage( message.from, { text: `π Group Link: https://chat.whatsapp.com/${code}` }, { quoted: message } );
        global.catchError = false;
    }  catch (err) {
        global.catchError = true
        await client.sendErrorMessage( message.from, err, message.key, message );
    };
    }
  );

command(
  {
    pattern: "promote",
    fromMe: isPrivate,
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("β«·ππππ πΎππππΌππΏ ππ πππ πππππ ππππβ«Έ");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("β«·πππππππ ππππ ππ πππππππβ«Έ");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("β«·ππ πππ πΌπ πΌπΏπππβ«Έ");
    let jid = parsedJid(match);
    await message.promote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} ππππππππ ππ ππ πππππ`, {
      mentions: jid,
    });
  }
);

command(
  {
    pattern: "demote",
    fromMe: isPrivate,
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup)
      return await message.reply("β«·ππππ πΎππππΌππΏ ππ πππ πππππ ππππβ«Έ");
    match = match || message.reply_message.jid;
    if (!match) return await message.reply("β«·πππππππ ππππ ππ πΏπππππβ«Έ");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("β«·ππ πππ πΌπ πΌπΏπππβ«Έ");
    let jid = parsedJid(match);
    await message.demote(jid);
    return await message.reply(`@${jid[0].split("@")[0]} πππππππ ππ ππ πππππ`, {
      mentions: jid,
    });
  }
);

command(
  {
    pattern: "mute",
    fromMe: isPublic,
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("β«·ππππ πΎππππΌππΏ ππ πππ πππππ ππππβ«Έ");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("β«·ππ πππ πΌπ πΌπΏπππβ«Έ");
    await message.reply("_Muting_");
    return await client.groupSettingUpdate(message.jid, "announcement");
  }
);

command(
  {
    pattern: "unmute",
    fromMe: isPublic,
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("β«·ππππ πΎππππΌππΏ ππ πππ πππππ ππππβ«Έ");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("β«·ππ πππ πΌπ πΌπΏπππβ«Έ");
    await message.reply("_Unmuting_");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);

command(
  {
    pattern: "gjid ?(.*)",
    fromMe: true,
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("β«·ππππ πΎππππΌππΏ ππ πππ πππππ ππππβ«Έ");
    let { participants } = await client.groupMetadata(message.jid);
    let participant = participants.map((u) => u.id);
    let str = "β­ββγ *Group Jids* γ\n";
    participant.forEach((result) => {
      str += `β *${result}*\n`;
    });
    str += `β°ββββββββββββββ`;
    message.reply(str);
  }
);

command(
  {
    pattern: "tagall ?(.*)",
    fromMe: isPublic,
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    let teks = "";
    for (let mem of participants) {
      teks += ` @${mem.id.split("@")[0]}\n`;
    }
    message.sendMessage(teks.trim(), {
      mentions: participants.map((a) => a.id),
    });
  }
);

command(
  {
    on: "text",
    fromMe: false,
  },
  async (message, match) => {
    if (!message.isGroup) return;
    if (config.ANTILINK)
      if (isUrl(match)) {
        await message.reply("β«·ππππ πΏππππΎπππΏβ«Έ");
        let botadmin = await isAdmin(message.jid, message.user, message.client);
        let senderadmin = await isAdmin(
          message.jid,
          message.participant,
          message.client
        );
        if (botadmin) {
          if (!senderadmin) {
            await message.reply(
              `_Commencing Specified Action :${config.ANTILINK_ACTION}_`
            );
            return await message[config.ANTILINK_ACTION]([message.participant]);
          }
        } else {
          return await message.reply("β«·ππ πππ πΌπ πΌπΏπππβ«Έ");
        }
      }
   }
)
