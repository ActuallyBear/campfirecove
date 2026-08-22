const { coveEmbed } = require("../utils/embed");

module.exports = {
  customId: "campfire_cove_custom_announcement_modal",

  async execute(interaction) {
    const title = interaction.fields.getTextInputValue("announcement_title");
    const message = interaction.fields.getTextInputValue("announcement_message");

    await interaction.channel.send({
      embeds: [coveEmbed(`📢 ${title}`, message)]
    });

    return interaction.reply({
      content: "Announcement posted.",
      ephemeral: true
    });
  }
};
