// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "初级开发者如何用 AI，又不耽误自己的成长";
export const DESCRIPTION =
  "初级开发者只要一直留在验证环节里，就能安全地使用 AI：可以让它解释、让它起草，但要亲自追踪、测试并改写足够多的代码，让衡量进步的单位始终是理解，而不是产出。本文讲述“先接受再说”这种危险的默认做法、六种安全的用法，以及永远不该交出去的技能。";

const SAFE_PATTERNS = [
  {
    n: "01",
    title: "AI 先当讲解员，再当作者",
    body: "把默认顺序反过来：不要一上来就说“把这个函数写出来”，而是问“带我走一遍这个模块是怎么工作的”，或者“这里两种做法的区别是什么？”。讲解会累积成判断力——而判断力正是你头几年最稀缺的资产。真要让它写代码时，让它把所用的推理过程讲出来，并且先读这段讲解，再读代码。",
  },
  {
    n: "02",
    title: "起承重作用的代码，先起草再改写",
    body: "对真正重要的代码（核心逻辑，以及任何你将来得调试的东西），可以让 AI 先出一份草稿——但在合并之前，把其中重要的函数亲手改写一遍。脚手架上的提速你照样拿到，关键逻辑却必须经你亲手敲一遍。它的草稿和你的改写之间的 diff，就是一份精确的、属于你自己的清单，列出你还不知道的东西。",
  },
  {
    n: "03",
    title: "每一处要合并的 diff，都大声讲出来",
    body: "接受任何改动之前，用大白话说出它做了什么、为什么这样做——说给同事、说给一只橡皮鸭，或者写进一条笔记。如果你讲不出来，你就正好找到了该学的东西，而且是在学它代价最低的那一刻。这一个习惯，是初级开发者跟着 AI 成长还是停滞不前之间最大的分岔。",
  },
  {
    n: "04",
    title: "先自己调试，一次只认一个假设",
    body: "先读调用栈，再去粘贴它。自己先形成一个假设并验证它。然后才把 AI 请进来——并且带上你的假设，让对话从你的推理出发，而不是取代它。资深能力真正长成的地方正是调试；别把整座健身房都外包出去。",
  },
  {
    n: "05",
    title: "用 AI 来生成你的练习，而不是取代练习",
    body: "让它就你刚接触的概念出练习（“给我五个针对这个函数的边界情况”），或者就你正在改的模块出测验式的问题。把助手从作者变成教练，练习照样不断，而且仍然是你自己的练习。",
  },
  {
    n: "06",
    title: "记下你总是做错的地方",
    body: "我们见过的成长最快的初级开发者，会追踪自己的缺口——那些一次次出现在测验里、一次次出现在评审里的概念——并把学习时间对准那里。一份持续更新的台账，把“我感觉自己落后了”变成“这三个主题就是我真正要补的清单”，而这是一个好办得多的问题。",
  },
] as const;

const FAQ = [
  {
    q: "初级开发者到底该不该用 AI 编程助手？",
    a: "该用——前提是那个闭环保持完整。开发者职业生涯的头几年，打下的是后面一切的地基：读代码、拆解问题、调试，以及对设计的判断力。当 AI 被用作讲解员、教练和起草搭档时，它能加速这一切；当它被当成一个输出能用代码、而你照单全收的神谕时，它会悄悄取代这一切。实用的规则是：你合并的每一处改动，都把自己留在验证环节里。你能讲清它，就是你在用 AI；你讲不清，就是它在用你。",
  },
  {
    q: "初级开发者怎样用 Copilot 或 Cursor，又不变得依赖它？",
    a: "把用法安排成：理解是强制的，而不是可选的。具体来说：先要解释，再要代码；任何 AI 草稿里起承重作用的部分，都亲手改写；合并之前把每一处 diff 大声讲出来；先自己从调用栈开始调试，再把它粘贴给助手；并且长期回顾自己的正确率——如果有些概念你总是答错，那就是你的学习清单，而不是让你更用力依赖工具的信号。依赖不是使用 AI 造成的；它是把那些原本会逼你自己产出理解的时刻拿掉造成的。",
  },
  {
    q: "哪些技能，初级开发者永远不该交给 AI？",
    a: "阅读和在真实代码库里导航；从调用栈出发调试并形成自己的假设；在任何代码写出来之前，把一个含糊的需求拆解成一份设计；代码评审（评审别人的，以及回应别人对你工作的评审——PR 描述要自己写）；还有任何一门你仍在学习的语言或框架里的东西。这些恰恰是以后最难补回来的技能，而且它们有一个共同点：都是先慢慢做、再快起来的过程中练成的。",
  },
  {
    q: "经理或资深开发者能看出来我只是在照单全收 AI 的代码吗？",
    a: "通常很快就能看出来——而且不靠任何监控，只靠谈话。“只接受”的工作方式会留下一种很有辨识度的模式：交付的速度远远跑在开发者讲清它的能力前面。在站会、代码评审或一次事故里，“这里你为什么要这样做？”大约三十秒就能把理解和吞吐区分开。解决办法不是把 AI 用得更隐蔽；而是确保理解是真实的，而上面这些习惯会把这件事作为副作用顺带做到。",
  },
  {
    q: "Covate 怎样帮初级开发者用好 AI？",
    a: "Covate 把“确保我理解自己的改动”从一项自律变成一套机制。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——在你作答之前暂停后续生成。每一次会话都会同步到 covate.org 上的学习台账（用 GitHub 登录；免费，没有任何需要购买的东西），展示每一次会话、你的累计正确率，以及你答得最差的主题——而这正是那份“我总是做错什么”的清单，用来指引初级开发者有限的学习时间。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          初级开发者如何用 AI，又不耽误自己的成长
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          初级开发者只要把自己留在验证环节里，就能安全地使用 AI：可以让它解释、让它起草，但要亲自追踪、测试并改写足够多的代码，让衡量进步的单位始终是理解，而不是产出。本文讲述危险的做法、安全的做法，以及永远不该交出去的技能。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            初级阶段是打地基的时候：阅读真实的代码库、拆解问题、调试、形成品味。AI 助手对这一切既可以是增压器，也可以是替代品，取决于一个结构性的选择：在你的工作流程里，理解是<em>强制的</em>，还是变成了可选的。资深开发者把样板代码交出去，省下的时间花在架构上；初级开发者默认做同样的事，跳过的却是唯一能把职业生涯练出来的那些重复练习。差别不在自律或天赋——而在工作流程的设计，而这是可以搭建出来的。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">危险的默认做法——以及它为什么看不见</h2>
          <p className="mt-4">
            危险的模式是<strong>“先接受再说”的开发方式</strong>：写提示词、收到结果、粘贴、测试变绿、合并。它感觉像是在产出，评审能过，工单能关——而周围的流程里没有任何东西逼你理解交付出去的是什么。代价来得更晚，而且付出的恰恰是初级开发者本该积累的东西：你调试不了它，不能有把握地扩展它，在站会上答不出“为什么这样做？”，而这个缺口只有在上下文已经不在的时候才会露出来。我们在
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              《用 AI 会让你变成更差的程序员吗？》
            </a>
            一文里拆解了这个机制——简短的结论是：被动使用会让技能退化，而产出看起来一切正常。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">让初级开发者跟着 AI 继续成长的六种做法</h2>
          <ol className="mt-6 space-y-5">
            {SAFE_PATTERNS.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">典型的一周</h2>
          <p className="mt-4">
            周一：新工单。在向任何东西写提示词之前，你先自己写出三步拆解，然后让助手来批评这份计划——而不是写代码。周二：实现。样板代码（配置、脚手架、导入）交给它；核心函数按你的计划亲手写。周三：AI 起草了一个你觉得难懂的模块；你亲手改写它的关键部分，并记下缺口。周四：一个 bug。你读调用栈，形成一个假设，验证它，然后带着你的发现把助手请进来。周五：花十分钟回顾这一周的薄弱点——那些在评审或测验里出现过的主题——这份清单就定下了下周要学的东西。这些没有哪一项慢到真正要紧的程度；它们全部让理解留在你这边。让评审真正落到实处的具体做法，见
            <a href="/learn/how-to-review-ai-generated-code" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              《合并之前，如何评审 AI 生成的代码》
            </a>
            。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 把“理解检查”变成自动的</h2>
          <p className="mt-4 text-secondary">
            Covate 正是为这个分岔口而做的。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——在你作答之前暂停后续生成——于是“合并前先讲清楚”这一步，不会在忙碌的一天里被跳过。会话会同步到 covate.org 上免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            ：用 GitHub 登录，就能看到每一次同步过来的会话、你的累计正确率，以及你答得最差的主题——你真正要补的清单。没有任何需要购买的东西。
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
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
