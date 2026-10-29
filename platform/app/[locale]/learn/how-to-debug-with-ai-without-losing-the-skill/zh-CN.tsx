// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "如何用 AI 调试，又不丢掉调试能力";
export const DESCRIPTION =
  "用 AI 调试要奏效，AI 应该是第二步而不是第一步：先读调用栈，认定一个假设，然后带着你的推理去找助手。本文介绍让诊断能力保持活跃的五步循环——以及会让这种能力慢慢消失的“先粘贴再说”的习惯。";

const LOOP = [
  {
    n: "01",
    title: "先自己读报错，永远是第一步",
    body: "在任何东西进聊天窗口之前：把调用栈从头到尾读一遍，找出文件和行号，并大声说出这个报错声称发生了什么。一半的 bug 死在这里——调用栈把问题写得明明白白，你十秒就能看见。这里训练的习惯是注意力：报错里包含的信息，几乎总是比人们从中提取出来的更多。",
  },
  {
    n: "02",
    title: "请教之前，先认定一个假设",
    body: "写下（真的写下来，或者写进一条注释）你认为错在哪里、什么能证明它。“token 是 null，因为刷新发生在这次读取之后——我打个日志看看。”猜错完全没问题；关键是那块诊断肌肉——假设、预测、验证——要在助手之前先动起来。当“粘贴”成了第一步，萎缩的正是这块肌肉。",
  },
  {
    n: "03",
    title: "带着你的推理，把 AI 请进来",
    body: "现在用助手——但把它当成同事，而不是神谕：这是调用栈，这是我已经排除的，这是我的假设，它错在哪里？这种提问方式会改变你得到的东西（批评和替代方案，而不是一个自信的猜测），也让你即使在 AI 贡献了关键洞见时，仍然是这次调查的主导者。",
  },
  {
    n: "04",
    title: "按因果关系验证修复，而不是按统计结果",
    body: "“测试现在过了”作为证据，比听起来要弱。要问这个改动为什么奏效：机制是什么，旧代码为什么只在这条路径上失败？如果你讲不出那个因果故事，你就没有修好这个 bug——你只是把它挪走了。这也是 AI 建议的修复最常误导人的地方：它们可以掩盖症状，而底层原因还在等着生产环境。",
  },
  {
    n: "05",
    title: "把教训存到你以后找得到的地方",
    body: "解决之后，记下那一句教训——真正的根因，而不是修复本身。六周之后，当同一类 bug 再次出现，检索胜过重新推导。（这一步正是 Covate 的调试记忆要自动化的；下文再说。）",
  },
] as const;

const FAQ = [
  {
    q: "把调用栈粘贴进 ChatGPT 是坏事吗？",
    a: "作为第一步，是的——不是因为答案会错（它常常有用），而是因为这个习惯在几个月里对你做的事：阅读、假设、验证的诊断循环被跳过了，而调试能力恰恰就是这个循环。作为第二步或第三步，在你读过调用栈、形成了假设之后，带着你的推理去粘贴，正是一个好同事会向一位好的资深工程师做的事。顺序才是技能；工具本身没问题。",
  },
  {
    q: "怎样调试得更快，又不丢掉调试能力？",
    a: "把不属于这项技能的部分加速：用 AI 来解释不熟悉的报错信息、概括不熟悉的库内部机制，并围绕你的假设生成日志或复现用的脚手架。核心循环——阅读、假设、验证——保持由人来做。最快的调试者不是把这个循环外包出去的人；而是自己跑过成千上万次循环、假设因此变得锋利的人。",
  },
  {
    q: "AI 建议的修复不管用时，我该怎么办？",
    a: "把它当作关于你问题陈述的数据，而不是一张盲目去试下一条建议的选票。一次失败的修复通常意味着 AI 对这个 bug 的模型与现实不符——所以告诉它这次失败的修复改了什么、由此排除了什么。同一个 bug 上连续三次 AI 修复都失败，是一个强烈的信号：停下来，回到第一性原理——把它最小地复现出来，用自己的眼睛读那条代码路径，加上探测手段。这个 bug 在告诉你一些聊天听不见的东西。",
  },
  {
    q: "每天都在用 AI，怎样保住调试能力？",
    a: "让这个循环的前两步不可商量——完整地读调用栈，并说出你自己的一个假设——在任何一次向 AI 请教之前，对每一个 bug 都这样做，不管压力有多大。调试能力的退化来自被跳过的练习，而不是来自使用工具，所以这条规则是一条保住练习次数的规则。然后把每一个解决了的根因记在某个可以检索的地方；模式记忆，才是资深调试能力的大部分实际内容。",
  },
  {
    q: "Covate 怎样帮到 AI 辅助的调试？",
    a: "两个方面。它开源的 MCP 接入你的 AI 编程助手（Claude、Cursor、Copilot 等），把你的代码改动——包括修复——变成简短、有针对性的测验，于是每一次修复背后的因果故事被重新提取出来，而不只是被应用一次。而它的 debug_search 工具保存项目级的调试记忆：几周后同一类故障在同一个代码库里再次出现时，先前的教训可以检索到，而不必重新推导。两半都是免费的——MCP 以 MIT 许可发布，covate.org 上的学习台账没有任何需要购买的东西。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          如何用 AI 调试，又不丢掉调试能力
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          用 AI 调试要奏效，AI 应该是第二步而不是第一步：先读调用栈，认定一个假设，然后带着你的推理把助手请进来。下面是让诊断肌肉保持活跃的循环——以及那个会让它悄悄消解的“先粘贴再说”的习惯。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            调试是 AI 最有可能威胁到的技能，因为这个工作流程天然就是“粘贴”的形状：出现一个报错，你把它粘贴进去，一个答案出现。把这个循环跑上几个月，被侵蚀的是很具体的东西——不是知识，而是那种<em>诊断的心性</em>：愿意对着一段令人困惑的调用栈坐下来、形成假设、先错两次再找到对的答案的耐心。人们说的“资深”，大部分指的就是这种心性。好消息是，保住它的代价是两步，而不是两小时。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">五步循环</h2>
          <ol className="mt-6 space-y-5">
            {LOOP.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">为什么顺序比工具更重要</h2>
          <p className="mt-4">
            这个循环里没有任何一步是反 AI 的——五步里有三步在用它。顺序保护的是：哪些心智事件发生在答案到来<em>之前</em>。先读调用栈，报错的模式才会登记下来；先做假设，诊断肌肉才会动起来；带上你的推理，回答才会接着你的思考往下走，而不是取代它。“先粘贴再说”的习惯更糟，不是因为答案更差——它们常常挺好——而是因为你跳过了每一个能练成这项技能的事件。背后的规律，和
            <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              写代码时避免过度依赖 AI
            </a>
            是同一个，也是
            <a href="/learn/cant-code-without-ai-anymore" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              “离了 AI 我已经不会写代码了”
            </a>
            里那份恢复计划的核心：起承重作用的心智事件留给人，脚手架交出去。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">调试记忆，内建其中——用 Covate</h2>
          <p className="mt-4 text-secondary">
            Covate 把这个循环的最后两步变成了基础设施。这个免费、开源的 MCP 接入你的 AI 编程助手（Claude、Cursor、Copilot 等）：它的
            <code className="font-mono text-xs">debug_search</code>
            工具保存项目级的调试记忆，于是解决过的根因在同一故障再次出现时可以检索到；而
            <code className="font-mono text-xs">learning_session</code>
            把你的改动变成简短的测验，让每一次修复背后的因果故事真正留下来。会话会同步到 covate.org 上免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            ——用 GitHub 登录，没有任何需要购买的东西。
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
            <a href="/learn/keep-a-learning-ledger-from-your-commits" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何从你的提交中记一份学习台账 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
