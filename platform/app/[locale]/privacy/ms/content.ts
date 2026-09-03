import type { LegalSection } from "../../../_components/LegalDoc";

// The Bahasa Malaysia privacy notice required by section 7(2) of Malaysia's PDPA 2010.
//
// Why this lives in a TypeScript module and not in messages/<locale>/legal.json:
// scripts/i18n-check.mjs enforces key-for-key parity across every directory under
// messages/, so a messages/ms/ directory would demand a full Malay translation of
// common, home, dashboard, learn (nineteen long-form articles) and evidence before
// the build would pass. "ms" is not a UI locale of this site and is not meant to
// become one — this is one fixed-language legal document, so it is data, not a
// translation catalogue. The CJK red line and the t("…") resolution check are both
// unaffected: no Han characters here, and no translation calls.
//
// Every factual claim below mirrors the English notice in messages/en/legal.json.
// Keep the two in step: if a claim changes there, change it here in the same commit.
// Not reviewed by counsel.

export const MS = {
  meta: {
    title: "Notis Privasi | Covate",
    description:
      "Apa yang dikumpul oleh covate.org, mengapa, dan ke mana perginya: profil GitHub yang anda gunakan untuk log masuk, sesi pembelajaran yang anda pilih untuk disegerakkan, empat kuki dan satu skrip analitik yang kami hoskan sendiri tanpa kuki. Dikendalikan oleh DUOCODE TECHNOLOGY di bawah Akta Perlindungan Data Peribadi 2010.",
  },
  breadcrumb: "Notis Privasi",
  eyebrow: "Perundangan",
  title: "Notis Privasi",
  updated: "Kemas kini terakhir 3 September 2026",
  intro:
    "Versi ringkas: Covate menyimpan profil GitHub yang anda gunakan untuk log masuk, serta sesi pembelajaran yang anda sendiri pilih untuk dimuat naik. Ia tidak pernah memuat naik kod sumber anda, tidak pernah menghantar e-mel kepada anda, dan tidak pernah menjual data anda. Butirannya ada di bawah.",
  languageNote: {
    text:
      "Notis ini diterbitkan dalam bahasa Inggeris, bahasa Cina dan bahasa Malaysia, sebagaimana yang dikehendaki oleh seksyen 7(2) Akta Perlindungan Data Peribadi 2010. Ketiga-tiga versi membawa maksud yang sama; sekiranya berlaku percanggahan, versi bahasa Inggeris yang akan digunakan.",
    href: "/privacy",
    linkLabel: "Privacy Policy (English) →",
  },
  seeAlso: { href: "/terms", label: "Baca Terma Perkhidmatan (dalam bahasa Inggeris) →" },
  sections: [
    {
      heading: "Siapa kami, dan apa yang diliputi oleh notis ini",
      paragraphs: [
        "Covate dikendalikan oleh DUOCODE TECHNOLOGY, sebuah perniagaan pemilikan tunggal yang berdaftar di Malaysia dengan nombor pendaftaran LA0087244-A. Dalam notis ini, “kami” dan “Covate” bermaksud DUOCODE TECHNOLOGY.",
        "Notis ini meliputi laman web covate.org, artikel Learning Center, dan lejar pembelajaran yang anda capai selepas log masuk di covate.org/dashboard. Pelayan MCP Covate ialah perkara yang berasingan: ia perisian sumber terbuka yang berjalan pada mesin anda sendiri, menyimpan sesi pembelajarannya dalam storan tempatan di situ, dan tidak menghantar apa-apa pun kepada kami melainkan anda sendiri menetapkan penyegerakan yang diterangkan di bawah.",
      ],
      bullets: [],
      footnote: "",
    },
    {
      heading: "Apa yang kami kumpul apabila anda log masuk",
      paragraphs: [
        "Log masuk dilakukan melalui GitHub. Kami meminta dua kebenaran sahaja daripada GitHub — read:user dan user:email — iaitu secukupnya untuk mengetahui siapa anda dan untuk mempunyai satu alamat bagi menghubungi anda. Kami tidak pernah melihat kata laluan GitHub anda, dan kami tidak meminta, serta tidak berupaya memperoleh, akses kepada repositori anda.",
        "Daripada log masuk itu, kami menyimpan satu rekod bagi akaun anda:",
      ],
      bullets: [
        "ID pengguna GitHub anda dalam bentuk nombor — kunci yang mengikat sejarah anda, supaya menukar nama akaun GitHub anda tidak menghilangkannya",
        "nama pengguna GitHub anda",
        "nama paparan anda dan alamat web imej avatar GitHub anda (kami menyimpan pautannya, bukan salinan gambar itu)",
        "satu alamat e-mel: e-mel awam pada profil GitHub anda atau, jika anda tidak menetapkannya, satu alamat yang telah disahkan pada akaun GitHub anda — alamat utama anda apabila GitHub memberitahu kami yang mana satu. Jika GitHub tidak memberikan sebarang alamat kepada kami, kami tidak menyimpan satu pun.",
        "token penyegerakan — satu rahsia rawak yang dijana untuk akaun anda, yang digunakan oleh klien penyegerakan untuk memuat naik sesi; anda boleh melihatnya atau menggantikannya di papan pemuka pada bila-bila masa",
        "satu medan pelan, yang tertera “free” bagi setiap akaun, serta masa rekod itu dicipta dan kali terakhir ia dikemas kini",
      ],
      footnote:
        "Kami tidak menyimpan token akses GitHub selepas log masuk. Ia digunakan sekali sahaja, untuk membaca medan profil di atas, dan selepas itu dibuang.",
    },
    {
      heading: "Data pembelajaran yang anda pilih untuk disegerakkan",
      paragraphs: [
        "Lejar anda kekal kosong sehingga anda memasukkan token penyegerakan anda ke dalam klien penyegerakan Covate dan menjalankannya. Tiada apa-apa dimuat naik sebelum itu, dan untuk mematikannya anda cuma perlu membuang token tersebut — atau memutarnya di papan pemuka, yang serta-merta menghentikan token lama daripada berfungsi.",
        "Apabila anda menyegerakkan, setiap sesi pembelajaran sampai kepada kami sebagai:",
      ],
      bullets: [
        "satu pengenal yang telah pun diberikan oleh salinan tempatan anda kepada sesi itu, supaya penyegerakan semula mengemas kini sesi tersebut dan bukannya menduakannya",
        "nama folder projek — namanya sahaja, bukan laluan ke folder itu pada mesin anda",
        "ringkasan pendek tentang perubahan kod yang menjadi asas kuiz tersebut",
        "berapa banyak soalan dalam sesi itu, berapa banyak yang anda jawab dengan betul, serta bila ia bermula dan tamat",
        "bagi setiap soalan: teks soalan, pilihan jawapan, jawapan yang betul, jawapan yang anda berikan, sama ada ia betul, penjelasannya, serta label topik dan konsepnya",
      ],
      footnote:
        "Teks soalan, penjelasan dan ringkasan itu ditulis oleh MCP pada mesin anda sendiri, daripada perubahan kod terkini anda — jadi ia boleh menerangkan, dan mungkin memetik, sebahagian daripada kod yang sedang anda kerjakan. Sila timbangkan perkara ini sebelum menyegerakkan kerja yang anda tidak bebas untuk kongsikan. Apa yang tidak dihantar oleh klien penyegerakan ialah kod itu sendiri: tiada fail, tiada diff, tiada kandungan repositori, tiada laluan direktori. Daripada jawapan anda, kami turut menyimpan kiraan berjalan mengikut topik — berapa banyak yang anda jawab, berapa banyak yang betul, dan bila topik itu terakhir muncul — dan itulah asas senarai topik terlemah di papan pemuka.",
    },
    {
      heading: "Kuki",
      paragraphs: ["Covate menetapkan empat kuki miliknya sendiri. Tiada satu pun daripadanya kuki pengiklanan."],
      bullets: [
        "covate_locale — bahasa yang anda pilih, supaya laman ini terus menyajikannya. Boleh dibaca oleh halaman, disimpan selama setahun.",
        "covate_session — sesi log masuk anda: pengenal akaun anda beserta satu tandatangan yang kami sahkan pada setiap permintaan. HTTP-only, disimpan selama 30 hari, dikosongkan apabila anda log keluar.",
        "covate_oauth_state — satu nilai rawak sekali guna yang menghalang log masuk GitHub daripada dipalsukan. HTTP-only, sepuluh minit.",
        "covate_device_code — semasa log masuk aliran peranti, kod yang sedang kami tukarkan dengan GitHub bagi pihak anda. HTTP-only, dibuang sebaik sahaja log masuk selesai atau tamat tempoh.",
      ],
      footnote:
        "Empat inilah satu-satunya kuki yang ditetapkan oleh laman ini, dan tiada apa-apa lain di sini yang menulis ke storan pelayar anda. Sehingga 3 September 2026, Google Analytics turut menetapkan kukinya sendiri di samping kuki-kuki ini; ia telah dibuang, dan kuki tersebut tidak lagi ditetapkan.",
    },
    {
      heading: "Analitik",
      paragraphs: [
        "Kami mengukur halaman mana yang dibaca orang, menggunakan Umami — perisian analitik sumber terbuka yang kami jalankan sendiri, pada pelayan kami sendiri di Singapura, ke dalam satu pangkalan data yang hanya kami boleh capai. Tiada apa-apa daripada laman ini pergi kepada Google, atau kepada mana-mana syarikat analitik atau pengiklanan lain: tag Google Analytics yang dahulunya dimuatkan pada setiap halaman telah dibuang pada 3 September 2026.",
        "Skrip itu tidak menetapkan sebarang kuki dan tidak menyimpan apa-apa dalam pelayar anda. Apa yang dihantarnya kepada kami ialah alamat dan tajuk halaman yang sedang anda buka, alamat tempat anda datang, saiz skrin anda dan bahasa pelayar anda; parameter penjejakan pautan yang dibawa dalam alamat itu, seperti utm_source atau gclid, direkodkan sebagai medan tersendiri. Daripada permintaan itu sendiri, pelayan kami menentukan pelayar, sistem pengendalian dan jenis peranti anda, serta lokasi anggaran — negara, wilayah dan bandar — daripada alamat IP anda.",
        "Alamat IP anda tidak disimpan dalam pangkalan data analitik itu: tiada medan untuk menyimpannya, di mana-mana di dalamnya. Ia digunakan pada saat itu sahaja, untuk menerbitkan satu pengenal pelawat — satu cincangan sehala bagi permintaan tersebut, dengan alamat IP dan pelayar anda antara inputnya, dibubuh garam dengan satu rahsia yang hanya dipegang oleh pelayan kami. Pengenal itu tidak boleh dikembalikan semula menjadi alamat IP anda, tetapi ia bersifat nama samaran dan bukannya tanpa nama: selagi anda kekal pada rangkaian dan pelayar yang sama, lawatan kemudian dikira sebagai pelawat yang sama, dan kami telah melihat perkara itu bertahan selama berminggu-minggu. Ia tidak dikongsi dengan sesiapa pun.",
        "Perisian ini juga mampu merakam apa yang dilakukan pelawat pada skrin dan membina peta haba daripadanya. Kedua-duanya dimatikan bagi covate.org dan tidak pernah dihidupkan: tiada ketukan kekunci, gerakan tetikus atau kandungan skrin anda yang dirakam.",
        "Oleh sebab tiada apa-apa daripada ini yang disimpan pada peranti anda, tiada apa-apa di sini yang memerlukan sepanduk kuki untuk meminta kebenaran anda — anda tidak melihatnya kerana ia memang tidak diperlukan, bukan kerana kami meninggalkannya. Sekiranya anda langsung tidak mahu dikira, sekat skrip itu dengan pelayar anda atau dengan penyekat kandungan, atau tetapkan umami.disabled kepada 1 dalam local storage laman ini; skrip tersebut memeriksa tanda itu sebelum ia menghantar apa-apa.",
      ],
      bullets: [],
      footnote: "",
    },
    {
      heading: "Pengehosan dan log pelayan",
      paragraphs: [
        "Laman ini dan APInya berjalan di Vercel; pangkalan datanya ialah Postgres yang dihoskan di Supabase. Menyajikan satu halaman kepada anda semestinya bermakna penyedia pengehosan mengendalikan permintaan itu, termasuk alamat IP tempat ia datang, dan kedua-dua penyedia menyimpan log operasi masing-masing di bawah dasar mereka sendiri. Covate sendiri tidak menulis log permintaan dan tidak menyimpan sebarang alamat IP dalam pangkalan datanya.",
        "Skrip analitik itu disajikan dari sebuah mesin ketiga, milik kami sendiri, yang disewa daripada Amazon Web Services di Singapura. Pelayan webnya menyimpan log akses biasa dan — sebagaimana log mana-mana pelayan web — log itu merekodkan alamat IP bagi setiap permintaan skrip tersebut dan setiap ukuran yang dihantarnya kembali. Log itu milik kami dan bukan milik sesiapa lain, kami menyimpannya untuk mengendalikan mesin tersebut, dan kami tidak menggabungkannya dengan data analitik.",
      ],
      bullets: [],
      footnote: "",
    },
    {
      heading: "Apa yang kami tidak lakukan",
      paragraphs: [],
      bullets: [
        "Kami tidak menjual, menyewakan atau memperdagangkan data peribadi.",
        "Kami tidak mengambil sebarang butiran pembayaran, kerana tiada apa-apa di sini yang dijual: tiada pelan berbayar, tiada langganan dan tiada kaunter pembayaran di mana-mana pada laman ini.",
        "Kami tidak menggunakan data pembelajaran yang anda segerakkan untuk melatih model pembelajaran mesin.",
        "Kami tidak menjalankan pengiklanan dan tidak membawa sebarang penjejak rangkaian iklan.",
        "Laman ini langsung tidak menghantar e-mel — tiada pemasaran, tiada pemberitahuan. Alamat anda disimpan untuk mengenal pasti akaun anda dan supaya kami boleh membalas jika anda menulis kepada kami.",
      ],
      footnote: "",
    },
    {
      heading: "Mengapa kami memprosesnya, dan atas dasar apa",
      paragraphs: [
        "Kami memproses data di atas untuk mengesahkan identiti anda, untuk menunjukkan lejar pembelajaran anda sendiri kepada anda, dan untuk memastikan perkhidmatan ini terus berjalan serta bebas daripada penyalahgunaan. Di bawah Akta Perlindungan Data Peribadi 2010 Malaysia, kami bersandar pada kebenaran anda — yang diberikan semasa anda log masuk, dan sekali lagi apabila anda memilih untuk menetapkan penyegerakan — dan pada pemprosesan itu yang perlu bagi perkhidmatan yang anda minta kami laksanakan. Anda boleh menarik balik kebenaran itu pada bila-bila masa; lihat “Hak anda” di bawah.",
      ],
      bullets: [],
      footnote: "",
    },
    {
      heading: "Siapa lagi yang mengendalikan data anda",
      paragraphs: ["Kami menggunakan beberapa penyedia perkhidmatan sahaja, setiap satu untuk satu tujuan:"],
      bullets: [
        "GitHub — log masuk dan medan profil yang disenaraikan di atas",
        "Vercel — pengehosan bagi laman web dan APInya",
        "Supabase — pangkalan data Postgres tempat akaun dan rekod pembelajaran anda berada",
        "Amazon Web Services — pelayan di Singapura tempat perisian analitik kami sendiri dan pangkalan datanya berjalan",
      ],
      footnote:
        "Penyedia-penyedia ini beroperasi di luar Malaysia, jadi data anda disimpan dan diproses di luar Malaysia; dengan menggunakan Covate, anda bersetuju dengan pemindahan itu. Selain daripada mereka, kami tidak mendedahkan data peribadi kepada sesiapa pun, melainkan sesuatu pihak berkuasa atau mahkamah Malaysia menuntutnya daripada kami secara sah.",
    },
    {
      heading: "Berapa lama kami menyimpannya",
      paragraphs: [
        "Kami menyimpan akaun anda dan rekod pembelajaran yang anda segerakkan sehingga anda meminta kami memadamkannya, atau sehingga Covate ditutup. Kami tidak menetapkan jadual penyimpanan yang tetap, dan kami lebih rela menyatakannya begitu daripada menerbitkan satu jadual yang sebenarnya tidak kami kuatkuasakan.",
        "Memadamkan akaun anda memadamkan segala-galanya yang terikat kepadanya: sesi anda, setiap jawapan, dan kiraan mengikut topik turut hilang bersamanya.",
      ],
      bullets: [],
      footnote: "",
    },
    {
      heading: "Hak anda",
      paragraphs: [
        "Akta Perlindungan Data Peribadi 2010 Malaysia memberi anda hak untuk bertanya apakah data peribadi yang kami pegang tentang anda, untuk membetulkannya, untuk menarik balik kebenaran anda, dan untuk menghadkan cara ia diproses. Tuliskan kepada duocodetechu@gmail.com — daripada alamat e-mel pada akaun GitHub anda, atau dengan memberitahu kami nama pengguna GitHub anda — dan kami akan menjawab dalam tempoh 21 hari, sebagaimana yang dikehendaki oleh Akta tersebut.",
      ],
      bullets: [
        "Dapatkan satu salinan — kami akan menghantar kepada anda apa yang kami pegang, dalam bentuk yang boleh anda baca dan guna semula.",
        "Betulkannya — hampir kesemuanya datang daripada GitHub, jadi membetulkannya di sana dan log masuk semula akan menyegarkan nama, nama pengguna, avatar dan e-mel anda di sini.",
        "Padamkannya — papan pemuka belum mempunyai butang padam, jadi mintalah kepada kami melalui e-mel dan kami akan membuang akaun itu dan segala-galanya yang terikat kepadanya.",
        "Berhenti menyegerakkan — keluarkan token penyegerakan daripada konfigurasi MCP anda, atau putarkannya di papan pemuka, yang membatalkan token lama dengan serta-merta. Sesi yang telah dimuat naik akan kekal sehingga anda meminta kami memadamkannya.",
        "Membuat aduan — jika kami tidak membetulkan sesuatu, anda boleh membuat aduan kepada Pesuruhjaya Perlindungan Data Peribadi (Jabatan Perlindungan Data Peribadi) di Malaysia.",
      ],
      footnote: "",
    },
    {
      heading: "Keselamatan",
      paragraphs: [
        "Kuki sesi anda bersifat HTTP-only, dihantar hanya melalui HTTPS, dan membawa satu tandatangan yang kami sahkan pada setiap permintaan, jadi ia tidak boleh diubah suai menjadi akaun orang lain. Sambungan ke pangkalan data disulitkan.",
        "Token penyegerakan anda ialah kata laluan dalam setiap erti kata praktikal: sesiapa yang memegangnya boleh memuat naik sesi ke dalam lejar anda. Ia tidak pernah dicetak ke dalam HTML halaman — papan pemuka mengambilnya hanya untuk sesi yang telah log masuk — dan ia tidak boleh digunakan untuk membaca atau memutarkan dirinya sendiri. Jika anda fikir ia telah bocor, putarkannya di papan pemuka.",
        "Tiada perkhidmatan boleh menjanjikan keselamatan yang sempurna, dan kami tidak akan berpura-pura sebaliknya.",
      ],
      bullets: [],
      footnote: "",
    },
    {
      heading: "Kanak-kanak",
      paragraphs: [
        "Covate ialah alat untuk pembangun perisian yang bekerja dan tidak ditujukan kepada kanak-kanak. Kami tidak dengan sedar mengumpul data peribadi daripada sesiapa yang berumur di bawah 18 tahun tanpa kebenaran ibu bapa atau penjaga, sebagaimana yang dikehendaki oleh undang-undang Malaysia. Jika anda percaya seorang kanak-kanak telah memberikan data kepada kami, tuliskan kepada kami dan kami akan memadamkannya.",
      ],
      bullets: [],
      footnote: "",
    },
    {
      heading: "Perubahan pada notis ini",
      paragraphs: [
        "Jika notis ini berubah, kami akan mengemas kininya di sini dan menukar tarikh di bahagian atas. Sebarang perubahan yang material akan diterangkan dalam perubahan itu sendiri, bukan diselitkan secara senyap.",
      ],
      bullets: [],
      footnote: "",
    },
    {
      heading: "Hubungi kami",
      paragraphs: [
        "DUOCODE TECHNOLOGY (no. pendaftaran LA0087244-A), Malaysia. E-mel duocodetechu@gmail.com — itulah alamat untuk soalan privasi, permintaan akses data dan permohonan pemadaman.",
      ],
      bullets: [],
      footnote: "",
    },
  ] satisfies LegalSection[],
};
