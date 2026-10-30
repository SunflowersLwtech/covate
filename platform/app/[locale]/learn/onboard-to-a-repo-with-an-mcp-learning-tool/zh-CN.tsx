// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "如何借助 MCP 学习工具上手一个代码仓库";
export const DESCRIPTION =
  "在 AI 承担大部分编写工作的情况下上手新项目是危险的，除非有东西在衡量你是否真的在形成理解。本文介绍如何把常规的上手方法与一个 MCP 学习伴侣结合起来，让它就你自己的改动向你提问——并坦诚列出它做不到的事。";

const STEPS = [
  {
    n: "01",
    title: "先走常规的上手流程——这个工具是陪着走，不是代替",
    body: "摸清结构，在本地跑起来，端到端追踪一个请求，读测试，利用 git 历史：我们那篇“如何快速读懂一个新代码库”里的方法，在这里仍然完整适用。MCP 学习工具不替代其中任何一步——它衡量的是你干活的时候理解到底有没有真的留下来，而这一部分，上手过程通常只能碰运气。",
  },
  {
    n: "02",
    title: "把 MCP 服务器装进你的 AI 编程助手",
    body: "MCP——模型上下文协议（Model Context Protocol）——是这些助手用来加载外部工具的标准。Covate 的服务器以 MIT 许可证开源，在本地运行，不需要账号：一旦把它接入 Claude、Cursor、Copilot 或其他支持 MCP 的助手，助手就会在原有工具之外多一个 learning_session 工具。",
  },
  {
    n: "03",
    title: "按你平时的方式在这个仓库里干活",
    body: "没有专门的学习模式：你接真实的任务，问助手真实的问题，做真实的改动。在这个过程中，学习伴侣观察代码库里真正发生了什么变化——你的 diff，而不是假想的练习——并就其中的概念、API 和边界情况生成简短、有针对性的测验，在你作答之前暂停后续生成。上手的练习，就由工作本身构成。",
  },
  {
    n: "04",
    title: "把测验结果当作你的上手地图",
    body: "每答错一道题，都精确地告诉你：你对这个仓库的认识哪里还单薄——而“单薄”如果在第一周被发现，就是一份阅读清单；同一个缺口如果在一次事故里才被发现，就是一笔代价。把会话同步到台账（下一步），你总是答错的主题就会变成一个排好序的队列，指引你第二天读什么。",
  },
  {
    n: "05",
    title: "边走边保留项目级的调试记忆",
    body: "学习伴侣的第二个工具 debug_search 保留的是限定在本项目内的过往调试记忆——于是当同样古怪的行为在第三周再次出现时，第一周的教训是可以取回的，而不是要重新学一遍。在一个不是你写的代码库里，这是最接近资深开发者真正拥有的那样东西：伤疤——只不过整理得井井有条。",
  },
  {
    n: "06",
    title: "同步台账，看着趋势走",
    body: "在 covate.org/dashboard 用 GitHub 登录，取出你的同步令牌，然后在项目里运行 COVATE_SYNC_URL=https://covate.org COVATE_SYNC_TOKEN=<token> python -m covate.platform_sync。台账会显示每一次同步过来的会话及其分数、你的累计正确率，以及你答得最差的主题——上手进度变成一条曲线，而不再是一种感觉。",
  },
] as const;

const FAQ = [
  {
    q: "什么是 MCP 学习工具？",
    a: "一个接入你的 AI 编程助手、给它加上学习机制的 MCP（模型上下文协议，Model Context Protocol）服务器。Covate 的就是一个具体的例子：一个免费、开源的服务器，在本地运行，暴露一个 learning_session 工具，根据你最近的代码改动生成交互式测验、在你作答之前暂停后续生成，以及一个 debug_search 工具，用来做项目级的调试记忆。你已经在用的那个助手，因此多了一位就你自己的 diff 向你提问的导师。",
  },
  {
    q: "MCP 工具怎样帮助你上手一个新仓库？",
    a: "上手的失败是悄无声息的：你交付了改动，却没有建立起一个持久的心智模型，而且没有任何东西衡量这两者的差别。MCP 学习伴侣衡量的就是这个——你做的每一处改动都变成测验材料，于是你对仓库理解上的缺口，在第一周以答错的形式浮出来，而不是在第三个月以事故的形式。它不替代常规方法（把它跑起来、追踪一个请求、读测试）；它补上的是那套方法一直缺少的反馈闭环。",
  },
  {
    q: "用它需要账号吗？",
    a: "不需要——MCP 服务器在本地运行，不需要账号，也不绑定任何身份，照样能完整工作。covate.org 上的云端学习台账是在此之上的可选项：用 GitHub 登录（设备码流程），在仪表盘里取出一个同步令牌，再用 python -m covate.platform_sync 把会话推上去，就能跨项目、跨时间追踪正确率和薄弱主题。",
  },
  {
    q: "它做不到什么？",
    a: "它不生成文档，不回答你还没碰过的架构问题，也不替代读代码——测验来自你自己的改动，所以仓库里没被碰过的角落仍然没被碰过。它没有编辑器，自己也不生成任何 AI 代码，也没有团队仪表盘或进度图表——这些目前都不存在，我们也不会把它们说得好像存在。它衡量并巩固理解；理解本身，仍然是你的事。",
  },
  {
    q: "它收费吗？",
    a: "不收费。MCP 服务器以 MIT 许可证开源；covate.org 上的学习台账是免费的——用 GitHub 登录，没有任何需要购买的东西。整个网站上没有任何付费档位、订阅或结账。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          如何借助 MCP 学习工具上手一个代码仓库
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          在 AI 承担大部分编写工作的情况下上手新项目是危险的，除非有东西在衡量理解是否真的在形成。下面讲怎样把常规的上手方法与一个 MCP 学习伴侣搭配起来，让它就你自己的改动向你提问——并坦诚列出它做不到的事。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            经典的上手难题，如今多了一层新的棘手之处。以前加入一个仓库，理解是被逐渐逼出来的——要改任何东西，你都得先读很多。有了 AI 助手，你可以在一个几乎不理解的代码库里交付看起来挺像样的改动，这意味着上手现在可以<em>静悄悄地失败</em>：产出看着没问题，心智模型却从未形成。解决办法不是少用 AI——而是一个反馈闭环，趁缺口的代价还小就把它找出来。MCP 学习伴侣就是干这个的。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">方法，一步一步来</h2>
          <ol className="mt-6 space-y-5">
            {STEPS.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">它和其余部分怎么衔接</h2>
          <p className="mt-4">
            基础方法——摸清结构、跑起来、追踪、读测试、看历史——写在
            <a href="/learn/how-to-learn-a-new-codebase-fast" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              如何快速读懂一个新代码库
            </a>
            里。学习伴侣是在它之上加上衡量。如果你想了解“就自己的 diff 做测验”为什么有效、背后的记忆科学是什么，看
            <a href="/learn/spaced-repetition-for-developers" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              写给开发者的间隔重复：如何真正记住学过的东西
            </a>
            ；如果你想了解同步产出的那个台账概念，看
            <a href="/learn/keep-a-learning-ledger-from-your-commits" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              如何从你的提交中记一份学习台账
            </a>
            。合在一起，它们把上手从一次跳跃变成一条曲线。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">Covate 就是那个 MCP 学习伴侣</h2>
          <p className="mt-4 text-secondary">
            免费且开源（MIT），在本地运行，不需要账号：把它接入 Claude、Cursor、Copilot 或其他支持 MCP 的助手，它的 <code className="font-mono text-xs">learning_session</code> 工具就把你真实的代码改动变成测验、在你作答之前暂停后续生成，而 <code className="font-mono text-xs">debug_search</code> 保留项目级的调试记忆。用 GitHub 登录，把会话同步进 covate.org 上免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            ，就能看着你的正确率和最薄弱的主题在进入这个仓库的头几周里如何变化。没有任何需要购买的东西。
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
            <a href="/learn/how-to-learn-a-new-codebase-fast" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何快速读懂一个新代码库 →
            </a>
            <a href="/learn/keep-a-learning-ledger-from-your-commits" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何从你的提交中记一份学习台账 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
