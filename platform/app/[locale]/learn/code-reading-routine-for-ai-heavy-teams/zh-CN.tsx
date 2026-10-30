// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "重度使用 AI 的团队：一套固定的读代码流程";
export const DESCRIPTION =
  "当合并进来的代码大部分由 AI 生成时，读代码就必须从偶尔为之变成定期安排：每周一次改动面评审、以 diff 为先的站会，以及一份共享的薄弱点清单。这是一套任何团队每周花大约一小时就能执行的具体流程。";

const ROUTINE = [
  {
    n: "01",
    title: "每周：读改动面，而不是读全部",
    body: "每周一次，团队把这一周合并进来的所有东西读一遍——按 diff 读，而不是按文件读。AI 辅助工作的基本单位是改动，在一个健康的团队里，一周的 diff 用 30–45 分钟就能读完。每个人挑出一处自己解释不了的改动，带到评审会上。这份清单就是团队真实的理解债务，按真正让大家困惑的程度排好了序。",
  },
  {
    n: "02",
    title: "站会，以 diff 为先",
    body: "把“你在做什么”换成“昨天改了什么、为什么改”。每人三十秒，开着 diff 讲。这是成本最低的同步方式：团队能趁新鲜听到生成代码背后的思路，而“我合并了一个自己解释不了的东西”会立刻浮出水面，而不是六个月后在一次事故里才暴露。",
  },
  {
    n: "03",
    title: "轮流担任讲解人",
    body: "每一处重要的改动，都由一个人——不是作者——用两分钟向团队讲清楚：它做了什么、为什么用这种做法、边界情况有哪些。轮换很重要：最想跳过这一步的人，恰恰是受益最大的人。如果没人能讲清某处改动，这本身就是一个发现，要记到薄弱点清单上。",
  },
  {
    n: "04",
    title: "维护一份共享的薄弱点清单",
    body: "用一份文档，追踪团队总是弄错的概念、模块和模式——最初的条目来自评审意见、测验结果，以及站会上没人答得上来的问题。它把“我们应该把支付模块弄得更明白一点”这种模糊的感觉，换成一个排好序、团队能真正逐项处理的队列。",
  },
  {
    n: "05",
    title: "每季度：从头到尾读一个核心模块",
    body: "挑一个你最不想在生产环境里调试的模块，安排一次集体阅读，从头读到尾，期间不打开电脑写东西。很老派，但管用。目标不是把它背下来——而是把真实的执行路径亲自走过一遍，这样以后那块区域的 diff 就有了可以挂靠的地方。",
  },
] as const;

const FAQ = [
  {
    q: "重度使用 AI 的团队，为什么需要一套读代码的固定流程？",
    a: "因为没有它，自然而然的平衡状态就是没人读。当代码来得很快、而且大体能用时，评审的压力就会下降，每个人只理解自己负责的那几块，团队对系统的共同心智模型就会悄悄退化。这套流程的存在，是为了让团队的集体理解和代码库以同样的速度增长——读代码是唯一能做到这一点的机制，而把它排进日程，才能让它在赶工期的那几周里活下来。",
  },
  {
    q: "这套流程实际要花多少时间？",
    a: "每人每周大约一小时：30–45 分钟读这一周的 diff，站会上每人多花几秒钟，再加上轮流担任的两分钟讲解人。每季度的模块阅读，全队一起花一小时。相比之下，一段没人理解的代码引发一次事故，团队常常就要搭进去好几个小时——在这笔交易里，这套流程是更便宜的那一边。",
  },
  {
    q: "这和普通的代码评审有什么区别？",
    a: "评审问的是“这能合并吗？”——它是一道关卡，聚焦于这一次改动，通常在时间压力下进行，答案一旦是“能”，它就结束了。读代码的固定流程问的是“我们理解自己现在接手的这些东西吗？”——它是一种日常实践，聚焦于团队，没有关卡要过。重度使用 AI 的团队两者都需要，但第二种会悄无声息地萎缩，因为合并流程里没有任何东西会强制它发生。",
  },
  {
    q: "有的工程师觉得这是额外负担，怎样让他们认同？",
    a: "先从这套流程产出的东西入手，而不是流程本身：薄弱点清单，以及每周“没人能解释的改动”这类发现，能在两三周之内让维持现状的代价变得一目了然。严格控制时长——每周阅读第一次拖成两小时会议的时候，这套流程就死了——并让团队自己决定先读什么。去读那个人人都怕调试的模块，根本不需要任何强制命令。",
  },
  {
    q: "Covate 怎样支持团队的读代码流程？",
    a: "Covate 把流程里依赖个人自律的那部分自动化了。它的开源 MCP 接入每位开发者的 AI 编程助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把真实的 diff 变成简短、有针对性的测验——在作答之前暂停后续生成——让每位队友都认真对待自己交付的每一处改动。会话会同步到 covate.org 上免费的学习台账（用 GitHub 登录，没有任何需要购买的东西），显示每个人的正确率和最薄弱的主题：这就是团队的薄弱点清单，自动汇总而成，而不是靠记忆拼凑。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          重度使用 AI 的团队：一套固定的读代码流程
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          当合并进来的代码大部分由 AI 生成时，读代码就必须从偶尔为之变成定期安排：每周一次改动面评审、以 diff 为先的站会，以及一份共享的薄弱点清单。下面是一套任何团队每周花大约一小时就能执行的具体流程。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            当一个团队合并的代码大部分是生成出来的，会发生一件很具体的事：写代码不再是瓶颈，于是团队对系统的共同认知——谁理解什么、这份理解有多新——成了真正限制团队的东西。代码评审依然守着质量这道关，但评审问的是<em>这能合并吗？</em>，而不是<em>我们理解自己现在接手的这些东西吗？</em>第二个问题，只有在有人专门为它安排时间时才会得到回答。这就是需要一套读代码固定流程的全部理由：工作流程里没有任何别的环节会问这个问题，而这套流程就是对它的常设回答。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">这套流程的五个部分</h2>
          <ol className="mt-6 space-y-5">
            {ROUTINE.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">这套流程不是什么</h2>
          <p className="mt-4">
            它不是追责机制。如果每周的阅读发现了一处没人能解释的改动，这个发现指向的是那个让它悄无声息合并进来的工作流程，而不是交付它的那个人——在重度使用 AI 的团队里，诚实的基线是：每个人都会交付一些自己还没完全理解的东西，而这套流程的存在，就是为了有意识地缩小这个范围。它也不能替代个人的评审纪律，这一点我们在《
            <a href="/learn/how-to-review-ai-generated-code" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              合并之前，如何评审 AI 生成的代码
            </a>
            》一文中讲过——那是针对每一处改动的技能；这里讲的是团队层面的习惯，防止那项技能被慢慢侵蚀。它也不是一场大会：其中任何一部分，只要超出了给它定的时长，就会名存实亡。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 把个人那部分自动化</h2>
          <p className="mt-4 text-secondary">
            这套流程的薄弱环节，永远是忙碌的那几周里每个人的自律。Covate 去掉了这层依赖：它是一个免费、开源的 MCP 工具，接入每位开发者的 AI 编程助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把真实的 diff 变成简短、有针对性的测验——在作答之前暂停后续生成。会话会同步到 covate.org 上免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            ——用 GitHub 登录，没有任何需要购买的东西——在那里，每个人的正确率和最薄弱的主题汇成团队的薄弱点清单，依据的是证据，而不是记忆。
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
            <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              合并之前，如何评审 AI 生成的代码 →
            </a>
            <a href="/learn/how-to-learn-a-new-codebase-fast" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何快速读懂一个新代码库 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
