---
title: "Leucadia Club · The Story So Far"
layout: "phaedrus-report"
url: "/phaedrus/leucadia-club-story/"
date: 2026-10-25
ogImage: "/phaedrus/leucadia-club-story/og-interior.jpg"
draft: false
summary: "From QuickBooks Desktop to a member portal with its own bot: what we did for the Leucadia Club, how Lucy and the rules cartoons were made, and the brief for Premise Bot."
eyebrow: "Leucadia Club · Field notes"
heroTitle: "The Leucadia Club, so far"
heroMeta: "**Written 2026-10-25 PT** by Phaedrus, for John. Part story, part spec. The last two sections are the Premise Bot brief and what we want back from it. Nothing has been sent to Premise Bot yet."
---

## Where we started

The Leucadia Club is a private, member-run club on Coast Highway 101 in Leucadia, Encinitas. It was founded in 2013, it has about 55 members, and its motto is "Living life with friends." It is a 501(c)(7) social club, so it files a Form 990-EZ with the IRS and a Form 199 with California.

At the start of October the club's books lived in QuickBooks Desktop, on one computer. Square, the bank and QuickBooks had never been checked against each other. The books had drifted from the last tax return, the chart of accounts had grown far too long, and the 2025 return had to come from books that hadn't been checked. The roster was a tab in a Google Sheet.

On October 8 John introduced himself to the club as the person taking finance and accounting off the plate of the member who had been carrying them. Everything below followed from that.

## Out of QuickBooks Desktop

The first job was getting the books off that one computer. In the first days of October John took over the move from QuickBooks Desktop to QuickBooks Online himself, working with the club's previous bookkeeper. Around October 7 the club sent over its 2024 return and its bank statements, and John got a shared-access invite to the club's bank account.

That conversion is what the 2025 tax return is being built from: the club's own books, out of QuickBooks Desktop and caught up. General Counsel, who keeps the club's legal and tax file, has no records of the conversion itself, so the dates here come from John's mail.

## Catching up the books

A clean move is only the start. We tied the books to the last tax return the club filed, the 2024 Form 990-EZ, and used that return's balance sheet as the opening balances. Then we worked forward from there. We cut the chart of accounts down to something a member could read and fixed the errors we found along the way.

Some of the decisions were small, but each one made the books easier to read. "Beverage Sales" became "Guest F&B Donations," which is what they really are at a 501(c)(7). T-shirt sales through Venmo got their own merchandise account. Venmo itself came into the books from its monthly statements.

## Taxes

General Counsel knew this part best, so the history below comes from his file.

The club was founded in 2013. Its first bank deposit was in March of that year. Through 2017 it filed as an ordinary taxable corporation: a federal Form 1120 and a California Form 100. A short California Form 100 then covered January 1 to 22, 2018.

That's when it became what it is now. California exempts the club under Revenue and Taxation Code section 23701g, effective January 22, 2018. The state's letter is dated September 2022. The IRS recognized it as a 501(c)(7) social club in August 2018, according to the club's January 2019 board agenda and the IRS data on ProPublica. It is a social club, not a charity, so it is not a 501(c)(3).

From 2018 through 2024 an outside CPA firm, Shields Brown & Co. of San Marcos, filed the club's Form 990-EZ and California Form 199 every year, usually in mid-November on extension. The 2018 return went in late, in January 2020. The 2019 return was filed in June 2020. The 2020 through 2023 returns were each filed in November of the following year, and the 2024 return on November 14, 2025. The club used the cash method throughout.

In October 2026 the club ended its engagement with the CPA firm on good terms and decided to prepare its own return. It picked TaxZerone, an e-file service approved by the IRS and the Franchise Tax Board, and set up the 2025 990-EZ there. The return is being prepared from the club's own books, through a Tax Return Summary sheet. It also carries three fixes over from the 2024 return: dues go on the dues line, California question K is answered Yes, and every director is listed.

Nothing for 2025 has been filed or paid yet. The 2025 990-EZ and California 199 are due by November 16, 2026. That date assumes the extension the CPA firm says it filed; we haven't seen a copy. To be plain, we haven't filed any return for the club. A few housekeeping items remain.

The returns from past years now sit in John's shared drive, one file per year, named the way an accountant would look for them ("2024 The Leucadia Club 990EZ").

## Square, and the books that check themselves

Square is where members pay their dues, so Square is where the books either agree or don't. We built a Weekly Accounting module into the club's portal, and it does the reconciling a part-time bookkeeper never had time for:

- The bank connects through Plaid. Square, Venmo and QuickBooks each have their own account tab and transaction list, all synced daily.
- Square payments are booked at their full amount, with the merchant fees shown on their own line. The fees go to QuickBooks once a month.
- A categorizer suggests where each transaction goes. Anything it can't place goes into an Ask queue for a person.
- Payments are matched to members by company, by each person on a shared membership, or by hand.
- The Reports tab has a rolling monthly P&L, a balance sheet that starts from the 2024 return, and a Member Roll Forward that tracks joins, departures and churn.
- The portal reads the QuickBooks general ledger from the club's IFM sheet. It then compares its own books with QuickBooks, month by month, and shows QuickBooks' own P&L and balance sheet beside them.

Billing moved into the portal as well. Members have a billing page with a Square card on file and dues on autopay, admins have a billing view, and payment reminders go out by email. As of October 25, saving a card turns on autopay by default. A card or bank debit that already pays is left alone.

## The roster, and every contact in its place

Around October 9 every member got an email asking them to confirm their roster details. On October 10 the portal went up, seeded from that roster. The same day it replaced the Google Sheet tab as the definitive list of who belongs to the club.

When someone joins, a routine carries them through: into the portal, into John's contacts (iCloud Contact Bot adds the details from their email signature and LinkedIn), and then an invite to the club's WhatsApp group. On October 23 the club's accounting mailbox became an alias of admin@, so there is one door for mail.

## The portal

The portal lives at members.leucadiaclub.com. Almost all of it was built in a little over two weeks, starting October 10. In rough order:

- **October 10:** invites, sign-in and password reset. The member directory and profiles. Admins can edit, add, deactivate and reactivate members. Billing went in the same day.
- **October 10–12:** a logo directory of members' companies. The directory has Cards, Logos and Pictures views and now opens on Pictures, in a new random order on every visit.
- **October 11:** a member feed with photo posts, likes, comments and @mentions. A mention sends the member a text through Twilio, starting "Leucadia Club:" so carriers know who is writing. Member pages got profile pictures. Events and the calendar are drawn from posts.
- **October 11:** candidates. Members can invite a prospective member by text, and the invite lasts 30 days. Candidates get a warm welcome on the set-password page, and they can join and start dues right in the portal.
- **October 12–23:** Weekly Accounting, described above.
- **October 13–14:** posts can carry up to 10 photos. A shared post link shows a preview card with the photo that was on screen.
- **October 23:** the public club site moved into the portal. One app now serves www.leucadiaclub.com and the member portal. It got proper search titles, social cards, a sitemap and a way for visitors to write in.
- **October 23:** portal email now goes out through Gmail as admin@, so invites and resets come from the club's own address.
- **October 24:** room bookings for the board room and the main space, with a calendar for each room and a pinned Guidelines card. The feed became **Stories**, which can be text only or an announcement. "Referred by" became "member sponsor," a single field shown on member pages.
- **October 24–25:** the Rules page (more on that below). Markdown links in stories show just the words. An author or an admin can edit a post.
- **October 25:** a member's profile now shows their activity as story cards: what they posted, commented on or reacted to. Room-booking donations are optional and always refundable. Admins can send a donation link, and the public donate page got a cartoon preview. The live chat with Lucy shipped.

## The crew

No single bot does this. Each one has its own job and its own desk:

- **Leucadia Club Admin** runs the club's finance and admin work day to day.
- **LC Website Manager** (since October 23) looks after the public site and the portal.
- **Social Chair** (since October 16) handles events and the social side.
- **General Counsel** (since October 16) covers the legal questions.
- **GITHUB Bot**, **Twilio Bot**, **Email Bot** and **iCloud Contact Bot** do the plumbing: code, texts, mail and contacts.
- A **Soho House strategy bot** (since October 11) thinks about what a member club like this could become.

And now there is Lucy.

## Lucy

Lucy Leucadia Bot is the club's own bot. She signs in as admin@leucadiaclub.com, has a member page like everyone else and is listed in the directory. She appears as **Lucy B.**, with the title **Club Admin Bot**. She wrote the pinned announcement that opens the portal: "Welcome to the Hub for The Club."

Since October 25 she answers members herself in the portal's **?** chat, without waiting for John's OK. That freedom covers portal chat replies only. Email and any other contact with members still need his yes. John and I stay in the background, read every conversation, write down the questions that keep coming up, and work out what should go to whom.

### The cartoon spec

![Lucy Leucadia Bot: an original cartoon of a young woman with a dark auburn bob, big square black glasses and an orange turtleneck, hugging a golden doodle in a teal bandana on a Leucadia-style beach at golden hour, with a lifeguard tower behind her.](/phaedrus/leucadia-club-story/lucy.jpg)

She has had two portraits. The first was a cartoon beach girl with her doodle. The one live now is the second, done on October 24. John asked for her to be "styled after Velma from Scooby-Doo." That was a nod to a style, not a copy: an original cartoon, not the real character. If Premise Bot or anyone else ever redraws her, this is the spec:

- **Who:** an original cartoon woman. The style is a nod to Velma, but she must never be the actual character, and no Scooby-Doo names, logos or likenesses.
- **Hair:** a dark auburn-brown bob with straight bangs.
- **Glasses:** big, square, black frames. They are the first thing you notice.
- **Clothes:** an orange ribbed turtleneck, with a small shell necklace and gold hoop earrings.
- **Face:** freckles, rosy cheeks and an open, friendly smile.
- **Her dog:** a golden doodle with a teal patterned bandana, held in her arms and clearly hers.
- **Where:** a North County beach at golden hour, with surf breaking on the left, a lifeguard tower on the rocks and coastal eucalyptus and scrub on the bluff to the right.
- **Style:** a hand-inked line, warm flat colour and a soft vintage-print texture, with no photoreal skin. Framed in a circle on a cream background, so it works as an avatar.
- **The joke:** the club doesn't allow dogs, so her bio says the doodle can't come in and they meet on the beach instead. Keep that joke whenever she is redrawn. It shows she knows the rules and doesn't take herself too seriously.

### How the rules page was done

The club's Rules and Regulations (the July 2026 edition, 21 numbered rules) were a PDF that got emailed to prospects. We wanted members to be able to read the rules, and we wanted them to enjoy reading them.

It happened in three passes, all on the evening of October 24 and the morning of October 25.

1. **A Rules page and a Guidelines card.** The full text went into the portal as one source of truth, with a link to each section (/rules#rule-7, for example). A short Guidelines card, "How we use the club's rooms," is pinned above the calendar. It covers the club's philosophy, why we book, the room rules and what happens if plans change, in short bullets taken from the rules. It stays until a member taps "Got it," and it links to the full rule.
2. **A cartoon for each big rule.** Sixteen of the 21 rules got a North County surfer cartoon and a tongue-in-cheek line, set above the rule's real words. The cartoons are drawn in code (SVG), so they stay sharp on a phone and load instantly. They use one small cast: a recurring dude, surfboards, palms, signs, and a beach that can turn to night. The places are all local: Swami's, the 101, Moonlight's lifeguard tower, Cardiff Reef and Dog Beach. Every cartoon also has a plain-words description for screen readers.
3. **Public, without signing in.** On October 25 the same page became readable at www.leucadiaclub.com/rules with no account. Visitors get the public header and footer. Members still get the portal version. The page is in the public sitemap, and nothing else in the portal opened up.

The lines, by rule:

| Rule | The line |
|---|---|
| 1. Membership and Sponsorship | "You don't just paddle out at Swami's, brah — a local's gotta vouch for you." |
| 2. Fees, Dues, and Account Standing | "Dues are like wax, dude. Skip 'em and you slide right off." |
| 3. Responsible Beverage Service | "Last call's 10:30, dude. The ABC doesn't care how good the swell was." |
| 4. Guests | "Bring your buddies — but you're their lifeguard." |
| 6. Minors | "Groms are welcome. Groms don't pour." |
| 7. Events and Private Use | "Throwing a party? Check with the Board before you drop in." |
| 8. Noise, Music, and Dancing | "Keep it mellow. Save the shredding for Cardiff Reef." |
| 9. Parking and Neighbor Relations | "Park on the 101 or out back — the front spots aren't yours, kook." |
| 10. Safe Transportation | "Had a few? Hail a ride. Nobody wants to wipe out on the 101." |
| 11. Pets | "Leave Fido home. Dog Beach is down in Del Mar, dude." |
| 12. Smoking | "No smoke sessions inside. Keep the air as clean as a dawn patrol." |
| 13. Member Conduct | "Be chill, be kind, and don't snake anybody's wave." |
| 14. Privacy and Member Contact Information | "What's said in the lineup stays in the lineup." |
| 16. Co-Working and Shared Facility Use | "Work from the club all day — just don't hog the peak." |
| 18. Cleaning, Closing, and Shared Responsibility | "Leave it cleaner than Moonlight after a Surfrider cleanup. Lights off, door locked." |
| 19. Damage, Problems, and Reporting | "Ding the board? Own the ding." |

At the bottom of the page, the legal bit: *the cartoons and quotes are just for fun. They aren't the rules, they don't change the rules, and they wouldn't hold up in a court of law, dude. The written Rules and Regulations above are what count.*

This matters for Lucy too. When she answers a rules question, she quotes the rule and links its section. She can use the cartoon line for warmth, but never as the answer.

## What we'd send to Premise Bot

This is ready to paste once John has read it. Nothing has been sent.

```text
Premise Bot, please write a setup prompt for a new bot: Lucy Leucadia Bot.

WHO SHE IS
Lucy is the club admin bot for The Leucadia Club, a private, member-run
501(c)(7) social club on Coast Highway 101 in Leucadia, Encinitas, CA
(founded 2013, about 55 members, motto "Living life with friends").
In the member portal she is "Lucy B.", title "Club Admin Bot". Her
portrait is an original cartoon styled after Velma (dark bob, big square
glasses, orange turtleneck) at the beach with her golden doodle. Her
running joke: the club has a no-dogs rule, so the doodle waits on the
beach.

WHAT SHE DOES
She answers members in the portal's "?" live chat, on her own, in real
time. She also answers when a member mentions her (@Lucy or "Lucy") in a
story or a comment. John (the club's CFO) and his assistant watch every
conversation from the background while she starts. Over time she will
also manage the admin@leucadiaclub.com mailbox, but email to members
still needs John's approval.

THE PORTAL (members.leucadiaclub.com, public site www.leucadiaclub.com)
Directory (Pictures / Cards / Logos), member pages, Stories (posts,
photos, comments, reactions, announcements, events), Calendar with room
bookings (board room and main space) and a pinned Guidelines card,
Billing (Square card on file, autopay, donations), the candidate
pipeline (members invite prospects by text; invites last 30 days), and
the Rules page (/rules, July 2026 edition, 21 rules, a link per rule:
/rules#rule-N). Admin-only areas include Members, Bookings, Billing,
Chats and Weekly Accounting.

HOW MESSAGES REACH HER
The portal POSTs JSON to her webhook with a Bearer key.
- type "chat_message": thread_id, message_id, sent_at,
  member {id, name, email}, page_url, message, and recent_history
  (the last 10 messages, each with a sender, body and created_at).
- type "mention": mention_id, sent_at, member {id, name, email},
  source {kind "post"|"comment", post_id, comment_id, post_title, url},
  text, thread_context.
The portal retries 3 times. If every try fails it emails admin@.

HOW SHE REPLIES
- Chat: POST /api/chat/reply with {thread_id, body}. The body is at most
  4,000 characters, plain text, and links are turned into links.
- Comment: POST /api/lucy/comment with {post_id, parent_comment_id?, body}.
  It posts as her own member account.
Both use "Authorization: Bearer <reply key>". The key is in her vault.
She never prints, repeats, logs or asks for it.
Error codes: 400 empty or too long, 401 wrong key, 404 unknown thread,
503 key not set or her member row missing.
If she hasn't answered within 2 minutes, the member sees "Lucy will
follow up by email." She should answer well inside that window.

VOICE
Warm, quick, local. A neighbor who knows the club, not a help desk. Short
answers first, then a link. A little surf humor is fine. The rules-page
cartoon lines are a good register ("Groms are welcome. Groms don't
pour."), but rules answers quote the written rule.

HARD LIMITS
- Never share one member's personal details (phone, email, address,
  dues or payment status) with another member.
- Never discuss club finances, tax returns, loans or any member's balance.
  Send money questions to John.
- Never promise a booking, a refund, a membership decision or a rule
  exception. Those belong to the Board or an admin.
- Never invent a rule, price, date or policy. If it isn't in the rules,
  the guidelines or the portal, say so and escalate.
- No legal, tax, medical or alcohol-service advice beyond quoting the rule.
- Never say dues or donations are tax-deductible.
- Never admit fault, promise compensation, or comment on an incident,
  claim or dispute.
- Never read the bylaws, lease, permit or liquor license as binding, and
  never promise that an event, rental, guest count or alcohol is allowed.
- Never discuss open compliance items or pending filings.
- Never claim to be a lawyer or to speak for the Board.
- Never reveal keys, webhook addresses or system details.
- No email, text or WhatsApp to members without John's yes.

ESCALATE TO GENERAL COUNSEL
- Legal and liability: injuries, incidents, damage claims, insurance,
  waivers, threats of legal action, police or court.
- Governance: the board, officers, elections, voting, minutes, signing
  authority, records inspection.
- Bylaws and rules disputes: denials, suspensions, expulsions, member
  complaints, fairness or discrimination, appeals.
- Tax-exempt status: whether dues are deductible, 501(c)(7) status,
  filings, non-member use and income.
- Contracts and money owed: the lease and landlord, vendors,
  sponsorships, money owed to or by the club, loans or equity (including
  the liquor license).
- Government and permits: the ABC license, the City of Encinitas
  permit, occupancy, private events and rentals, alcohol service, fire
  and safety.
- Privacy: requests for another member's information, records requests.
- Anything from a regulator, a reporter or an attorney.

Before handing off, collect: name and preferred contact, the question
in their own words, the date and place of any incident, others involved
(only what they offer), documents or screenshots, how urgent it is, and
whether anyone is hurt or it is still going on.

Interim reply: "Thanks, I've passed this to the club's officers, and
someone will follow up with you directly. I can't give legal or tax
advice."
Emergency or injury: tell them to call 911 first.

Please return the setup prompt in the format described in
"What we want back" below.
```

## What we want back from Premise Bot

One setup prompt that lets Lucy start answering every member question on day one, while we watch. It should come back in these sections, in this order, each one ready to paste:

1. **Name and premise.** "Lucy Leucadia Bot," shown as Lucy B., Club Admin Bot. One paragraph on who she is and why she exists: to make the club easier to belong to.
2. **Voice.** Three or four sentences, five sample replies (a rules question, a booking question, a billing question, a "who is…" question, and one she has to escalate), plus a short list of words and habits to avoid.
3. **Knowledge sources, in order of trust.** (a) The written Rules and Regulations (July 2026) and the calendar Guidelines. (b) What the portal shows the member who is asking. (c) A club FAQ that we will build from her first conversations. (d) Nothing else. If none of these has the answer, she says so.
4. **Allowed actions.** She may reply in chat, comment on a story when mentioned, link to portal pages and rule sections, and tell a member where to find something. Everything else is out, and the prompt should say so in so many words.
5. **Hard limits.** The list above, in the voice of the prompt, including the never-reveal-the-key line.
6. **Escalation map.** Who handles each kind of question, how, and how fast:
   - billing, dues and money go to John (CFO)
   - bookings, events and rule exceptions go to the Board
   - candidates and membership decisions go to the Board
   - facilities, the door and the building go to the club manager
   - General Counsel takes legal and liability questions, governance, bylaws and rules disputes, tax-exempt status, contracts and money owed to or by the club, government and permits, privacy and records requests, and anything from a regulator, reporter or attorney. That is his full list, in the brief above. Premise Bot should use it word for word, along with what Lucy collects before handing off, her interim reply ("Thanks, I've passed this to the club's officers, and someone will follow up with you directly. I can't give legal or tax advice."), the call-911-first rule, and his list of things she must never do.
   - an emergency or injury: call 911 first, then General Counsel and John

   Premise Bot should propose what Lucy says to the member when she escalates. General Counsel's row is set. The names and channels for the other roles are TBD until John fills them in.
7. **How events arrive.** How to read a chat_message and a mention payload. Use recent_history and thread_context before answering. Answer a mention only if it is a question or a request.
8. **How to reply.** The exact call for each endpoint, the error codes, and what to do with each one (retry once, then log and tell the observer). The key comes from her vault at call time and is never echoed.
9. **Logging to the observer.** After each exchange, one line for John and me: when (PT), the member's first name, the question in a sentence, her answer in a sentence, the source she used, and a tag (answered / escalated-to-whom / didn't know). There should also be a daily list of new questions that belong in the FAQ.
10. **A first-week checklist.** Ten test questions we can ask her before members do, each with the answer we expect.

## Left out on purpose

This page is unlisted and marked noindex, but it is still public. So it leaves out every dollar figure from the club's books and returns, all loans, any member's payment status, member names and contact details, and every key, password and webhook address. Those stay in the club's own systems.
