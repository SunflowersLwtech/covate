// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "写代码时如何避免过度依赖 AI";
export const DESCRIPTION =
  "你在用 AI 编程助手，也喜欢它们——这篇文章不是劝你戒掉。真正的风险不在于使用 AI，而在于被动地用：接受你并不理解的输出。本文列出过度依赖的信号、它为什么重要，以及一份具体的习惯清单，让你在继续用 AI 交付的同时保持自己的优势。";

const HABITS = [
  {
    n: "01",
    title: "接受之前先读——包括真正的 diff",
    body: "这一条习惯，就足以把主动使用和被动使用分开。在你点“Accept All”（全部接受）之前，读一读模型实际写了什么，而不只是它自己对改动的概述。扫一眼真实的 diff，确认里面既有你要求的改动，也留意你没要求的——被改名的变量、被换掉的库、悄悄发生的重构。小改动只需要几秒钟，而这几秒正是你留在闭环里、而不是变成橡皮图章的时刻。",
  },
  {
    n: "02",
    title: "用自己的话把每一处改动讲一遍",
    body: "这是“我能把它教给别人吗？”测试。一处改动落地后，大声说出来，或者在心里说一遍：它做了什么，以及为什么用这种做法而不是那个显而易见的替代方案。如果说不出来，你就还没理解它——你只是看着它发生了。这件事又便宜又快，也是最可靠的信号，证明一处改动真的进了你的脑子，而不只是进了代码库。",
  },
  {
    n: "03",
    title: "不只问“是什么”，还要问“为什么”——把 AI 当导师用",
    body: "同一个工具既能把答案递给你，也能教你答案背后的推理，前提是你让它这么做。当 AI 产出了你没完全看懂的东西，别急着往下走——问它为什么选这个、取舍是什么、什么情况下会坏、还有哪些替代方案。这一问，就把一个被动接收的答案变成了一堂主动的课，让你积累的是理解，而不只是代码。",
  },
  {
    n: "04",
    title: "偶尔亲手写一段",
    body: "挑一件小事，完全靠自己写——不开自动补全，也不写提示词。碰到 bug 卡住时，先给自己十到十五分钟自己推一遍，再把它贴进 AI。这不是怀旧；这就像音乐家仍然要练音阶。不用的那块肌肉，正是会悄悄变弱的那块。",
  },
  {
    n: "05",
    title: "让基本功保持热度",
    body: "判断力建立在你知道“好”长什么样之上——架构、数据流、复杂度、安全，以及什么东西容易坏。一旦 AI 接手了日常工作，这些不会自己保持敏锐。读一些不是你生成的代码，时不时从第一性原理出发调试一次，并继续学习抽象层下面的东西。基本功恰恰是让你在 AI 自信地出错时能抓住它的东西。",
  },
  {
    n: "06",
    title: "用主动回忆把闭环补上",
    body: "当时理解了，不等于记住了。回到你交付过的东西，考考自己：那处改动做了什么，为什么，换我会怎么做？主动回忆——把知识取出来，而不是重新读一遍——才能把一次“我懂了”变成你真正留得住的知识。没有它，即便是你当时理解过的代码，也会因为不用而淡掉。",
  },
] as const;

const FAQ = [
  {
    q: "我是不是太依赖 AI 写代码了？有哪些信号？",
    a: "下面是几条诚实的信号，不必全部对上号才需要在意。上周你“写”的代码，现在讲不清楚它做了什么——你得重新读一遍才知道。助手挂了、被限流了，或者你离线的时候，你会一阵恐慌，好像没了它就没法干活。你调试时是反射性地去找 AI，把整段东西贴进去，而不是先形成一个假设。你已经很久没有不靠帮助写出任何非平凡的东西了。你的基本功感觉生锈了——回忆一个 API、推理复杂度、或者追踪一个 bug，都比从前明显更费劲。这些都不意味着你应该停止使用 AI；它们意味着你已经滑向被动使用，值得有意识地把主动使用的习惯重新建起来。让人安心的是，这是可逆的：技能会随着使用回来，而修复办法是几个小习惯，不是戒断。",
  },
  {
    q: "依赖 AI 写代码是坏事吗？",
    a: "依赖 AI 不是坏事——被动地依赖才是。倚靠一个让你更快的工具没有错；好工具本来就是干这个的，而 AI 助手确实很出色，也显然会留下来。问题不在依赖本身，而在方式：一遍又一遍地接受你并不理解的输出，直到理解这件事彻底不再发生。代价是实实在在的，分两层。短期来看，你拥有并交付了自己无法推理的代码，调试起来困难，改坏也容易。长期来看是技能退化——“不用就会丢”的效应，那些让你成为开发者的能力因为长期不用而变弱，而且是静悄悄的，因为在你碰到 AI 解决不了的问题之前，什么都感觉不到不对。所以诚实的说法不是“AI 好”或“AI 坏”，而是：主动地用 AI（阅读、追问、理解）让你保持敏锐，被动地用（不理解就接受）才会侵蚀你。同一个工具，相反的结果，差别完全在于你怎么用。",
  },
  {
    q: "怎样用 AI 而不丢掉自己的编程技能？",
    a: "把闭环补上，而不是跳过它——你可以走得快，同时保持敏锐，这两者并不冲突。核心习惯是绝不接受你不理解的代码：接受之前先读真正的 diff，并且能用自己的话把每一处改动讲一遍（讲不出来，就说明它还不是你的）。把 AI 当导师用，而不只是当答题机器——问它为什么选这个、取舍是什么、什么情况下会坏——这一问就把一个被动接收的答案变成了一堂主动的课。偶尔亲手写一段，让肌肉保持活力；碰到 bug 先给自己几分钟自己推一遍，再贴进去。让基本功保持热度，因为正是它让你在 AI 自信地出错时能抓住它。再用主动回忆把闭环补上——回头看看你交付过的东西，考考自己，让当时的理解变成留得住的知识。这些都不意味着少用 AI；它们意味着在用的时候保持脑子开着。这就是“AI 放大你的能力”和“AI 悄悄取代你”之间的全部差别。",
  },
  {
    q: "Covate 怎样帮我在用 AI 时保持敏锐？",
    a: "Covate 把这份清单上最重要的那条习惯自动化了——在继续往下之前先理解每一处改动——于是它默认就会发生，而不是只在你记得的时候发生。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验，考你这次改动涉及的概念、API、边界情况和取舍，在你作答之前暂停后续生成。换句话说，它在最要紧的那个时刻强制你进入本文所说的主动模式：代码刚生成、上下文还新鲜的时候，让你没法悄悄滑进“不理解就接受”。每次会话都会保存下来，同步客户端会把它们推送到你在 covate.org 上的学习台账——免费，无需付款——在那里你可以回顾过去的每一次会话、你的累计正确率，以及你总是答错的主题——这正是主动回忆的习惯，替你办好了。结果是，使用 AI 变成了一种保持敏锐、继续进步的方式，而不是慢慢滑向依赖。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          写代码时如何避免过度依赖 AI
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          你在用 AI 编程助手，你喜欢它们，也不打算放弃——很好，这篇文章也不是在劝你放弃。藏在“我是不是太依赖它了？”这个问题底下的担忧是真实的，但问题从来不是<em>使用</em> AI，而是<em>被动地</em>使用它——接受你并不理解的输出，直到理解这件事彻底不再发生。本文讲怎样识别这种漂移、它为什么重要，以及一套具体的习惯，让你在继续用 AI 交付的同时保持自己的优势。
        </p>
        <ArticleByline updated="2026-08-05" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            先说一件大多数这类文章不会先说的事：AI 编程助手确实很出色，也不会消失。它们让你更快，替你去掉了大量苦差事，而熟练使用它们现在已经是这份工作的一部分。所以这不是一篇“把工具放下”的文章。目标恰恰相反——帮你继续大量使用它们，<em>同时</em>保持自己的优势。而一旦你看清人们害怕的那种侵蚀到底是什么造成的，就会发现这完全做得到。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">真正的问题不是用 AI，而是被动地用</h2>
          <p className="mt-4">
            使用 AI 助手有两种方式，通向相反的地方。<strong>主动使用</strong>是读它产出了什么、追问它、在继续往下之前理解每一处改动——工具放大的是你。<strong>被动使用</strong>是一遍又一遍地接受你并不理解的输出，直到理解这件事彻底不再发生——工具慢慢取代的是你。同一个助手，同样的速度；唯一的差别在于你开车的时候脑子开没开着。
          </p>
          <p className="mt-4">
            被动使用之所以危险，恰恰因为它很舒服。背后有两个被充分理解的效应在起作用。一个是<strong>自动化自满</strong>：当一个工具大多数时候都是对的，信任就会悄悄取代警惕，你不再检查。另一个是<strong>技能退化</strong>——朴素的“不用就会丢”效应，能力因为不用而下降。两者发生的时候，你都感觉不到任何不对。这正是陷阱所在：过度依赖不会自我宣告。你只是某一天忽然发现，一个 AI 解决不了的问题，现在做起来比它本该有的难度吃力得多。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">你可能过度依赖 AI 的信号</h2>
          <p className="mt-4">这些都不是判决，也不必全部对上号才需要在意。把它们当作发动机故障灯来读，而不是诊断书：</p>
          <ul className="mt-5 space-y-3">
            <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
              <strong className="text-primary">你讲不清楚自己最近写的代码。</strong>上周你“写”的某个东西，得重新读一遍才理解得了——你监督了它，但没有吸收它。
            </li>
            <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
              <strong className="text-primary">AI 不可用时你会恐慌。</strong>一次限流、一次故障，或者离线工作，感觉不像是不便，更像是你根本没法干活。
            </li>
            <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
              <strong className="text-primary">不把报错贴进去，你就不会调试。</strong>遇到任何错误，你的第一反应是把整段东西交给 AI，而不是先对哪里出了问题形成一个假设。
            </li>
            <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
              <strong className="text-primary">你已经很久没有不靠帮助写出任何非平凡的东西了。</strong>距离你上一次在没有自动补全、也没有提示词介入的情况下做出一件有分量的东西，已经过去很久了。
            </li>
            <li className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-7 text-secondary">
              <strong className="text-primary">你的基本功感觉生锈了。</strong>凭记忆回忆一个 API、推理复杂度，或者追踪一个 bug，都比从前明显更费劲。
            </li>
          </ul>
          <p className="mt-5">
            如果其中几条击中了你，别慌——这是可逆的。技能会随着使用回来，而修复办法是几个小习惯，不是戒断。（至于底下那个“AI 真的会让你变差吗？”的问题，我们在
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              用 AI 会让你变成更差的程序员吗？一次坦诚的审视
            </a>
            里把正反两面都完整论证过——本文是它那个追问的实用回答：好，那我到底该怎么避免？）
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">为什么保持敏锐仍然重要</h2>
          <p className="mt-4">
            值得把利害看清楚，因为“继续学习”听起来像道德说教，其实只是你自己的利益。第一，<strong>代码是你的。</strong>它一合并，维护它的就是你，凌晨两点它在生产环境里坏掉时调试它的也是你——而你从没理解过的东西，你调试不了。第二，<strong>技能退化是无声的。</strong>没有任何东西会警告你它正在发生；差距只有在你碰到 AI 解决不了的问题时才会浮出来，而那恰恰是你最需要敏锐的时刻。第三——真正决定你职业生涯的那一条——<strong>当人人都有同一个 AI 时，让你有价值的是判断力。</strong>如果代码是模型写的，你的价值就在于知道这段代码到底好不好：抓住那个自信的错误，选对做法，看见没人在提示词里提到的边界情况。这种判断力建立在理解之上，而理解恰恰是被动使用所侵蚀的东西。保持敏锐不是怀旧；它是在保护你身上那个工具替代不了的部分。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">怎样在继续用 AI 的同时保持敏锐</h2>
          <p className="mt-4">
            好消息是：要保持敏锐，你不必少用 AI——你要做的是在用它的时候保持<em>投入</em>。速度和技能并不冲突；敌人是被动，不是工具。下面这六条习惯让你留在主动模式里，同时又几乎不拖慢你。
          </p>
          <ol className="mt-6 space-y-5">
            {HABITS.map((h) => (
              <li key={h.n} className="rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-accent">{h.n}</span>
                  <h3 className="text-lg font-medium text-primary">{h.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-7 text-secondary">{h.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6">
            注意那条共同的主线：每一条习惯，都是在代码进入你的代码库的那一刻让脑子保持开着的一种方式，而不是把它关掉。你可以全部采纳，也可以只从第一条开始——接受之前先读——轨迹照样会改变。重点不是为了自律而自律；而是现在这一分钟真正的注意力，决定了你是开车的那个人，还是被载着走的那个人。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate，让保持敏锐成为默认</h2>
          <p className="mt-4 text-secondary">
            这些习惯最难的地方，是你走得快的时候还记得去做。Covate 把最重要的那一条自动化了——在继续往下之前先理解每一处改动——于是它默认就会发生。它是一个免费、开源的 MCP 工具，接入你的 AI 助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验，考你其中的概念、边界情况和取舍——在你作答之前暂停后续生成，让你没法悄悄滑进“不理解就接受”。每次会话都会保存下来；免费的
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
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              用 AI 会让你变成更差的程序员吗？一次坦诚的审视 →
            </a>
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
            </a>
            <a href="/learn/what-is-vibe-coding" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              什么是氛围编程（vibe coding）？含义、来历与适用场景 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
