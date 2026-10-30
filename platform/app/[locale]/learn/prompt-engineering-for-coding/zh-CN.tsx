// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "面向编程的提示词工程：怎样让 AI 给出更好的代码";
export const DESCRIPTION =
  "AI 编程助手的表现，取决于你怎么问它。这是一份写好提示词的实用指南——提供上下文、说得具体、设定约束、先做计划、反复迭代——帮你从 Claude、Cursor、Copilot 和 ChatGPT 那里拿到可用的代码，并说明为什么你仍然必须理解和验证它返回的东西。";

const STEPS = [
  {
    n: "01",
    title: "给它上下文，而不只是一个任务",
    body: "这是杠杆最大的一条。AI 助手读不懂你代码库里的潜台词——所以要告诉它语言、框架和版本、它正在改的文件或函数、你遵循的约定，以及它要在什么约束下工作。最好的做法是把正在修改的实际代码（以及周围相关的代码）直接贴进去，而不是用语言描述。含糊的上下文进去，得到的是看似合理但实际有错的代码；丰富而具体的上下文进去，得到的才是能用的代码。",
  },
  {
    n: "02",
    title: "把“改什么”和“改多少”说具体",
    body: "一句“把它改好一点”只会换来一个含糊、东拉西扯的回答。要确切地说出改什么、哪些地方别动，以及改动该有多大（一个函数，而不是一次整体重构）。把输入和预期输出、要处理的边界情况，以及你想要的行为都写清楚。请求里的精确度，正是把一个泛泛的、Stack Overflow 风格的回答，变成贴合你真实问题的代码的关键。",
  },
  {
    n: "03",
    title: "写明约束，也写明不做什么",
    body: "AI 默认会过度帮忙——它会加依赖、改名字、重新排版文件，还会“改进”你根本没让它碰的代码。用明确的约束提前拦住：“不要新增依赖”“保持现有风格”“不要改动公开 API”“只动这个函数”。告诉它不要做什么，和告诉它要做什么一样重要，也能让 diff 保持小而易于评审。",
  },
  {
    n: "04",
    title: "写代码之前，先要一份计划",
    body: "凡是不简单的任务，都加一句：“写代码之前，先用几条要点列出你的做法。”这样你可以在模型基于错误方向生成 200 行代码之前，就把方向拦下来。纠正一份三行的计划只要几秒；纠正一份写完的实现，则是一轮让人沮丧的来回拉扯。先认可计划，再让它实现。",
  },
  {
    n: "05",
    title: "给一个例子（few-shot）",
    body: "例子传达意图，永远比描述更有效。把代码库里一个已有的、符合你想要的模式和风格的函数指给模型看，贴一段你期望的输出格式样例，或者给它一个已经通过的测试。“照着这个写其余的”是一条出奇有效的提示词——它把模型锚定在你的约定上，而不是它自己的通用默认值。",
  },
  {
    n: "06",
    title: "小步迭代，而不是一条巨型提示词",
    body: "忍住一次要齐所有东西的冲动。一条试图搭起整个功能的提示词，会产出一大段难以评审、也更可能某处出错的 diff。一次只要求一处聚焦的改动，评审并接受之后，再要下一处。短小、连续的提示词让每一处 diff 都正确、可理解——模型跑偏时也更容易把它拉回来。",
  },
  {
    n: "07",
    title: "验证——提示词从不保证正确",
    body: "这一条最重要。哪怕一条设计得完美的提示词，产出的也是看似合理、却可能错得隐蔽而自信的代码。读它、跑它、测它，检查边界情况。好的提示词让 AI 更快、更切题；它不会让 AI 变得正确。提示词给你的是一份扎实的初稿——最终交付什么，责任仍然在你。",
  },
] as const;

const FAQ = [
  {
    q: "面向编程的提示词工程是什么？",
    a: "面向编程的提示词工程，是写出清晰、上下文充分的请求，从而从 Claude、Cursor、Copilot 或 ChatGPT 这样的 AI 助手那里拿到可用代码的能力。实际操作下来，它归结为几个习惯：给模型真实的上下文（语言、框架、它正在改的实际代码、你的约定）；具体说明改什么、改多少；写明约束和不做什么，免得它过度帮忙；不简单的任务先要计划再要代码；给出你想要的模式的例子；小步迭代，而不是一条巨型提示词；并且永远验证结果。这是一项真正有用的技能——但它是让你更快拿到更好初稿的办法，不是跳过理解代码的办法。",
  },
  {
    q: "怎样从 ChatGPT、Copilot、Cursor 或 Claude 那里拿到更好的代码？",
    a: "从上下文开始：把正在改的实际代码贴进去，告诉模型框架、版本和约定，而不是抽象地描述问题。然后要具体——确切说出改什么、哪些地方不动、范围多大（一个函数，而不是一次重构），包括你在意的边界情况。加上明确的约束（“不要新增依赖”“保持这种风格”“不要改 API”），因为 AI 助手默认就会加东西、改名字。较大的任务先要一份简短的计划，好早点抓住错误的做法，并给出你想要的模式或输出格式的例子。用小而可评审的步骤推进，而不是一条巨型提示词。最后，读、跑、测它产出的一切——更好的提示词提高的是概率，从不保证代码正确。",
  },
  {
    q: "提示词工程能代替会写代码吗？",
    a: "不能——它放大的是编程能力，而不是取代它。更好的提示词带来更好的输出，但要写出好的提示词，你往往得先把这个领域理解到足以说清要做什么、有哪些约束、有哪些边界情况；而要安全地使用输出，你必须能读懂它、判断它对不对，并抓住那些看似合理的 AI 代码里可能藏着的隐蔽 bug 和不安全模式。理解代码的人，写出的提示词更锋利，评审结果也比不理解的人更快、更可靠。所以提示词工程是一项真实而值得学的技能，但它建立在编程理解之上——它并不取消对理解的需要。",
  },
  {
    q: "Covate 怎样帮我用 AI 写代码？",
    a: "提示词工程让你更快拿到好代码；Covate 确保你真正理解自己正在交付的代码。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验，考你其中的概念、API、边界情况和取舍——在你作答之前暂停后续生成。换句话说，无论你的提示词有多好，Covate 都会在上下文还新鲜的那一刻，检查你能不能讲清自己刚生成的东西。同步客户端随后把它们推送到你在 covate.org 上的学习台账——免费，无需付款——在那里你可以回顾过去的每一次会话、你的累计正确率，以及你总是答错的主题。于是更好的提示词转化成不断累积的理解，而不只是更快地交付你跟不上的代码。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          面向编程的提示词工程
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          AI 编程助手的表现，取决于你怎么问它。含糊的提示词（看似合理但实际有错的代码）和精确的提示词（你真正能用的代码）之间的差距，是一项可以学会的技能。这里有一份实用指南，教你怎样给 AI 编程工具写好提示词——提供上下文、说得具体、设定约束、先做计划、反复迭代——以及为什么你仍然必须理解和验证它返回的一切。
        </p>
        <ArticleByline updated="2026-08-05" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            “提示词工程”听起来比它实际的样子要高大上。对编程来说，它其实就是这么一点区别：你是让一个有才华、但只按字面理解的结对程序员“把它改好一点”，还是给他足够的上下文和方向，让他真的帮得上忙。做对了，AI 助手会很快给出一份扎实的初稿；做错了，你得到的是自信、通用、却不适合你这个系统的代码。下面七个习惯覆盖了这中间的大部分差距。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">写好编程提示词的七个习惯</h2>
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">写得好的提示词，不等于理解</h2>
          <p className="mt-4">
            陷阱就在这里。提示词工程是一项<strong>生产力</strong>技能——它帮你更快拿到更多、更好的代码。但交付代码更快，也让你更容易交付自己其实并不理解的代码，而 AI 辅助开发正是在这里悄悄侵蚀你的技能。理解是另一项独立的<strong>能力</strong>技能，最好的开发者两者兼备：他们提示词写得精确，<em>并且</em>能讲清返回来的东西。一条出色的提示词给你一份出色的初稿——但这不等于你可以不读它。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">提示词写好——然后用 Covate 确保自己真的懂了</h2>
          <p className="mt-4 text-secondary">
            无论你的提示词有多好，你仍然必须理解 AI 生成的东西。Covate 把这项检查写进了你的工作流程。它是一个免费、开源的 MCP 工具，接入你的 AI 助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验，考你其中的概念、边界情况和取舍——在你作答之前暂停后续生成。每次会话都会保存下来；免费的
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
            <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              合并之前，如何评审 AI 生成的代码 →
            </a>
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
            </a>
            <a href="/learn" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              浏览 Covate 学习中心 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
