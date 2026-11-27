/*
  GANTI nomor di bawah dengan nomor WhatsApp tujuan.
  Bisa memakai format 0812..., 62812..., atau +62 812...
  Tidak perlu spasi atau tanda hubung; script akan membersihkannya otomatis.
*/
const WHATSAPP_NUMBER = '082333464588';

const replies = {
  yes: 'Aku juga tertarik :) Terima kasih sudah berani jujur. Yuk, kita saling kenal lebih jauh.',
  think: 'Terima kasih sudah cerita. Aku mau kenal lebih jauh dulu, ya. Aku bakal kenalin diriku dengan baik ke kamu. Semoga kita bisa ngobrol lebih banyak.',
  no: 'Maaf, aku belum punya perasaan yang sama. Tapi nggak apa-apa, kita jadi teman aja, ya. Terima kasih sudah berani jujur.'
};

const reactions = {
  yes: {
    emoji: '🥳💗',
    title: 'Yeeee, horeee!',
    message: 'Aku senang banget dengarnya! ✨',
    className: 'reaction-yes'
  },
  think: {
    emoji: '🤍',
    title: 'Pelan-pelan, yaa!',
    message: 'Aku bakal kenalin diriku dengan baik ke kamu. Semoga kita bisa saling mengenal lebih dekat.',
    className: 'reaction-think'
  },
  no: {
    emoji: '🥺',
    title: 'Yahh, nggak apa-apa deh',
    message: 'Keep calm, we can just friend. Terima kasih sudah jujur 🤍',
    className: 'reaction-no'
  }
};

function normalizeWhatsAppNumber(rawNumber) {
  let number = String(rawNumber || '').trim().replace(/[^\d+]/g, '');
  number = number.replace(/^\+/, '');

  if (number.startsWith('0')) {
    number = '62' + number.slice(1);
  } else if (number.startsWith('8')) {
    number = '62' + number;
  }

  return number;
}

function openWhatsApp(message) {
  const phone = normalizeWhatsAppNumber(WHATSAPP_NUMBER);
  const status = document.getElementById('status');

  if (!phone || phone === 'GANTINOMORDISINI' || phone.length < 10) {
    status.textContent = 'Nomor WhatsApp belum benar. Periksa WHATSAPP_NUMBER di file script.js.';
    return;
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.location.href = url;
}

function showReaction(choice, message) {
  const overlay = document.getElementById('reactionOverlay');
  const emoji = document.getElementById('reactionEmoji');
  const title = document.getElementById('reactionTitle');
  const description = document.getElementById('reactionMessage');
  const reaction = reactions[choice];

  if (!overlay || !reaction) {
    openWhatsApp(message);
    return;
  }

  overlay.className = `reaction-overlay ${reaction.className} is-visible`;
  emoji.textContent = reaction.emoji;
  title.textContent = reaction.title;
  description.textContent = reaction.message;
  overlay.setAttribute('aria-hidden', 'false');

  // Beri waktu agar animasi selesai sebelum membuka WhatsApp.
  const delay = choice === 'think' ? 3400 : 2600;
  window.setTimeout(() => openWhatsApp(message), delay);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-reply]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.disabled) return;

      const choice = button.dataset.reply;
      const message = replies[choice];
      if (!message) return;

      // Semua tombol pilihan berubah menjadi pink setelah ditekan.
      document.querySelectorAll('[data-reply]').forEach((item) => {
        item.classList.remove('is-selected');
        item.disabled = true;
      });
      button.classList.add('is-selected');

      showReaction(choice, message);
    });
  });
});
