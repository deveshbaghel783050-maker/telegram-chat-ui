import { Message } from "@/context/ProfileContext";

export type RandomUser = {
  name: string;
  username: string;
  phone: string;
  avatarColor: string;
};

export const RANDOM_USERS: RandomUser[] = [
  { name: "Arjun Singh",    username: "@arjun_s",      phone: "+91 98765 43210", avatarColor: "#e17055" },
  { name: "Priya Sharma",   username: "@priya_sh",     phone: "+91 87654 32109", avatarColor: "#6c5ce7" },
  { name: "Rahul Kumar",    username: "@rahul_k",      phone: "+91 76543 21098", avatarColor: "#00b894" },
  { name: "Neha Gupta",     username: "@neha_g",       phone: "+91 65432 10987", avatarColor: "#fd79a8" },
  { name: "Amit Verma",     username: "@amit_v",       phone: "+91 54321 09876", avatarColor: "#0984e3" },
  { name: "Pooja Patel",    username: "@pooja_p",      phone: "+91 43210 98765", avatarColor: "#00cec9" },
  { name: "Vikram Rao",     username: "@vikram_r",     phone: "+91 32109 87654", avatarColor: "#fdcb6e" },
  { name: "Kavita Nair",    username: "@kavita_n",     phone: "+91 21098 76543", avatarColor: "#a29bfe" },
  { name: "Ravi Mehta",     username: "@ravi_m",       phone: "+91 10987 65432", avatarColor: "#55efc4" },
  { name: "Sunita Das",     username: "@sunita_d",     phone: "+91 99887 76655", avatarColor: "#e84393" },
  { name: "Deepak Joshi",   username: "@deepak_j",     phone: "+91 88776 65544", avatarColor: "#2d3436" },
  { name: "Anjali Kapoor",  username: "@anjali_k",     phone: "+91 77665 54433", avatarColor: "#d63031" },
  { name: "Suresh Reddy",   username: "@suresh_r",     phone: "+91 66554 43322", avatarColor: "#6ab04c" },
  { name: "Meena Iyer",     username: "@meena_i",      phone: "+91 55443 32211", avatarColor: "#f9ca24" },
  { name: "Arun Pillai",    username: "@arun_p",       phone: "+91 44332 21100", avatarColor: "#e55039" },
  { name: "Divya Bose",     username: "@divya_b",      phone: "+91 33221 10099", avatarColor: "#8e44ad" },
  { name: "Manish Tiwari",  username: "@manish_t",     phone: "+91 22110 09988", avatarColor: "#2980b9" },
  { name: "Sonal Shah",     username: "@sonal_s",      phone: "+91 11009 98877", avatarColor: "#16a085" },
  { name: "Kiran Malhotra", username: "@kiran_m",      phone: "+91 90909 80808", avatarColor: "#f39c12" },
  { name: "Rohit Chaudhary",username: "@rohit_c",      phone: "+91 80808 70707", avatarColor: "#c0392b" },
];

type ConvTemplate = { sent: boolean; text: string }[];

const CONVERSATIONS: ConvTemplate[] = [
  [
    { sent: true,  text: "Hey! Kya chal rha hai?" },
    { sent: false, text: "Arre bhai sab theek hai! Tu bata 😄" },
    { sent: true,  text: "Kuch nahi bas bore ho rha hun" },
    { sent: false, text: "Haha same yaar 😂" },
    { sent: true,  text: "Aaj kuch plan hai?" },
    { sent: false, text: "Nahi yaar ghar pe hi hun" },
    { sent: true,  text: "Chalte hai kuch khane? Pizza?" },
    { sent: false, text: "Ha bhai bilkul! Kab nikal?" },
    { sent: true,  text: "8 baje thik rahega?" },
    { sent: false, text: "Done! ✅ Main ready rahunga" },
  ],
  [
    { sent: true,  text: "Bhai assignment hua tera?" },
    { sent: false, text: "Nahi yaar raat ko karunga 😅" },
    { sent: true,  text: "Submission kal subah hai" },
    { sent: false, text: "Pata hai pata hai 😭" },
    { sent: true,  text: "Chal milke karte hai" },
    { sent: false, text: "Ha library mein aajao" },
    { sent: true,  text: "10 minute mein aata hun" },
    { sent: false, text: "Theek hai, main laptop le aya" },
    { sent: true,  text: "Mera charger leke aana" },
    { sent: false, text: "Ok ok 👍" },
  ],
  [
    { sent: true,  text: "Good morning! ☀️" },
    { sent: false, text: "Good morning! Kya plan hai aaj?" },
    { sent: true,  text: "Gym jaana hai pehle" },
    { sent: false, text: "Nice! Main bhi aaun?" },
    { sent: true,  text: "Bilkul aa! 6 baje chalte?" },
    { sent: false, text: "Thoda jaldi hai na 😴" },
    { sent: true,  text: "Haha theek hai 7 baje" },
    { sent: false, text: "Perfect! Main ready rahunga" },
    { sent: true,  text: "Water bottle le aana" },
    { sent: false, text: "Haan lata hun, see you! 💪" },
  ],
  [
    { sent: true,  text: "Yaar movie dekhni hai?" },
    { sent: false, text: "Kaunsi?" },
    { sent: true,  text: "Pathaan - sun ke bahut acchi lag rhi" },
    { sent: false, text: "Ha bhai! Kab chalein?" },
    { sent: true,  text: "Aaj shaam 7 baje show hai" },
    { sent: false, text: "Ticket book ki?" },
    { sent: true,  text: "Abhi karta hun dono ki" },
    { sent: false, text: "Popcorn main le lunga 🍿" },
    { sent: true,  text: "Ha na! Large wala lena" },
    { sent: false, text: "Done bhai! Mall mein milte" },
  ],
  [
    { sent: true,  text: "Bhai sale ka kuch pata?" },
    { sent: false, text: "Amazon wala?" },
    { sent: true,  text: "Ha! Phone lena tha sasta mein" },
    { sent: false, text: "iPhone 15 ka 10% off hai bhai" },
    { sent: true,  text: "Ye to kuch nahi yaar" },
    { sent: false, text: "OnePlus dekh 30% off mil rha" },
    { sent: true,  text: "Link bhej de" },
    { sent: false, text: "Sending... ✉️" },
    { sent: true,  text: "Received! Order kar deta hun" },
    { sent: false, text: "Fast delivery milegi kal tak" },
  ],
  [
    { sent: true,  text: "Score kya hua match ka?" },
    { sent: false, text: "India ne jeeta bhai! 🎉" },
    { sent: true,  text: "Sacchi?! Kitne run se?" },
    { sent: false, text: "6 wicket se! Rohit ne mara" },
    { sent: true,  text: "Bumrah ka bowling kaisi rhi?" },
    { sent: false, text: "3 wicket liye usne! 🔥" },
    { sent: true,  text: "Bhai main miss kar gaya" },
    { sent: false, text: "Highlights dekh YouTube pe" },
    { sent: true,  text: "Ha abhi dekhta hun" },
    { sent: false, text: "Kya match tha yaar! 🏏" },
  ],
  [
    { sent: true,  text: "Happy Birthday bhai! 🎂🎉" },
    { sent: false, text: "Thanks yaar! Bahut bahut shukriya 😊" },
    { sent: true,  text: "Party kab hai?" },
    { sent: false, text: "Aaj raat ko ghar pe" },
    { sent: true,  text: "Main aaunga pakka! Kya laun?" },
    { sent: false, text: "Kuch mat lana, bas aa jao" },
    { sent: true,  text: "Aise kaise, cake to lunga" },
    { sent: false, text: "Chocolate wala lena 😋" },
    { sent: true,  text: "Done! 8 baje pahunchu?" },
    { sent: false, text: "Perfect, sab log usi time aa rahe" },
  ],
  [
    { sent: true,  text: "Net bahut slow chal rha" },
    { sent: false, text: "Haan yaar mera bhi" },
    { sent: true,  text: "Kya provider hai tera?" },
    { sent: false, text: "Jio hai. Tera?" },
    { sent: true,  text: "Airtel hai, fir bhi slow" },
    { sent: false, text: "Server issue hoga" },
    { sent: true,  text: "Game nhi ho rha lag" },
    { sent: false, text: "Haan bhai wait karo thoda" },
    { sent: true,  text: "Ok chal kuch aur karte" },
    { sent: false, text: "Theek hai yaar 😅" },
  ],
  [
    { sent: true,  text: "Khana khaya?" },
    { sent: false, text: "Nahi abhi nahi, tu bata?" },
    { sent: true,  text: "Main bhi nahi, bhook lag rhi" },
    { sent: false, text: "Order karte hai zomato pe?" },
    { sent: true,  text: "Ha kya mangana hai?" },
    { sent: false, text: "Biryani aur raita 😋" },
    { sent: true,  text: "Same yaar! Main order karta hun" },
    { sent: false, text: "Paise split kar lena" },
    { sent: true,  text: "40 min mein aa jayega" },
    { sent: false, text: "Perfect, main bhook mita rha hun 😂" },
  ],
  [
    { sent: true,  text: "Exam ki taiyari ho rhi?" },
    { sent: false, text: "Thodi thodi ho rhi hai 😅" },
    { sent: true,  text: "Maths ka syllabus complete hua?" },
    { sent: false, text: "60% ho gaya hai" },
    { sent: true,  text: "Mera to abhi shuru nahi hua" },
    { sent: false, text: "Kal se sath mein karein?" },
    { sent: true,  text: "Ha bilkul! Library chalein subah?" },
    { sent: false, text: "9 baje theek rahega" },
    { sent: true,  text: "Done! Notes bhi le aana" },
    { sent: false, text: "Ok sab lekar aaunga 📚" },
  ],
];

function randomTime(baseHour: number, index: number): string {
  const h = baseHour + Math.floor(index / 4);
  const m = (index * 7) % 60;
  const hour = h % 12 || 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function getRandomUser(): RandomUser {
  return RANDOM_USERS[Math.floor(Math.random() * RANDOM_USERS.length)];
}

export function getRandomConversation(user: RandomUser): Message[] {
  const template = CONVERSATIONS[Math.floor(Math.random() * CONVERSATIONS.length)];
  const baseHour = 9 + Math.floor(Math.random() * 8);
  return template.map((t, i) => ({
    id: `auto_${Date.now()}_${i}`,
    text: t.text,
    sent: t.sent,
    time: randomTime(baseHour, i),
    read: t.sent,
  }));
}

export function getUniqueRandomUsers(count: number): RandomUser[] {
  const shuffled = [...RANDOM_USERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, RANDOM_USERS.length));
}
