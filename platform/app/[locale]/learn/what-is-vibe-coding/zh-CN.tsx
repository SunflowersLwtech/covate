// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "什么是氛围编程（vibe coding）？含义、来历与适用场景";
export const DESCRIPTION =
  "氛围编程（vibe coding）指的是用日常语言告诉 AI 你想要什么，然后基本照单全收它生成的东西，不去细读代码。本文给出清晰的定义，讲清这个词的来历（Andrej Karpathy，2025 年）、它真正适用的地方、会在哪里坑你，以及怎样用它而不让自己的技能悄悄退化。";

const USES = [
  {
    kind: "good",
    title: "用完即弃的原型和演示",
    body: "如果目的就是尽快看到一个想法跑起来、之后就扔掉，氛围编程几乎是理想选择。没有人依赖这段代码，所以它的质量几乎无关紧要——要紧的是多快能做出一个能跑的演示。这正是 Karpathy 描述的用法：“用来做周末随手丢弃的项目还不赖”。",
  },
  {
    kind: "good",
    title: "周末项目和个人工具",
    body: "一个小脚本、一个个人仪表盘、一次性的自动化，只有你自己、也许再加一个朋友会用——出 bug 的代价很低，搞砸了重写就是。靠氛围编程，你能做出那些原本根本懒得亲手写的东西。",
  },
  {
    kind: "good",
    title: "探索和学习性的试验",
    body: "想快速摸一摸一个陌生的库、框架或想法，氛围编程很合适。只要你把产出当作学习用的草图，而不是往上搭建的地基，让 AI 先跑在前面，确实是探索一个领域的好办法。",
  },
  {
    kind: "risk",
    title: "有真实用户的生产代码",
    body: "一旦有别人依赖这个软件——真实的用户、真实的数据、真实的钱——账就要反过来算了。随口写的提示词承载不了需求范围、边界情况和错误处理，“基本能用”也不是可以交付给客户的标准。",
  },
  {
    kind: "risk",
    title: "涉及安全和敏感数据的工作",
    body: "认证、支付、密钥、个人数据，以及任何和数据库打交道的东西——这些地方的故障往往悄无声息，代价却很高。AI 会复现训练数据里的模式，包括不安全的模式；没人读过的代码，就是没人发现过漏洞的代码。",
  },
  {
    kind: "risk",
    title: "你以后还得维护的代码",
    body: "真实的工程工作大多是在演进已有的系统，而这取决于有人理解它。你从没读过的氛围编程代码难以调试、改起来有风险，模型自己在下一次编辑时也很容易把它弄坏。如果它要活得比生成它的那次会话更久，就别忘了它的存在。",
  },
] as const;

const FAQ = [
  {
    q: "什么是氛围编程？",
    a: "氛围编程是一种构建软件的方式：你用日常的自然语言告诉 AI 想要什么，让它生成代码，然后基本照单全收、直接运行，而不逐行阅读——靠屏幕上看到的效果来掌舵，而不是靠代码本身。这个词由 Andrej Karpathy 在 2025 年初提出，他形容这种编程是“完全顺着感觉走……甚至忘了代码的存在”。实际操作起来就是：说出你想要什么，点“Accept All”（全部接受），运行，把报错贴回给 AI，如此反复直到能用。这和传统编程是真正的转变——传统编程的全部意义就在于精确控制机器到底做什么。氛围编程用这种控制换来了速度和低门槛：哪怕几乎不懂编程，也能在几分钟内做出能用的东西——这既是它的超能力，也是它风险的根源。",
  },
  {
    q: "氛围编程不好吗？它会让你变成更差的程序员吗？",
    a: "氛围编程本身并不“坏”；它是一种工具，对某些工作非常好用，对另一些工作则是负担。至于技能的问题，坦白的答案是：取决于你怎么用。氛围编程确实非常适合原型、周末项目和探索——也就是犯错代价很低的场景。但风险同样真实，而且有两层。第一，你没读过的代码，就是你很难调试、维护或保障安全的代码，这也是为什么用氛围编程做生产系统被普遍认为是鲁莽的。第二，如果“不理解就接受”成了你唯一的工作方式，你自己推理代码、记住 API、从第一性原理出发调试的能力，就会因为长期不用而悄悄被侵蚀——也就是普通的技能退化。但这些都不是必然的。保持敏锐的开发者会主动地使用 AI：读它生成的东西，追问为什么，在继续往下之前确保自己理解每一处改动。你可以一边氛围编程一边继续学习——只是必须把理解这个闭环补上，而不是跳过它。",
  },
  {
    q: "什么时候该用氛围编程，什么时候不该？",
    a: "在犯错代价低、速度最重要的时候用氛围编程：用完即弃的原型、演示、周末项目、个人工具、内部脚本，以及“这到底行不行得通”的探索性试验。在这些场景里，迭代速度比代码质量更重要，结果也可以随时扔掉，所以顺着感觉走是理性的选择，而不是让人心虚的捷径。如果软件会比生成它的那次会话活得更久，或者有别人依赖它，就要谨慎得多——甚至干脆不用氛围编程：有真实用户的生产代码，任何涉及安全、认证、支付或敏感数据的东西，以及任何你以后还要维护和演进的代码。实践者总结过一条实用的经验法则：氛围编程能很快帮你完成大约前 60%（一个能跑的原型），但剩下的 40%——可靠性、安全性、规模、边界情况、可维护性——正是理解变得不容商量的地方。原型可以凭感觉做，产品必须靠工程。",
  },
  {
    q: "Covate 怎样帮你在氛围编程时不丢掉技能？",
    a: "Covate 让你保留氛围编程的速度，同时补上让它变得危险的那个缺口：交付你并不理解的代码。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——考你这次改动涉及的概念、API、边界情况和取舍，在你作答之前暂停后续生成。所以你照样“看效果、提需求、跑程序”——但在关键时刻，你必须趁上下文还新鲜，真正理解刚进入代码库的东西，而不是被动接受。每次会话都会保存下来，同步客户端会把它们推送到你在 covate.org 上的学习台账——免费，无需付款——在那里你可以回顾过去的每一次会话、你的累计正确率，以及你总是答错的主题。换句话说，它把氛围编程从一个技能退化的陷阱，变成了一种既能走得快、又能同时进步的方式。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">通俗定义</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          什么是<span className="text-brand">氛围编程</span>？
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          氛围编程（vibe coding）指的是用日常语言告诉 AI 你想要什么，然后基本照单全收它生成的东西——运行它，看结果做出反应，把报错贴回去——而不去细读代码。它很快，用在合适的地方确实有用，但也有一个实实在在的隐患。本文讲清这个词到底是什么意思、从哪里来、在哪里好用、会在哪里坑你，以及怎样用它而不让自己的技能悄悄退化。
        </p>
        <ArticleByline updated="2026-08-05" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">氛围编程到底是什么意思</h2>
          <p className="mt-4">
            传统编程讲究精确：你用计算机能理解的语言，准确地告诉它该做什么，每一行代码都由你负责。<strong>氛围编程则是完全相反的姿态。</strong>你用日常语言描述想要的东西——“给我做一个页面，列出我的会议，还能让我新增一个”——AI 生成代码，而你根据屏幕上看到的效果来掌舵，而不是根据代码本身。你接受改动，运行应用，出了问题就把报错贴回给 AI，让它再试一次。
          </p>
          <p className="mt-4">
            它的标志性动作是：你<em>不读代码</em>。正如一种常见的描述所说，你靠写提示词、试用、再用提示词要求修改来构建软件——却从不去看模型实际写了什么。正因如此，完全没有编程背景的人也能上手，有编程背景的人则能做得飞快。而正如后文会看到的，风险恰恰也藏在这里。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">这个词从哪里来</h2>
          <p className="mt-4">
            “氛围编程”（vibe coding）一词由 <strong>Andrej Karpathy</strong> 提出——他是 OpenAI 的联合创始人之一，也曾任特斯拉 AI 总监——出自他 <strong>2025 年 2 月 2 日</strong>在 X 上发的一条帖子。原话是：
          </p>
          <blockquote className="mt-5 border-l-2 border-accent/50 pl-5 text-secondary">
            “有一种新的编程方式，我称之为‘氛围编程’：你完全顺着感觉走，拥抱指数级增长，甚至忘了代码的存在。[……] 我总是点‘<span lang="en">Accept All</span>’（全部接受），再也不看 diff 了。[……] 用来做周末随手丢弃的项目还不赖。”
          </blockquote>
          <p className="mt-5">
            这句话延续了 Karpathy 在 2023 年提出的一个想法——“最热门的新编程语言是英语”——意思是模型已经强到你越来越可以用自然语言、而不是代码去指挥计算机。这个说法很快流行开来。韦氏词典（Merriam-Webster）在 2025 年 3 月把它标为“俚语与流行”词条；到 2025 年 11 月，<strong>柯林斯词典把“vibe coding”评为年度词汇</strong>——足见这个想法在短短一年里已经远远走出了工程师圈子。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">氛围编程在哪里好用，又会在哪里坑你</h2>
          <p className="mt-4">
            抽象地说，氛围编程无所谓好坏：它非常适合某些工作，而对另一些工作则是实实在在的负担。判断标准很简单：<strong>如果代码写错了，代价有多大？</strong>如果答案是“几乎没有”，那就放开手去做；如果是“很大”，就慢下来。
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {USES.map((u) => (
              <div key={u.title} className="rounded-xl border border-border bg-surface/40 p-5">
                <span
                  className={
                    "font-mono text-[11px] uppercase tracking-[0.18em] " +
                    (u.kind === "good" ? "text-accent" : "text-brand")
                  }
                >
                  {u.kind === "good" ? "适合" : "有风险"}
                </span>
                <h3 className="mt-2 text-base font-medium text-primary">{u.title}</h3>
                <p className="mt-2 text-sm leading-7 text-secondary">{u.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6">
            把氛围编程用到极致的人总结过一条实用的经验法则：它能以惊人的速度帮你完成前 ~60%——一个能跑的原型；但剩下的 40%（可靠性、安全性、规模、边界情况、可维护性）是真正的工程，依赖于有人真正理解这个系统。原型可以凭感觉做，产品必须靠工程。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">隐患：交付你并不理解的代码</h2>
          <p className="mt-4">
            下面说点实在的，这也正是 Covate 存在的全部理由。氛围编程的标志性特征——不读代码——也是它唯一真正的隐患，体现在两个方面。短期来看，没人读过的代码，就是没人发现其中 bug、安全漏洞和别扭设计的代码；它难以调试、改起来有风险，模型自己在下一次编辑时也很容易把它弄坏。长期来看，则是<strong>技能退化</strong>：如果“不理解就接受”成了你<em>唯一</em>的工作方式，那些让你成为开发者的能力——推理代码、记住 API、从第一性原理出发调试——就会因为长期不用而悄悄变弱。可怕的是，这个过程中你不会觉得有任何不对；只有当你碰到 AI 解决不了的问题，或者必须独立推理时，差距才会暴露出来。
          </p>
          <p className="mt-4">
            这些都不是反对氛围编程的理由，而是主张把闭环补上。你可以一边氛围编程，<em>一边</em>继续学习；只要趁上下文还新鲜，花一分钟认真看看刚进入代码库的代码，两者就并不冲突。这就是“用 AI 走得更快”和“用 AI 交付自己不理解的东西”之间的区别——而且这是一种习惯，不是性格特质，也就是说，它可以被写进你的工作流程。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 氛围编程，技能不退化</h2>
          <p className="mt-4 text-secondary">
            Covate 让你保留氛围编程的速度，同时补上让它变得危险的那个缺口。它是一个免费、开源的 MCP 工具，接入你的 AI 助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验，考你其中的概念、边界情况和取舍——在你作答之前暂停后续生成，让你趁上下文还新鲜就理解每一处改动，而不是被动接受。你照样看效果、提需求、跑程序——只是不会忘了代码的存在。每次会话都会保存下来；免费的
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
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              用 AI 会让你变成更差的程序员吗？一次坦诚的审视 →
            </a>
            <a href="/learn/should-you-still-learn-to-code-with-ai" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              AI 时代，还值得学编程吗？ →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
