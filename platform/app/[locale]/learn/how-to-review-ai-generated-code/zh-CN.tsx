// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "合并之前，如何评审 AI 生成的代码";
export const DESCRIPTION =
  "代码是 AI 写的，但责任仍然在你。这是一份在合并前评审 AI 生成代码的实用清单：到底该检查什么、要警惕哪些典型的出错方式，以及如何趁你还理解它的时候完成评审。";

const CHECKS = [
  {
    n: "01",
    title: "你能讲清它做了什么——以及为什么这样做吗？",
    body: "先做这一步：把 AI 的解释遮住，只读 diff。如果你没法用自己的话说出每一部分做了什么，以及它为什么选了这种做法、而不是那个显而易见的替代方案，那你就评审不了它——只能走个过场、盖章放行。这是最重要的一项检查，因为其余所有检查都建立在真正理解这次改动的基础上。",
  },
  {
    n: "02",
    title: "它做的是你要求的事吗——而且只做了这件事吗？",
    body: "AI 总想多帮点忙。检查这次改动是否解决了实际的问题，并留意范围蔓延：额外的“改进”、被重命名的变量、被重新格式化的文件，或者一次你没要求的重构，全都埋在同一个 diff 里。没人要求的改动，正是意外藏身的地方。把 diff 削减到你真正想要的那处改动。",
  },
  {
    n: "03",
    title: "边界情况和错误路径",
    body: "生成的代码通常能把正常路径写得滴水不漏，其余的就略过了。检查各种边界：空输入、null、空列表、失败的网络请求、超时、并发访问。具体地问一句“如果它什么都不返回 / 抛出异常 / 被调用两次，会怎样？”——答案往往是“没人想过”，而这就是一个在上线之前被你逮住的 bug。",
  },
  {
    n: "04",
    title: "安全与数据处理",
    body: "把代码接触输入、认证、密钥或数据库的每一处都读一遍。用户输入有没有经过校验和转义（SQL、shell、HTML）？权限是真的检查过了，还是想当然地认为没问题？密钥是从环境变量读取的，还是硬编码在代码里？AI 会复现训练数据里的模式——包括不安全的模式——所以恰恰是在这里，人用新鲜的眼光再看一遍最有价值。",
  },
  {
    n: "05",
    title: "它契合你的代码库吗——而不只是单独拿出来能跑？",
    body: "这段代码单独看可能是对的，放进你的项目里却不对：它用了一个你们不用的库，无视了你们现有的辅助函数，在你们早有约定的地方另起一套新模式，或者重复了别处已有的逻辑。好的代码与周围的代码保持一致。让它贴合你的项目，而不是照搬一个通用的 Stack Overflow 答案。",
  },
  {
    n: "06",
    title: "有没有测试——测的是不是该测的东西？",
    body: "如果这次改动没有测试，这本身就是一个警示信号。如果有 AI 写的测试，就带着批判的眼光去读：它们断言的是真实的行为，还是只是确认代码碰巧做了什么就是什么（无论如何都会通过的同义反复式测试）？运行它们，再试着把代码改坏，确认这些测试真的能抓住问题。",
  },
] as const;

const FAQ = [
  {
    q: "AI 生成的代码真的需要仔细评审吗？",
    a: "需要——甚至可以说要比评审人写的代码更仔细，而不是更随意。同事写代码时，已经思考过你们的代码库、你们的约定和这个具体问题；而 AI 写代码时，是根据训练数据里的模式给出一个看上去像模像样的方案，对你的系统没有真正的理解，也不为结果负责。它常常是对的，但错的时候会错得理直气壮，而且出错的方式很隐蔽：不易察觉的边界情况 bug、从不安全的示例里照搬来的安全写法、范围蔓延，或者单独拿出来能跑、却不契合你项目的代码。关键在于，一旦你把它合并进去，它就是你的代码——归你所有，由你维护，凌晨 2 点调试它的也会是你。所以评审不是走形式；它是你把不是自己写的代码重新收归己有的那一步，也是“用 AI 走得更快”和“用 AI 交付自己不理解的东西”之间的区别。",
  },
  {
    q: "评审 AI 代码时，到底该检查什么？",
    a: "从理解开始——如果你讲不清这次改动做了什么、为什么这么做，就先停下来把它弄明白，因为你没法评审自己不理解的东西。然后对照清单逐项过：（1）它是否解决了实际的问题，而且只解决了这个问题（留意没人要求的“改进”和范围蔓延）？（2）边界情况和错误路径——空输入、null、失败、超时、并发，这些正是生成的代码容易略过的地方；（3）安全与数据处理——输入校验、认证检查、没有硬编码的密钥，因为 AI 可能从训练数据里复现不安全的模式；（4）是否契合你的代码库——它用的是你们的约定和现有的辅助函数，还是另起新模式、重复已有的逻辑？（5）测试——有没有测试，它们断言的是不是真实的行为，而不只是同义反复地通过？贯穿所有这些的主线是：AI 擅长正常路径和泛泛的正确性，却不擅长你系统的具体细节、各种出错方式，以及没人明确问过的东西——所以要看的就是这些地方。",
  },
  {
    q: "怎样更快地评审 AI 代码，又不漏掉问题？",
    a: "诀窍在于选对时机、分小块评审，而不是少评审。每处改动一生成就评审，趁上下文还在你脑子里、diff 还很小——花 60 秒读一处聚焦的改动，远比之后去评审一大堆积压下来的 AI 输出有效，到那时你早就忘了其中任何一段为什么会存在。每次只让 AI 做一处聚焦的改动，diff 就能保持小巧。读代码是为了讲清它，而不只是为了批准它。机械性的部分交给工具（linter、类型检查器、安全扫描器、你的测试套件），把人的注意力留给工具判断不了的事：它是否真的解决了问题、是否契合这个系统、有没有人考虑过边界情况？小规模、即时、以理解为先的评审，比拖到最后一次性盖章放行更快，也更彻底。",
  },
  {
    q: "Covate 怎样帮我评审并理解 AI 生成的代码？",
    a: "Covate 把“合并之前先理解”这一步直接嵌进你的工作流程。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——考你这次改动涉及的概念、API、边界情况和取舍，在你作答之前暂停后续生成。换句话说，它强制你完成本文讲的这项“评审并理解”的检查，而且恰好在最要紧的时刻：代码刚生成、上下文还新鲜的时候。每次会话都会保存下来，同步客户端会把它们推送到你在 covate.org 上的学习台账——免费，无需付款——在那里你可以回顾过去的每一次会话、你的累计正确率，以及你总是答错的主题——于是评审 AI 代码就变成了不断累积的理解，而不是忙起来就跳过的一步。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          合并之前，如何评审 AI 生成的代码
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          代码是 AI 写的，但你把它合并进去的那一刻，它就是你的了——归你所有，由你维护，由你调试。评审 AI 生成的代码不是走形式；它是你把不是自己写的代码重新收归己有的那一步。下面是一份实用清单：到底该检查什么、要警惕哪些出错方式，以及如何趁你还理解它的时候完成评审。
        </p>
        <ArticleByline updated="2026-08-04" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        {/* Answer-first summary: the first passage under the first question-shaped heading
            is the whole answer, not a lead-in to one. */}
        <section className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-primary">怎样评审 AI 写的代码？</h2>
          <p className="mt-3 text-sm leading-7 text-secondary">把 AI 的解释遮住，只读 diff，然后逐项过 6 项检查：你能讲清它吗；它是否只做了你要求的事；边界情况和错误路径处理了没有；输入、认证和密钥的处理是否安全；它是否契合你的代码库；测试断言的是不是真实的行为？每处改动生成后几分钟之内就评审，趁 diff 还小。</p>
        </section>

        <section>
          <p>
            AI 编程助手确实很好用——但它们产出的是<em>看似合理</em>的代码，而不是<em>被理解过</em>的代码。它们拿训练数据做模式匹配，对你的系统没有真正的认知，也不为之后发生的事负责。这种组合——通常是对的，偶尔错得理直气壮，一旦合并就永远是你的责任——正是认真评审之所以重要的原因。对每一处 AI 生成的改动，都逐项过一遍这六项检查。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">6 项评审清单</h2>
          <ol className="mt-6 space-y-5">
            {CHECKS.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">在对的时机评审</h2>
          <p className="mt-4">
            最大的杠杆不是评审得更多，而是在对的时间评审。每处改动<strong>一生成就评审</strong>，趁上下文还新鲜、diff 还小。花 60 秒读一处聚焦的改动，胜过之后去评审一大堆积压下来的 AI 输出——到那时你早就忘了其中任何一段为什么会存在。让 diff 保持小巧（每次只要一处改动），机械性的检查交给工具（linter、类型检查器、扫描器、测试），把人的注意力花在工具判断不了的事情上：它解决问题了吗，契合你的系统吗，有没有人考虑过边界情况？
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 让评审这一步自动发生</h2>
          <p className="mt-4 text-secondary">
            评审 AI 代码最难的，是记得趁上下文还在的时候去做。Covate 把这一步内置了进来。它是一个免费、开源的 MCP 工具，接入你的 AI 助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验，考你其中的概念、边界情况和取舍——在你作答之前暂停后续生成，让你在继续往下之前理解每一处改动。每次会话都会保存下来；免费的
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
        <Evidence
          sources={[
            {
              href: "https://google.github.io/eng-practices/review/reviewer/looking-for.html",
              label: "Google — What to look for in a code review",
              note: "Google 公开的工程实践指南；本页的 6 项检查就是对照这份标准整理的。",
            },
            {
              href: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests",
              label: "GitHub Docs — Reviewing changes in pull requests",
              note: "介绍如何在这类评审最常发生的平台上读 diff、请求修改、留下逐行评论。",
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
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
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
