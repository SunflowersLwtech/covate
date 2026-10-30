// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "“离了 AI 我已经不会写代码了”——到底该怎么办";
export const DESCRIPTION =
  "如果现在离开 AI 助手就觉得写不了代码，解决办法是有计划地重新练习，而不是一下子彻底戒断：按固定节奏，从你已经理解的代码开始，重新培养自己写小段代码的能力。本文教你诊断自己到底丢掉了什么，并在几周内把它重建回来。";

const DIAGNOSIS = [
  {
    n: "01",
    title: "语法回忆：话到嘴边写不出来",
    body: "你知道自己想表达什么，但离开提示词就写不出那个循环、那条正则、那个 SQL 连接。这是最常见的一种流失，也是最浅的一层——它退化，只是因为亲手敲语法变成了可选项。它恢复得也最快，靠的是小而频繁的重写练习：把同一个小工具函数连续三天从零写一遍。",
  },
  {
    n: "02",
    title: "问题拆解：你不会把问题拆开了",
    body: "更难察觉，也危害更大：你已经不再练习把一个模糊的需求拆成步骤、数据结构和接口了——这些事 AI 在暗地里替你做了。检验方法：拿一个小功能，只用 15 分钟写出计划，一行代码都不写。如果这份计划含含糊糊，这就是该最先重建的那块肌肉，因为资深开发者的每项能力都建在它上面。",
  },
  {
    n: "03",
    title: "调试：不问别人你就找不到 bug",
    body: "你把调用栈直接贴给 AI，而不是自己读。调试能力是在有成效的挣扎中学会的——提出一个假设、把它隔离出来、再去验证。如果这个循环现在总是绕道助手，就先立一条规矩：任何出现还不到一小时的 bug，你都要先自己读完调用栈、提出一个假设，然后再去问。",
  },
  {
    n: "04",
    title: "代码库知识：你不了解自己的系统",
    body: "这是最安静的一种。AI 把代码写进你很少打开的文件里，六个月后你就解释不清自己的项目是怎么运作的。这不是打字的问题，是阅读的问题，也是在故障现场和面试里最痛的那种。重建的办法是一套读代码的固定流程，而不是写代码的流程。",
  },
] as const;

const FAQ = [
  {
    q: "对 AI 编程助手的依赖是永久性的吗？",
    a: "不是——但它也不会自己消退，因为你每天的工作流程都在强化它。长期不用而退化的是回忆能力（写出语法、拆解问题、独立调试），而回忆能力靠练习回来，不靠阅读。大多数有意识重建的开发者反映，每天做一小段练习，几周就能看出明显变化；收获最大的做法，是把你已经理解的方案重新推导一遍，而不是毫无准备地直接去啃全新的问题。当你能诚实地说出“这段我自己也能写，只是选择把它交出去”的那一刻，依赖的循环就断了——那是在使用工具，不是依赖。",
  },
  {
    q: "要解决这个问题，我是不是该彻底停用 AI？",
    a: "那是治错了病因。问题不在于 AI 替你写代码，而在于你从不去接触它写出来的东西。一下子彻底戒断，多半只会让你在样板代码上变慢，理解却重建不起来，而且几乎没人能坚持下去。可持续的做法是有计划地重新练习：挑出那些“自己不会”代价最大的类别（核心逻辑、调试、你自己的架构），亲手把它们重建回来，同时继续把样板代码和你已经理解透的常见模式交出去。目标是：你能在没有 AI 的情况下写代码，然后仍然选择使用它。",
  },
  {
    q: "依赖 AI 之后，重建编程能力要多久？",
    a: "这取决于退化有多深，但对大多数在职开发者来说，现实的时间线是两到六周的短时日常练习——每天 15 到 30 分钟——之后，不借助助手的工作就不再让人觉得陌生。语法回忆恢复得最快（几天）。问题拆解需要几周的计划练习。代码库知识则是并行积累的：每次你读完一个 diff 而不是扫一眼，它就多一分。陷阱在于想用一个周末的突击来衡量进步；真正把回忆能力找回来的机制是有间隔的、反复的提取，而不是一次长时间的死记硬背。",
  },
  {
    q: "这和普通的手生有什么区别？",
    a: "普通的手生发生在你停用某项技能的时候——你有一段时间没碰 SQL，就忘了 SQL。AI 依赖造成的手生，却发生在你每天都在交付的过程中，这正是它阴险的地方：你的产出看起来没问题，评审照样通过，功能照样上线。退化掉的是过程中间那些看不见的部分（计划、回忆、验证），而看得见的部分（能用的软件）一直在变好。这也是它常常在最糟糕的时刻暴露出来的原因——在面试里，在助手用不了的故障现场，或者在 AI 的建议是错的、而你又分辨不出来的时候。",
  },
  {
    q: "Covate 怎么帮你应对对 AI 的依赖？",
    a: "Covate 针对的正是退化背后的那个具体机制：被动接受。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——在你作答之前暂停后续生成。这样就把依赖最深的那一刻（AI 刚刚写完一段东西）变成了提取练习的时刻。每次会话都会同步到 covate.org 上的学习台账——用 GitHub 登录，没有任何需要购买的东西——上面显示你的累计正确率，以及你总是答错的主题，于是重建的力气就花在真正有缺口的地方。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          “离了 AI 我已经不会写代码了”——到底该怎么办
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          解决办法是有计划地重新练习，而不是一下子彻底戒断：按固定节奏，从你已经理解的代码开始，重新培养自己写小段代码的能力——同时把 AI 留在它真正擅长的地方。下面教你精确诊断自己到底丢掉了什么，并在几周内把它重建回来。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            这件事通常在一个不方便的时刻才让你醒悟：助手挂了，或者你正在面试，或者你打开一个空白文件，发现离开提示词就不知道从哪里下手。一连几个月接受生成的代码都毫无阻力——而就在这期间，独立写出代码的能力悄悄溜走了。如果这说的就是你：这很常见，也可以逆转，而且恢复起来比当初退化所用的时间要短。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">先诊断你到底丢掉了什么</h2>
          <p className="mt-4">
            “离了 AI 就不会写代码”其实是四个不同的问题披着同一件外衣，而它们的解法各不相同。诚实地逐条问自己一遍：
          </p>
          <ol className="mt-6 space-y-5">
            {DIAGNOSIS.map((c) => (
              <li key={c.n} className="rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-accent">{c.n}</span>
                  <h3 className="text-lg font-medium text-primary">{c.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-7 text-secondary">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">重建：重新推导，而不是开新项目</h2>
          <p className="mt-4">
            已知最快恢复一项退化技能的办法，是对你曾经掌握过的材料做提取练习——而不是逞英雄地从零开新项目。具体做法：拿一个 AI 最近替你写的函数、模块或 SQL 查询，把它关掉，凭着对它用途的记忆（而不是对原文的记忆）重写一遍。然后把你的版本和 AI 的版本做一次 diff。你看到的那些缺口，<em>就是</em>你的课程表。每天 15 到 30 分钟，胜过一个周末的突击，因为把内容送进持久记忆的是间隔，而不是强度。
          </p>
          <p className="mt-4">
            再配上一个拆解热身：今天在把任何任务交出去之前，先自己写出三步计划。之后你照样可以把这份计划交给 AI。区别在于，那个架构决策——真正属于你的那一部分——是在它进入提示词之前，先发生在你自己脑子里的。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">留着 AI，改变你在这个循环里的角色</h2>
          <p className="mt-4">
            最终的状态不是躲开 AI，而是成为这样的开发者：你不靠帮助也做得到，只是有意识地选择交出去。三个角色上的改变能带你到那里：先要解释再要代码（“先带我走一遍你会怎么解决这个问题”），让推理先到达你这里；把每一个生成的 diff 都当成你必须通过的理解测验，通过了再合并；持续记下一份笔记，写下你总是答错的地方——这份清单就是你的练习队列，而诚实地看见它，就已经成功了一半。习惯层面的做法，我们写在
            <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              写代码时如何避免过度依赖 AI
            </a>
            里；背后的证据，见
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              用 AI 会让你变成更差的程序员吗？一次坦诚的审视
            </a>
            。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 把恢复变成一种习惯</h2>
          <p className="mt-4 text-secondary">
            靠意志力重建，恰恰会在你最忙的时候失败。Covate 把“重新推导”这一步自动化了：它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——在你作答之前暂停后续生成。之后，covate.org 上免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            会记录每一次同步过来的会话、你的累计正确率，以及你总是答错的主题，于是你的练习时间就花在自己真正的缺口上。没有任何需要购买的东西——这个 MCP 以 MIT 协议开源，台账也是免费的。
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SignInCta />
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
              {t("getMcp")}
            </a>
          </div>
          <p className="mt-4 font-mono text-[11px] text-dim">{t("finePrint")}</p>
        </section>

        {/* Shared evidence layer (app/_geo/Evidence.tsx), already in the visitor's language. */}
        <Evidence />

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">{t("faq")}</h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none">
                  <h3 className="text-sm font-medium text-primary transition group-open:text-accent hover:text-accent">{f.q}</h3>
                </summary>
                <p className="mt-2 text-sm leading-7 text-secondary">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="border-t border-border pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">{t("related")}</p>
          <div className="mt-3 flex flex-col gap-2">
            <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              写代码时如何避免过度依赖 AI →
            </a>
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              用 AI 会让你变成更差的程序员吗？一次坦诚的审视 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
