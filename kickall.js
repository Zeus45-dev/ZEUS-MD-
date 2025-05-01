import config from '../config.cjs';

const kickAllFast = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'Purge') return;

    if (!m.isGroup) return m.reply("*LES MEMBRES NON ADMIN SERONT EXPLULSER⚠️🩸*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*⚠️ TOUT LES MEMBRES SERONT EXPLULSER ⚠️*");
    if (!senderAdmin) return m.reply("*⚠️ JE N'AI PAS BESOIN DU DROIT D'ADMINISTRATION ⚠️*");

    const toKick = participants
      .filter(p => p.id !== botNumber && !p.admin)
      .map(p => p.id);

    if (toKick.length === 0) return m.reply("No non-admins to kick.");

    // Kick everyone at once (bulk)
    await gss.groupParticipantsUpdate(m.from, toKick, 'remove');

    m.reply(`*✅ ${toKick.length} SUCCESFULL KICKALL ${groupMetadata.subject} IN 3 SECOND*`);

  } catch (err) {
    console.error('Error in Purge-fast:', err);
    m.reply('An error occurred while kicking members.');
  }
};

export default kickAllFast;
