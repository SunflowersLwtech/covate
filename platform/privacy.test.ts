import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { MS } from "./app/[locale]/privacy/ms/content";

// The privacy notice's Analytics and "Hosting and server logs" sections, held
// to what the analytics server does since 23 November 2026, in all three
// languages.
//
// - Umami's visitor id is a hash of the website, the IP address, the browser
//   string and a salt (Umami 3.2.0, src/app/api/send/route.ts). With
//   SALT_ROTATION unset the salt is the start of the month (getSalt in
//   src/lib/crypto.ts), and the notice said the id held "for weeks at a time".
//   Production has set SALT_ROTATION=day since 23 November 2026, so the id is
//   new every UTC day.
// - The nginx in front of Umami kept an access log of every request for the
//   script and every measurement, with the IP address, for 30 days. Since 23
//   November 2026 the two Umami locations have `access_log off`.
//
// Each claim is checked inside its own section, so the same words elsewhere
// in the notice cannot stand in for it.

type Section = { heading: string; paragraphs: string[] };
const messages = (locale: string) =>
  JSON.parse(readFileSync(join(import.meta.dirname, "messages", locale, "legal.json"), "utf8")).privacy as {
    updated: string;
    sections: Section[];
  };

const notices = {
  en: { doc: messages("en"), analytics: "Analytics", hosting: "Hosting and server logs" },
  "zh-CN": { doc: messages("zh-CN"), analytics: "分析", hosting: "托管" },
  ms: { doc: MS as unknown as { updated: string; sections: Section[] }, analytics: "Analitik", hosting: "Pengehosan" },
};

function section(doc: { sections: Section[] }, heading: string): string {
  const found = doc.sections.filter((s) => s.heading.includes(heading));
  assert.equal(found.length, 1, `exactly one section headed "${heading}"`);
  return found[0].paragraphs.join(" ");
}

const SAYS = {
  en: {
    analytics: [
      /salted with a secret that only our server holds and with the date/,
      /on the same day, while you stay on the same network and browser, later visits are counted as the same visitor/,
      /The next day \(the date changes at 8 am Malaysia time\) the identifier is a new one, so nothing in the analytics database links your visits from one day to the next/,
      /since 23 November 2026; before then the identifier changed only with the calendar month/,
    ],
    hosting: [
      /Since 23 November 2026 its web server keeps no access log of the requests for the script or of the measurements it sends back/,
      /deleted as they reach 30 days old/,
    ],
    stale: [/Its web server keeps ordinary access logs/, /later visits are counted as the same visitor, and we have seen that hold for weeks/],
    updated: "Last updated 23 November 2026",
  },
  "zh-CN": {
    analytics: [
      /密钥和当天的日期作为盐/,
      /同一天里，只要你还在同一个网络、同一个浏览器上，之后的访问会被算作同一位访客/,
      /到第二天（日期在马来西亚时间早上 8 点切换），标识就换成新的，所以分析数据库里没有任何东西能把你不同日子的访问联系起来/,
      /这是 2026 年 11 月 23 日起的做法；在此之前，标识只随日历月更换/,
    ],
    hosting: [/自 2026 年 11 月 23 日起，它的 Web 服务器不再为请求脚本和回传统计数据的请求保留访问日志/, /满 30 天即删除/],
    stale: [/它的 Web 服务器会保留常规的访问日志/, /只要你还在同一个网络、同一个浏览器上，之后的访问会被算作同一位访客——实测/],
    updated: "最后更新：2026 年 11 月 23 日",
  },
  ms: {
    analytics: [
      /rahsia yang hanya dipegang oleh pelayan kami dan dengan tarikh/,
      /pada hari yang sama, selagi anda kekal pada rangkaian dan pelayar yang sama, lawatan kemudian dikira sebagai pelawat yang sama/,
      /Keesokan harinya \(tarikh bertukar pada pukul 8 pagi waktu Malaysia\) pengenal itu sudah baharu, jadi tiada apa-apa dalam pangkalan data analitik yang mengaitkan lawatan anda dari satu hari ke hari yang lain/,
      /sejak 23 November 2026; sebelum itu pengenal tersebut hanya bertukar mengikut bulan kalendar/,
    ],
    hosting: [
      /Sejak 23 November 2026 pelayan webnya tidak menyimpan log akses bagi permintaan skrip tersebut atau ukuran yang dihantarnya kembali/,
      /dipadamkan apabila mencapai usia 30 hari/,
    ],
    stale: [/Pelayan webnya menyimpan log akses biasa/, /lawatan kemudian dikira sebagai pelawat yang sama, dan kami telah melihat/],
    updated: "Kemas kini terakhir 23 November 2026",
  },
};

for (const [lang, n] of Object.entries(notices)) {
  const want = SAYS[lang as keyof typeof SAYS];
  test(`privacy (${lang}): the analytics visitor id lasts a day, since 23 November 2026`, () => {
    const text = section(n.doc, n.analytics);
    for (const s of want.analytics) assert.match(text, s);
  });
  test(`privacy (${lang}): the analytics server no longer logs the requests`, () => {
    const text = section(n.doc, n.hosting);
    for (const s of want.hosting) assert.match(text, s);
  });
  test(`privacy (${lang}): the old wording is gone and the date moved with it`, () => {
    const all = n.doc.sections.map((s) => s.paragraphs.join(" ")).join(" ");
    for (const s of want.stale) assert.doesNotMatch(all, s, `old wording still there: ${s.source}`);
    assert.equal(n.doc.updated, want.updated);
  });
}
