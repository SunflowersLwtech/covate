// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "如何真正从 AI 生成的代码中学到东西（而不让技能退化）";
export const DESCRIPTION =
  "如今你的大部分代码都由 AI 来写——那怎样才能继续学习，而不是让技能悄悄流失？这是一份实用指南：如何读懂 AI 生成的代码，避免氛围编程带来的技能退化，并用主动回忆把每一个 diff 变成长期掌握的知识。";

const FAQ = [
  {
    q: "为什么从 AI 替我写的代码里学东西这么难？",
    a: "因为你跳过了真正发生学习的那一步。自己写代码时，你不得不做几百个小决定——用哪个 API、用哪种数据结构、边界情况怎么处理——每个决定都会留下一道记忆痕迹。而 AI 来写时，你读到的是一个现成的、看上去像模像样的方案，然后就继续往下走了。阅读是被动的；对于一个你只是接受下来的方案，和一个你必须亲手搭出来的方案，大脑的处理方式截然不同。结果就是：你可以交付一个功能，一周之后却既讲不清它、也改不动它——代码存在于你的仓库里，却从没进到你的脑子里。",
  },
  {
    q: "什么是“氛围编程”带来的技能退化？",
    a: "“氛围编程”是一种越来越常见的工作方式：用自然语言描述你想要什么，AI 生成什么就接受什么，靠感觉而不是靠理解来迭代。它很快，也常常管用——但如果你只这么做，你自己推理代码、记住 API、从第一性原理出发调试的能力，就会因为长期不用而悄悄萎缩，和任何闲置的技能一样。技能退化之所以危险，恰恰在于它看不见：只要 AI 还在手边、遇到的都是常规问题，一切都感觉很好；只有当你碰到 AI 解决不了的问题、需要带着批判的眼光评审代码，或者去面试时，差距才会暴露出来。解决办法不是停用 AI，而是在它写的代码里始终做一个主动的参与者。",
  },
  {
    q: "从生成的代码中学习，最有效的一个办法是什么？",
    a: "主动回忆，而且要立刻做。关于人如何学习的研究结论很一致：从记忆里把东西提取出来，比重读一遍记得牢得多；而效果最好的，是在初次接触后不久、上下文还新鲜的时候就接受测试。放到 AI 编程上，意思就是：AI 刚生成一处改动，在你继续往下之前，先就它测验一下自己。把 diff 遮住，试着解释每一部分做了什么、为什么这么做；预测改掉某一行会坏掉什么；说出它用了哪个 API 或模式，再说出一种替代方案。把被动阅读变成主动提取，就是“从你身边流过的代码”和“真正留在你脑子里的代码”之间的区别。",
  },
  {
    q: "怎样做到这一点，又不至于把自己拖慢太多？",
    a: "让它保持小而频繁，并且和你本来就在交付的代码绑在一起——而不是另开一段你永远抽不出时间的学习时段。一个不错的节奏是：每次有意义的改动之后做一次 60 秒的检查，就刚进入代码库的概念问自己两三个问题。目的不是从头把一切重新推导一遍，而是趁上下文还新鲜，确认这些想法真的落了地——马上做代价很小，拖到以后代价就很大。一周下来，这每天只多花几分钟，却会日积月累成对你自己代码库的真正理解——第一次需要调试或扩展它时，这份投入就回本了。",
  },
  {
    q: "Covate 在这方面能帮上什么？",
    a: "Covate 自动化的正是这个循环。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并根据你真实的 diff 生成简短、有针对性的测验——在你作答之前暂停后续生成，让你趁上下文还新鲜就学进去，而不是直接往下走。每次会话都会保存下来，同步客户端会把它们推送到你在 covate.org 上的学习台账——免费，无需付款——在那里你可以回顾过去的每一次会话、你的累计正确率，以及你总是答错的主题。换句话说：它把“就 diff 测验自己”这个习惯，从一件你得记着去做的事，变成了写代码时自然而然就会发生的事。",
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "读 diff 是为了讲清它，不是为了批准它",
    body: "在接受一处生成的改动之前，先把解释遮住，只读代码。你能不能大声说出每一部分做了什么，以及 AI 为什么选了这种做法、而不是那个显而易见的替代方案？如果说不出来，那正是你要补上的缺口——你找到了一样自己差点在不理解的情况下就交付出去的东西。",
  },
  {
    n: "02",
    title: "趁上下文还新鲜，立刻测验自己",
    body: "改动一落地就做——不是稍后，也不是“等有空的时候”——凭记忆把它提取出来。说出用到的 API 或模式，再说出一种替代方案。预测改掉某一行具体的代码会坏掉什么。第一分钟里的主动回忆，比下周花一小时重读更有价值。",
  },
  {
    n: "03",
    title: "记下总是答错的地方，回头再复习",
    body: "在同一个地方栽了两次跟头的概念，才是你真正的薄弱点。把它们记下来，让间隔重复在几天后把它们重新带到你面前。几周下来，一堆你接受过的 diff 会变成一张地图，标出你真正掌握了什么——还有一份越来越短的清单，列着你还不会的东西。",
  },
];

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">学习难题</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          如何真正从 AI 生成的代码中学到东西
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          如今你的大部分代码都由 AI 来写。这让你更快——但如果你只是一味接受它生成的东西，你自己的理解就会悄悄流失。本文讲讲怎样在构建的同时继续学习：为什么生成的代码记不住，“氛围编程”（vibe coding）带来的技能退化到底是什么，以及那个能把每一处改动变成长期知识的习惯——对你自己的 diff 做主动回忆。
        </p>
        <ArticleByline updated="2026-08-04" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        {/* Answer-first summary: the first passage under the first question-shaped heading
            is the whole answer, not a lead-in to one. */}
        <section className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-primary">怎样才算真正读懂 AI 生成的代码？</h2>
          <p className="mt-3 text-sm leading-7 text-secondary">先读 diff，再看解释；然后把它关掉，大声说出每一部分做了什么，以及为什么用这种做法、而不是那个显而易见的替代方案。凡是说不出来的，去查这门语言的官方文档，而不是再问一遍 AI。接着改掉一行，预测会坏掉什么——如果预测错了，说明你只是认得它，并没有理解它。</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">为什么生成的代码记不住</h2>
          <p className="mt-4">
            自己写代码时，你要做几百个微小的决定——用哪个 API、用哪种数据结构、边界情况怎么处理——每一个都会留下一道记忆痕迹。而 AI 来写时，你读到的是一个现成的、看上去像模像样的方案，然后就继续往下走了。阅读是被动的；对于一个你只是批准过的方案，和一个你必须亲手搭出来的方案，大脑的处理方式截然不同。这就是为什么你可以周一交付一个功能，到周五却已经讲不清它、也没法放心地修改它：代码在你的仓库里，却从没进到你的脑子里。
          </p>
          <p className="mt-4">
            这些都不是反对 AI 的理由。用得好，助手是编程有史以来最好的学习加速器——它能随时解释、比较不同的做法、回答“为什么”。问题只出在默认的工作流程上：生成、扫一眼、接受、重复。这个循环为交付而优化，却跳过了真正发生学习的那一步。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">“氛围编程”带来的技能退化是真实的——而且看不见</h2>
          <p className="mt-4">
            “氛围编程”——描述你想要什么，接受 AI 产出的东西，靠感觉而不是靠理解来迭代——很快，也常常管用。但如果你<em>只</em>这么做，那些你不再使用的技能就会开始消退：推理代码、记住 API、从第一性原理出发调试。技能退化之所以危险，恰恰在于它看不见。只要 AI 还在手边、遇到的都是常规问题，一切都感觉很好；只有当你碰到模型解决不了的问题、需要带着批判的眼光评审代码，或者要向别人讲清你自己的系统时，差距才会暴露出来。目标不是把代码写慢，而是在 AI 写的代码里始终做一个主动的参与者。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">解决办法：对你自己的 diff 做主动回忆</h2>
          <p className="mt-4">
            几十年的学习研究指向一个稳健的结论：比起重读，从记忆里<em>提取</em>东西能让你记得牢得多——而效果最好的，是在初次接触后不久、上下文还新鲜的时候就接受测试。这就是<strong>测试效应</strong>，放到 AI 辅助编程上再合适不过。一处改动刚生成的那一刻，正是它的上下文在你脑中最丰富的时候，也是把它牢牢记住代价最小的时候。所以，别接受完就走，而是对这个 diff 跑一个小小的主动回忆循环：
          </p>
          <ol className="mt-6 space-y-5">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-accent">{s.n}</span>
                  <h3 className="text-lg font-medium text-primary">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-7 text-secondary">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6">
            马上做的话，每次有意义的改动大约只花一分钟，日积月累就会变成对你自己代码库的真正理解——第一次需要调试或扩展它时，这份投入就回本了。拖到以后，它就永远不会发生。全部诀窍在于：让这个检查自动发生，并且和你本来就在交付的代码绑在一起。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 让这个循环自动发生</h2>
          <p className="mt-4 text-secondary">
            Covate 是一个免费、开源的 MCP 工具，它把这个习惯从一件你得记着去做的事，变成写代码时自然而然就会发生的事。它接入你的 AI 助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并根据你真实的 diff 生成简短、有针对性的测验——在你作答之前暂停后续生成，让你趁上下文还新鲜就学进去。每次会话都会保存在本地。免费的
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
        <Evidence
          sources={[
            {
              href: "https://docs.python.org/3/tutorial/index.html",
              label: "Python — The Python Tutorial (official documentation)",
              note: "去这门语言自己的参考文档里查这个写法，而不是去问刚刚用了它的那个助手。",
            },
            {
              href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
              label: "MDN Web Docs — JavaScript reference",
              note: "JavaScript 和 Web 平台对应的一手参考文档。",
            },
          ]}
        />

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
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              用 AI 会让你变成更差的程序员吗？一次坦诚的审视 →
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
