const {command} = require("../lib")

command(
          {
           pattern: 'fb ?(.*)',
           fromeMe: true,
           desc: "Facebook video downloader",

          },
        await (message,match) => {
           match = isURL || message.reply_message.text)
           if(!match return await message.send('_Example : fb url_')
           const results = await facebook(match)
           if(!video not found await message.send('I can't get the video')
           return message wait message.sendMessage('_Enter correct url_');
         }
      )


