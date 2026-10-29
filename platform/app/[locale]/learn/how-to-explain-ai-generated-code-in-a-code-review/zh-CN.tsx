// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "在代码评审中如何讲清楚 AI 生成的代码";
export const DESCRIPTION =
  "当评审者问起 AI 生成的代码时，一句“这是 AI 写的”会让讨论就此结束，你的可信度也随之打了折扣。本文讲清如何解释生成的改动：四问结构、PR 描述里该写什么，以及在你不知道答案时该怎样坦诚地说。";

const STRUCTURE = [
  {
    n: "01",
    title: "它做了什么，用一句话说清",
    body: "先说行为，不说实现：“这次改动会用指数退避重试失败的 webhook 投递，最多五次。”如果你说不出这句话，你还没准备好解释这次改动——你该先回去读它。这一句行为总结，是进入后续整段讨论的入场券。",
  },
  {
    n: "02",
    title: "为什么用这种做法，而不是那个显而易见的替代方案",
    body: "没走的那条路摆在明面上，评审者就会更信任这次改动。“我考虑过用队列，但这里投递延迟比顺序更重要，所以选了进程内重试。”对生成的代码来说，这恰恰是“AI 选的”这种说法失效的地方：你必须自己把这个取舍重新推一遍，而这么做也是真正理解这次改动最快的办法。",
  },
  {
    n: "03",
    title: "它在哪里会出问题：边界情况和失效模式",
    body: "把边界大声说出来——空输入、并发调用、超时，以及第三次重试也失败时会发生什么。生成的代码往往把正常路径做得很漂亮，其余的一概跳过，所以这里诚实的回答常常是：“这两处我查过；那一处我没查，而我认为它是安全的，理由是这样。”这句话，平平实实地说出来，就是可信度该有的样子。",
  },
  {
    n: "04",
    title: "我是怎么验证的",
    body: "用证据收尾：你跑了哪些测试，你改了什么来看着它们失败，你读了周围哪些代码来确认这次改动放得进去。“测试通过了”不是验证——AI 写的测试，只是把代码碰巧在做的事原样写成了断言。“我把重试上限改坏，看着测试失败”才是验证，而评审者立刻就能分辨两者的差别。",
  },
] as const;

const FAQ = [
  {
    q: "评审者问起 AI 写的代码时，我该说什么？",
    a: "用你讲自己亲手写的代码时会说的同样四件事来回答：它做了什么，用一句话说清；为什么用这种做法而不是替代方案；边界情况和失效模式在哪里；你是怎么验证的。AI 生成了它这件事，一点也不改变这个结构——它只是提高了你漏掉某一块的概率，而这正是把这个结构走一遍之所以重要的原因。“这是 AI 写的”四个问题一个都答不上，等于告诉评审者去信任一段房间里谁都解释不了的代码。",
  },
  {
    q: "我应该在 PR 里披露这段代码是 AI 生成的吗？",
    a: "标注这件事遵循你们团队的规定；无论标不标，写 PR 描述时都要假定一位资深工程师会拿着 diff 来盘问你——因为真的会有人这么做。评审里要紧的不是出处，而是责任：必须有人能解释并捍卫每一行，而这个人就是你。团队之间对是否明确披露生成来源各有不同；但一份经不起追问的描述，对任何团队都没有好处。",
  },
  {
    q: "一次 AI 生成的改动，PR 描述里应该包含什么？",
    a: "和任何一份好描述一样的骨架，外加两处针对 AI 的补充：行为总结，以及取舍讨论（考虑过什么、为什么这种做法胜出），然后是你检查过的边界情况——以及点名那些你没检查的——再加上你如何验证了这次改动，而不只是“测试通过”。如果手里只有 AI 自己建议的提交信息，那你还没有一份描述；请求评审之前，先自己把这四部分重新拼出来。",
  },
  {
    q: "如果我确实答不上关于生成代码的某个问题呢？",
    a: "如实说，说得精确：“并发调用时会发生什么我不知道——合并之前我会查清楚。”这是一个能赢得信任的专业回答。猜测，或者现场编一段听起来像那么回事的理由、假装是 AI 可能有过的考量，才是唯一真正糟糕的做法：它把一个知识缺口变成了可信度问题。然后把这个缺口补上，并且留意：你答不上的那个问题，是你个人薄弱点清单上一条永久的记录。",
  },
  {
    q: "Covate 怎样帮你在评审中讲清楚 AI 代码？",
    a: "Covate 在真人跟你谈之前，先把这场对话彩排一遍。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——正是一位敏锐的评审者会问的问题——在你作答之前暂停后续生成。会话会同步到 covate.org 上免费的学习台账（用 GitHub 登录，没有任何需要购买的东西），追踪你的正确率以及你总是答错的主题，让这些缺口在私下里就被发现，而不是等到评审中暴露出来。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          在代码评审中如何讲清楚 AI 生成的代码
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          “这是 AI 写的”会让讨论就此结束，你的可信度也随之打了折扣。把生成的改动解释好，靠的是一套可以学会的结构：四个问题，一份关于你没检查过什么的诚实交代，以及一份经得起盘问的 PR 描述。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        {/* Answer-first summary. This page has live impressions on the query it is
            named after, and a retriever quoting it will quote the first passage under
            the first question-shaped heading — so that passage is the whole answer,
            not a lead-in to one. */}
        <section className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-primary">评审者问起 AI 写的代码为什么这样写时，你该说什么？</h2>
          <p className="mt-3 text-sm leading-7 text-secondary">分三部分回答：这次改动做了什么，为什么用这种做法而不是那个显而易见的替代方案，以及在开 PR 之前你检查了什么。如果三样你给不全，就如实说，然后回去读 diff——“这是 AI 写的”不是回答；而且已经有 45% 的开发者报告，调试 AI 生成的代码比调试自己的代码更花时间。</p>
        </section>

        <section>
          <p>
            评审里有一种很具体的沉默：有人问<em>这里为什么要这样写？</em>作者却以“呃，这个 AI……”开头。评审者并不反感生成的代码——他们反感的是<em>没人认领</em>的代码，而要把前者变成有人认领的代码，最快的办法就是像对待手写代码那样回答问题：用结构来回答。一旦你把它合并进去，它就是你的；评审，就是你证明这一点的地方。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">四问结构</h2>
          <ol className="mt-6 space-y-5">
            {STRUCTURE.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">在真人提问之前先彩排一遍</h2>
          <p className="mt-4">
            这四个问题是可预见的——也就是说，答得上来和答不上来之间的差距，可以在评审之前私下里就被发现。拿着 diff 逐个问自己一遍；每一次卡壳都是一份阅读作业，不是性格缺陷。评审改动本身的具体做法，见
            <a href="/learn/how-to-review-ai-generated-code" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              合并之前，如何评审 AI 生成的代码
            </a>
            ；让整个团队都持续讲得清这些改动，见
            <a href="/learn/code-reading-routine-for-ai-heavy-teams" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              重度使用 AI 的团队：一套固定的读代码流程
            </a>
            。解释就是把理解说出声来——两者是同一种能力。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate，先把难问题答一遍</h2>
          <p className="mt-4 text-secondary">
            Covate 是评审对话的一次私下彩排。这个免费、开源的 MCP 工具接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——行为、取舍、边界情况——在你作答之前暂停后续生成。免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            在 covate.org 上接着追踪每一次同步过来的会话、你的累计正确率，以及你总是答错的主题——所以当真人评审者提问时，你已经答过了。无论哪一半，都没有任何需要购买的东西。
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SignInCta />
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
              {t("getMcp")}
            </a>
          </div>
          <p className="mt-4 font-mono text-[11px] text-dim">{t("finePrint")}</p>
        </section>

        {/* Shared evidence layer: sourced research, the verification comparison,
            the tool's own checkable numbers, and the source list. Kept in one
            module (app/_geo/Evidence.tsx) so the figures cannot drift apart
            across the 20 pages that quote them. */}
        <Evidence
          sources={[
            {
              href: "https://google.github.io/eng-practices/review/",
              label: "Google — Code Review Developer Guide",
              note: "覆盖这场交流的双方：评审者在找什么，以及作者该向评审者交代什么。",
            },
            {
              href: "https://git-scm.com/docs/git-log",
              label: "Git — git-log documentation",
              note: "当问题是“代码为什么会变成这样”时，你可以指给评审者看的那段历史。",
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
            <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              合并之前，如何评审 AI 生成的代码 →
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
