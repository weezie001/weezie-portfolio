// Shared by the composer, API, and offline draft fallback.
export function outreachDraft({ name = 'there', business = 'your business' } = {}) {
  return {
    subject: `a thought for ${business}`,
    body: `Hey ${name},\n\nYou know when you're looking for a business, check a few options, and end up contacting the one that makes it easiest to feel confident?\n\nThey might not even do the best work. They just made choosing them easier.\n\nThat's the job I'd want your website to do for ${business}. Show people why they can trust you and make getting in touch feel like an easy next step.\n\nI'd also work on making your business easier to find when people ask ChatGPT who to hire.\n\nHow about I send you a quick before-and-after idea for ${business}? You can see what I mean without having to jump on a call.\n\nEnang`,
  }
}

export const outreachFollowup = `Hey {{name}},\n\nRunning a business already takes enough out of you. Your website should be helping bring the next customer in, without you having to explain everything yourself.\n\nThat's what I'd like to help with at {{business}}. A clearer reason to choose you, an easier way to reach you, and a better chance of showing up when people ask ChatGPT for a business like yours.\n\nWant me to send over the first thing I'd change?\n\nEnang\nweezie.site\n\nP.S. If this isn't for you, just reply "unsubscribe" and I won't follow up again.`

