// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "AI 时代，还值得学编程吗？";
export const DESCRIPTION =
  "既然 AI 能写代码，学编程还值得吗？坦白的答案是：值得——但需要学的东西正在变化。本文说明为什么理解比以往任何时候都更重要，以及应该把精力放在哪里。";

const FAQ = [
  {
    q: "既然 AI 能写代码，学编程还值得吗？",
    a: "值得——但理由值得说精确一点。AI 能生成代码，但它不能为代码负责，不能针对你这个具体的系统做推理，不能决定该构建什么，也不能判断输出到底是否正确、是否安全。这些工作仍然属于一个懂编程的人。把 AI 想成一个非常快、非常自信的初级开发者：什么都读过，却什么具体的东西都不理解——如果你能指挥它、检查它的工作，它就极其有用；如果你做不到，它就很危险。在 AI 身边活得最好的人，不是那些不再学编程的人，而是那些理解得足够多、能驾驭它、抓住它的错误、并做出它做不了的决策的人。所以“我还该学编程吗？”的答案是明确的：该。变化的是侧重点——少一点死记硬背语法，多一点对系统、取舍、调试和判断力的理解。",
  },
  {
    q: "AI 不会直接取代程序员吗？",
    a: "它取代的是一部分工作，而不是程序员——至少不是那些会适应的程序员。历史在这里惊人地相似：编译器自动化了机器码，并没有消灭程序员；高级语言藏起了内存管理，也没有消灭他们；Stack Overflow 让答案可以搜索，同样没有。每一次都抬高了抽象层次，让单个开发者的产出高得多，结果是增加了而不是减少了对软件的需求。AI 是这架梯子上的下一阶。它改变的是哪些技能重要：亲手敲样板代码变得不那么值钱，而理解该构建什么、把各个部分整合成一个能用的系统、评审和调试，以及做出架构和安全方面的判断，变得更值钱。只会敲出那些 AI 现在就能生成的代码的开发者，处境很危险；理解系统、能指挥并验证 AI 的开发者，处境比以往任何时候都更强。",
  },
  {
    q: "如果不去背语法，我该把学习重点放在哪里？",
    a: "把重点放在那些让你能够指挥和检查 AI 的事情上，因为那才是持久的技能。大致按优先级排列：（1）基础——程序到底是怎么运作的、数据结构、控制流、各个部分如何拼在一起，这样 AI 产出的任何东西对你都不是黑盒；（2）读代码和评审代码——你会花更多时间评估生成的代码，而不是写代码，所以读懂一个 diff、发现 bug、判断它是否合适的能力是核心；（3）调试和从第一性原理出发推理——当 AI 卡住或出错时（它一定会），救你的就是这个；（4）系统思维——组件之间如何连接、故障模式和安全风险藏在哪里、该构建什么以及为什么；（5）判断力和品味——知道“好”长什么样。语法你可以查（AI 也能提供）；理解你无法外包。目标不是在敲代码这件事上和 AI 竞争，而是成为那个把代码理解得足够透、能为它负责的人。",
  },
  {
    q: "用着 AI 的同时，我到底怎样才能把编程学扎实——而不让它替我学？",
    a: "这才是真正的风险：如果你让 AI 提供每一个答案，你得到的是没有理解的代码，你的技能也永远发展不起来。解决办法是始终做主动的参与者。把 AI 当成导师，而不是自动售货机——读它写的东西，问它为什么，在运行之前先预测它的代码会做什么，并先试着自己解决问题。最重要的是，趁上下文还新鲜就去接触每一段生成的代码：用自己的话把它复述一遍，就其中的概念和边界情况考自己，并把你总是答错的那些再复习一遍。这种有意识的、主动的投入，正是把“这是 AI 写的”变成“我理解它”的东西。而这恰恰是 Covate 被设计来自动完成的事——它是一个免费、开源的 MCP 工具，观察你真实的代码改动并就这些改动向你提问，让你在构建的同时学习；再加上一份用 GitHub 登录的免费学习台账，保存每一次同步过来的会话、你的正确率，以及你答得最差的主题。在 AI 时代学编程，不是躲开 AI，而是用一种让你变得更好、而不只是更快的方式去使用它。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">坦白的回答</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          AI 时代，还值得学编程吗？
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          既然 AI 能写代码，学编程还值得吗？简短的回答：<strong className="text-primary">值得</strong>——但你需要学的<em>东西</em>正在变化。AI 抬高了抽象层次；它并没有取消对这样一个人的需要：理解这个系统、抓住其中的错误、并决定该构建什么。下面说明为什么理解比以往任何时候都更重要，以及应该把精力放在哪里。
        </p>
        <ArticleByline updated="2026-08-04" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">AI 是一个非常快、非常自信的初级开发者</h2>
          <p className="mt-4">
            理解今天的 AI 编程助手，最有用的方式是把它看成一个不知疲倦的初级开发者：什么都读过，却什么具体的东西都不理解。它几乎能立刻为任何事情产出看起来像那么回事的代码——而且无论对错，它都会带着十足的自信去做。这让它变得极其强大，<em>前提是</em>你能指挥它、检查它的工作；如果你做不到，它就真的很危险。瓶颈已经不再是生成代码了，而是知道该问什么、答案对不对、以及不对的时候怎么修。而这些，恰恰是你必须懂编程才能做到的事。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">这种事以前发生过</h2>
          <p className="mt-4">
            编程的每一次大跃升都抬高了抽象层次、让开发者的产出更高——而每一次，末日预言都错了。编译器自动化了机器码；高级语言藏起了内存管理；互联网让每一个答案都可以搜索。它们没有一个取代了程序员；它们抬高了天花板，并增加了对软件的需求。AI 是这架梯子上的下一阶。它改变的是哪些<strong>技能组合</strong>重要：敲出样板代码变得廉价，而决定该构建什么、把它整合进一个能用的系统、评审和调试，以及做出架构和安全方面的判断，变成了值钱的部分——也就是属于人的部分。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">学习该把重点放在哪里</h2>
          <p className="mt-4">
            持久的技能，是能够<em>指挥并验证</em>一个 AI。大致按优先级排列：
          </p>
          <ol className="mt-5 space-y-3">
            {[
              "基础——程序到底是怎么运作的，这样 AI 产出的任何东西对你都不是黑盒。",
              "读代码与评审代码——你会评估生成的代码多过亲手写它；发现 bug、判断它是否合适是核心能力。",
              "从第一性原理出发调试——当 AI 卡住或出错时（它一定会），救你的就是这个。",
              "系统思维——组件之间如何连接、故障模式和安全风险藏在哪里、该构建什么以及为什么。",
              "判断力和品味——知道“好”长什么样。语法你可以查；理解你无法外包。",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-sm leading-7 text-secondary">{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6">
            注意这条主线：这些没有一条是关于在敲代码这件事上和 AI 竞争的。它们是关于成为这样的人——把代码理解得足够透，能为它<strong>负责</strong>。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 和 AI 一起学，而不让它替你学</h2>
          <p className="mt-4 text-secondary">
            用 AI 学编程的真正风险，是让它提供每一个答案，于是你得到的是没有理解的代码。Covate 让你始终是那个主动的学习者。它是一个免费、开源的 MCP 工具，接入你的 AI 助手（Claude、Cursor、Copilot 等），观察你真实的代码改动，并就这些改动向你提问——让你趁上下文还新鲜就理解每一处改动，而不是直接接受。免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              Covate 学习台账
            </a>
            接手后续：用 GitHub 登录，每一次同步过来的会话、你的累计正确率，以及你总是答错的主题都可以随时回顾。没有任何需要购买的东西。
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
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
            </a>
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              用 AI 会让你变成更差的程序员吗？一次坦诚的审视 →
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
