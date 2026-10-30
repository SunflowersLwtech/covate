// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "用 AI 会让你变成更差的程序员吗？一次坦诚的审视";
export const DESCRIPTION =
  "依赖 AI 编程助手会让你变成更差的程序员吗？坦白说：有可能——通过技能退化——但并非必然。本文平衡地审视正反两方面的证据，以及决定你走向哪一边的那个关键因素（主动使用还是被动使用）。";

const FAQ = [
  {
    q: "用 AI 真的会让你变成更差的程序员吗？",
    a: "有可能，但并非必然——这才是大多数博眼球的说法略过不提的坦白答案。当 AI 助手让你不再做那些当初塑造了你技能的脑力活时，它就会让你变成更差的程序员：你不理解就接受代码，不再练习回忆 API 和语法，也不再从第一性原理出发调试，因为 AI 通常会替你修好。这些都是实实在在的技能，和任何技能一样，长期不用就会退化。但同一个工具换一种用法，也能让你成为更好的程序员——更快的反馈循环、随时都在的导师、接触到你独自永远发现不了的模式。工具本身是中性的；决定结果的，是你一直做主动的参与者，还是变成了被动的旁观者。",
  },
  {
    q: "为什么依赖 AI 会导致技能退化？",
    a: "因为技能来自费力的回忆和解决问题，而 AI 可以悄悄把这两样都拿走。自己写代码时，你在不停地从记忆里提取知识（该用哪个方法、参数是什么顺序、这个 API 会怎么表现），也在不停地解决小问题（为什么编译不过、边界情况在哪）。每一次这样的动作，都在强化底层的技能。如果你还没试着回忆或推理，AI 就已经给出了答案，你就跳过了这份努力——而带来学习的，是努力，不是答案。这样持续几个月，那些你不再练习的技能就会变慢、变得不可靠，尽管日常工作中一切感觉都很正常，因为 AI 在替你兜着。这就是为什么技能退化很容易被忽视，直到你碰到 AI 解决不了的问题，或者一场面试，或者一次必须独立推理的代码评审。",
  },
  {
    q: "AI 真的能让你成为更好的程序员吗？",
    a: "当然能——主动地用，它可能是编程有史以来最好的学习工具。它可以逐行解释陌生的代码，给你展示解决一个问题的三种方法及其取舍，带你认识那些你都不知道存在的惯用写法和库，还能在你好奇的那一刻、趁上下文还新鲜，就回答“为什么”。它让你能挑战比独自一人时更有野心的项目，而每一个有野心的项目都会教会你一些东西。在 AI 帮助下变强的开发者，把它当作结对编程的导师——读它写的东西，追问为什么，运行之前先预测它会做什么，并用它去钻得更深，而不是用来逃避思考。完全相同的工具，截然相反的结果，全看怎么用。",
  },
  {
    q: "怎样用 AI 而不丢掉自己的技能？",
    a: "在保持主动成本最低的地方保持主动：也就是代码生成的那一刻。具体来说——读生成的代码是为了能解释它，而不只是为了批准它；接受一处改动之前，试着预测它会做什么，以及如果你改了它会有什么东西坏掉；当 AI 用了一个你并不完全了解的 API 或模式时，停下来，趁上下文还新鲜当场学会它；再时不时地不用 AI 解决点问题，让底层的肌肉保持热度。这些都不意味着全面放慢写代码的速度——而是意味着花一分钟主动关注刚进入你代码库的代码，这恰恰是学习成本最低、效果最持久的时候。目标是用 AI 走得更快，同时变得更强，而不是拿一个去换另一个。",
  },
  {
    q: "Covate 怎样帮我在用 AI 的同时保持敏锐？",
    a: "Covate 正是为解决这个问题而做的。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——在你作答之前暂停后续生成，让你必须趁上下文还新鲜就理解每一处改动，而不是被动接受。AI 让你变差还是变强，区别就在这一个习惯。每次会话都会保存下来，同步客户端会把它们推送到你在 covate.org 上的学习台账——免费，无需付款——在那里你可以回顾过去的每一次会话、你的累计正确率，以及你总是答错的主题——于是“保持敏锐”变得可衡量、会自动发生，而不再是一件你得记着去做的事。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">坦白的回答</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          用 AI 会让你变成<span className="text-brand">更差的程序员</span>吗？
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          简短的回答：有可能——但并非必然，而结果往哪边走，几乎完全取决于你自己。依赖 AI 编程助手，可能会因为长期不用而悄悄侵蚀你的技能；换一种用法，同一个工具却能让你比以往任何时候都更敏锐。下面是正反两方面的坦诚论证，以及决定你会得到哪一种结果的那个因素。
        </p>
        <ArticleByline updated="2026-08-04" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">认为会的理由</h2>
          <p className="mt-4">
            这种担忧背后有真实的机制，值得认真对待。编程能力靠两种努力来建立和维持：<strong>回忆</strong>（从你自己的记忆里调出 API、语法和模式）和<strong>解决问题</strong>（弄清楚某样东西为什么坏了、该怎么修）。AI 助手可以把这两样都拿走。如果你还没试着回想或推理出答案，它就递给你一个能用的方案，你就跳过了这份努力——而真正带来学习的，是这份努力，不是写好的代码。
          </p>
          <p className="mt-4">
            长期这样下去，那些你不再练习的技能就会变慢、变得不可靠，任何闲置的技能都是如此。阴险的地方在于，这个过程中你不会觉得有任何不对：AI 替你兜着，功能照常上线，测试照常通过。只有当你碰到模型解决不了的问题、参加一场面试，或者必须独立推理完成一次代码评审时，差距才会暴露出来——你这才意识到，自己一直在交付那些自己既写不出来、也调试不了的代码。这不是杜撰出来的；这就是普通的技能退化，而大量被动地使用 AI，正是通往它的快车道。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">认为不会的理由——它甚至能扭转退化</h2>
          <p className="mt-4">
            然而，也有很多开发者用了 AI 之后变得<em>更强</em>，而不是更差——因为同一个工具，主动地用，可以说是编程有史以来最好的学习加速器。它可以逐行解释陌生的代码，列出解决一个问题的三种做法及其取舍，带你认识那些你自己永远不会碰巧遇到的库和惯用写法，还能在你好奇的那一刻就回答“为什么”——趁上下文还清清楚楚地留在你脑子里。
          </p>
          <p className="mt-4">
            它还让你能挑战比独自一人时更有野心的项目，而有野心的项目正是真正学习发生的地方。在 AI 帮助下变强的开发者，把它当作一个不知疲倦的结对编程导师：读它写的东西，问它为什么，在运行之前先预测它会做什么，并用它去钻得更深，而不是用它来逃避思考。完全相同的工具，截然相反的结果。区别不在 AI——而在人对待它的姿态。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">决定性因素：主动使用还是被动使用</h2>
          <p className="mt-4">
            所以真正的问题不是“AI 对我的技能是好是坏？”，而是“我是在主动地用它，还是被动地用它？”被动使用——生成、瞄一眼、接受、再来一遍——是通往退化的路。主动使用——趁上下文还新鲜，认真对待 AI 产出的代码——是通往进步的路。而保持主动，在一个特定的时刻成本最低：改动刚生成之后。下面几个具体的习惯能让你待在正确的一边：
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "读生成的代码，是为了能解释它，而不只是为了批准它——如果你说不清它做了什么、为什么这么做，那就是需要补上的缺口。",
              "在接受一处改动之前，先预测它会做什么，以及如果你改动其中一行，会有什么东西坏掉。",
              "当 AI 用了一个你并不完全了解的 API 或模式时，当场就把它学会，趁上下文还新鲜。",
              "时不时地不用 AI 解决点问题，让底层的肌肉保持热度。",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-sm leading-7 text-secondary">{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            这些都不意味着你要全面放慢写代码的速度，而是意味着花一分钟认真看看刚进入你代码库的代码——这恰恰是学习成本最低、也记得最牢的时候。做到这一点，AI 就会让你更快<em>而且</em>更强，而不是让你在二者之间取舍。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate，自动待在正确的一边</h2>
          <p className="mt-4 text-secondary">
            保持主动，道理很简单，实践中却很容易忘。Covate 让它自动发生。它是一个免费、开源的 MCP 工具，接入你的 AI 助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——在你作答之前暂停后续生成，让你趁上下文还新鲜就理解每一处改动，而不是被动接受。每次会话都会保存在本地；免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              Covate 学习台账
            </a>
            接手后续：用 GitHub 登录，每一次同步过来的会话、你的累计正确率，以及你总是答错的主题都可以随时回顾。没有任何需要购买的东西。
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SignInCta />
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary"
            >
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
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
            </a>
            <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              合并之前，如何评审 AI 生成的代码 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
