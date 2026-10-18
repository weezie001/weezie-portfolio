// Shared by the composer, API, and offline draft fallback.
export function outreachDraft({ name = 'there', business = 'your business' } = {}) {
  return {
    subject: `a thought for ${business}`,
    body: `Hey ${name},\n\nYou know when you're looking for a business, check a few options, and end up contacting the one that makes it easiest to feel confident?\n\nThey might not even do the best work. They just made choosing them easier.\n\nThat's the job I'd want your website to do for ${business}. Show people why they can trust you and make getting in touch feel like an easy next step.\n\nI'd also work on making your business easier to find when people ask ChatGPT who to hire.\n\nHow about I send you a quick before-and-after idea for ${business}? You can see what I mean without having to jump on a call.\n\nEnang`,
  }
}

export const outreachFollowup = `Hi {{name}},\n\nOne detail I'd include in that outline for {{business}}: answering the question a customer asks just before they contact you, right beside the next step.\n\nThat gives the page a useful job beyond looking newer.\n\nWould a rough before-and-after layout be useful?\n\nEnang\nhttps://weezie.site`

