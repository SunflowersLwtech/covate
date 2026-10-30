// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "如何用 AI 学一门新的编程语言";
export const DESCRIPTION =
  "用 AI 学一门新的编程语言是可行的——只要你诚实地守住“生成”与“理解”的比例：AI 负责解释和搭脚手架，核心练习由你自己写，每一个你认不出的惯用写法都变成一个学习条目。本文介绍这套方法，以及它帮你避开的那种失败模式。";

const PHASES = [
  {
    n: "01",
    title: "第 1 阶段——语法要过你自己的手，而不是它的",
    body: "学一门新语言的第一周是动作技能的学习：语法得从你自己手里写出来。经典练习自己写——FizzBuzz、一个栈、文件 I/O、错误处理——把 AI 当成一本随叫随到的语法手册：“这里要返回一个错误，地道的写法是什么？”一旦你让它替你写这些，你就跳过了新语言里光靠读是读不会的那一部分。",
  },
  {
    n: "02",
    title: "第 2 阶段——检查你自己代码的写法是否地道",
    body: "等你能写出能跑的代码，差距就转移到“按这门语言希望的方式来写”上了。把你的函数贴过去，让它“用地道的写法重写这段代码，并解释每一处改动”——然后把它的版本和你的版本做个 diff。每一处差异都是一堂关于这门语言文化的课：Rust 的所有权、Python 的推导式、Go 的“错误即值”。代码是你写的；AI 负责给你的口音打分。",
  },
  {
    n: "03",
    title: "第 3 阶段——有导师在旁，读真实的代码库",
    body: "挑一个这门语言里口碑好的库，读它。遇到让你卡住的语法结构——trait bound、装饰器、channel 模式——就请 AI 解释这个结构，而不是重写这段代码。这正是 AI 真正能加速语言学习的地方：过去要在 Stack Overflow 上翻一周的考古工作，现在一个下午就够了；而且这是解释、不是生成，所以不会挤占你亲手练习的次数。",
  },
  {
    n: "04",
    title: "第 4 阶段——交付一个作品，并记下哪些地方靠 AI 兜底",
    body: "做一个真实的小项目。样板代码和不熟悉的角落可以交给 AI，但核心部分继续自己写，并随手记下每一行你没完全看懂就接受了的代码。这份清单就是你第二周的复习队列——也是一把诚实的尺子，衡量你是真学会了这门语言，还是只是靠它交了差。",
  },
] as const;

const FAQ = [
  {
    q: "用 AI 真的能学会一门编程语言吗？",
    a: "能——前提是诚实地守住这个比例。AI 是出色的讲解者、地道写法的检查者和代码库导师，却完全替代不了早期那些让语法变成肌肉记忆的反复练习。用 AI 成功学会新语言的开发者，用它来加速理解（随时解释、把自己写的代码改写成地道的写法、带着读真实的库），同时把写代码中起承重作用的那些阶段留给自己。学不会的人则什么都让它生成，直接交付，六周后才发现：自己连这门一直在“用”的语言里的一条调用栈都调试不了。",
  },
  {
    q: "用 AI 学语言时，最大的错误是什么？",
    a: "在头两周把分工弄反了：让助手去写基础练习。学一门语言的早期是动作技能的学习——语法得从你自己手里写出来，否则一到压力之下你就永远想不起来。解决办法是一条简单的规则：一开始，AI 负责回答问题、给你写的代码打分，但不替你写。等基础真正内化成本能之后，这个比例才可以转向“生成加评审”。",
  },
  {
    q: "怎么判断我是在学这门语言，还是只是靠它交差？",
    a: "定期做一次空白文件测试：关掉一切，在没有任何辅助的情况下写一个小程序——一个 CLI、一个解析器，学到哪儿就写什么。如果写不出来，你就一直是在靠它交差。一个更省事、能持续观察的信号，是记下每一行你没理解就接受了的代码：如果这份清单一周比一周长，而不是一周比一周短，说明理解的比例正往错误的方向偏。",
  },
  {
    q: "学语言时，AI 比书或课程更好还是更差？",
    a: "工具不同，但你在两者面前要扮演的角色是一样的。书给你一条精心编排的路线，却不会对你的代码给出反馈；AI 能给你即时、具体的反馈，却不给你路线——除非你自己定一条。我们见过最强的组合是：用书或课程搭起结构，把 AI 当作实时导师，回答书本回答不了的问题（“为什么偏偏是这一行出错？”）。如果单独使用、没有任何结构，AI 辅导往往只会带来又广又浅的熟悉感——解释过的概念很多，亲手写出的程序很少。",
  },
  {
    q: "Covate 在用 AI 学语言这件事里扮演什么角色？",
    a: "Covate 替你盯着“生成与理解”的比例。它免费、开源的 MCP 接入你的 AI 编程助手（Claude、Cursor、Copilot 等），把你实际的 diff 变成简短、有针对性的测验——也包括你正在学的这门语言的惯用写法和语法结构——在你作答之前暂停后续生成。covate.org 上免费的学习台账（用 GitHub 登录，没有任何需要购买的东西）会记录你的正确率和最薄弱的主题；在一门新语言里，这实际上就是一张地图，标出哪些你已经真正内化，哪些只是一直在借用。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          如何用 AI 学一门新的编程语言
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          用 AI 学新语言完全可行——只要你诚实地守住“生成”与“理解”的比例：AI 负责解释、评判你的写法是否地道、辅导你读代码，而起承重作用的那部分代码由你自己写。本文给出一个四阶段方法——以及一种会悄悄吃掉你六周时间的失败模式。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            过去学一门新语言，意味着一本书、一个 REPL，以及一段漫长而安静的、独自一次次把语法写错的日子。AI 压缩了这些孤独的部分——解释即时送达，错误能结合上下文得到诊断——但也因此带来了一种靠书本学语言的年代没有的失败模式：你可以用一门自己还没法独立写出代码的语言，交付看起来很流畅的代码。下面的方法，就是要留住这份提速，同时拒绝掉进这个陷阱。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">四个阶段</h2>
          <ol className="mt-6 space-y-5">
            {PHASES.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">诚实的比例</h2>
          <p className="mt-4">
            四个阶段都遵循同一条原则：<em>生成是 AI 干的事；理解是你必须能证明自己具备的东西。</em>拿不准一项任务落在线的哪一边时，就问问自己：即使没有你，这段产出是否也会按这门语言自身的惯用写法长成这样——样板代码会，核心逻辑不该如此。至于相邻的问题——AI 到底什么时候该动手写代码——请看
            <a href="/learn/when-to-write-code-by-hand-vs-let-ai" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              什么时候亲手写代码，什么时候交给 AI
            </a>；依赖已经形成时该怎么办，请看
            <a href="/learn/cant-code-without-ai-anymore" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              “离了 AI 我已经不会写代码了”
            </a>。下面 FAQ 里的空白文件测试，是一次低成本的自查，能让整套做法保持诚实。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 把这个比例量出来</h2>
          <p className="mt-4 text-secondary">
            Covate 让“生成与理解”的比例变得看得见，而不是凭感觉。这个免费、开源的 MCP 接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——在一门新语言里，考的恰恰是你一直在接受的那些惯用写法和语法结构——在你作答之前暂停后续生成。随后，covate.org 上免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            会记录你的正确率和最薄弱的主题，于是“我的 Rust 到底有多扎实？”就不再只是一种感觉。没有任何需要购买的东西。
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
            <a href="/learn/should-you-still-learn-to-code-with-ai" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              AI 时代，还值得学编程吗？ →
            </a>
            <a href="/learn/spaced-repetition-for-developers" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              写给开发者的间隔重复：如何真正记住学过的东西 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
