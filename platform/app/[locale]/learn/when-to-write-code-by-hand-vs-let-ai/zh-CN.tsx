// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "什么时候亲手写代码，什么时候交给 AI";
export const DESCRIPTION =
  "当目标是学习、逻辑很棘手，或者代码处在系统核心位置时，自己写；当它是样板代码、人人熟悉的常见模式，或者你能轻松验证的东西时，交给 AI。本文给出一个决策框架，帮你做好真正要紧的那种划分。";

const CASES = [
  {
    n: "01",
    title: "交给 AI 写：样板代码和胶水代码",
    body: "配置文件、CRUD 接口、数据库迁移、import 语句、测试脚手架，还有那个你写过四十遍的日志封装。不理解这类代码的代价接近于零，因为你在之前每一份工作里都理解过它——它是可以迁移的。把这些交出去，正是这类强力工具的用途所在。",
  },
  {
    n: "02",
    title: "交给 AI 写：你一眼就能验证的、人人熟悉的模式",
    body: "带自定义比较器的排序、一个防抖函数、一个日期格式化函数、一个标准的重试循环。这些你自己也写得出来，而且能在几秒内评审完，因为你确切知道正确的样子是什么样。验证的代价微乎其微——而这正是交出去的全部理由。",
  },
  {
    n: "03",
    title: "自己写：你正在构建的东西的核心逻辑",
    body: "功能内部的算法、状态机、定价计算、解析器。正是在这部分，一个不起眼的 bug 代价最大，而理解本身就是产品。如果一周后你不能在白板上把这段代码重新推导出来，这个功能就不是你的——它是 AI 的，而它早已转身去忙别的了。",
  },
  {
    n: "04",
    title: "自己写：任何你可能在凌晨 2 点调试的东西",
    body: "并发、缓存失效、时区处理，以及任何碰钱或认证的东西。这些东西在生产环境里出故障时，你得在压力之下、没有助手完整上下文的情况下去读它们。你可能必须现场修好的代码，是你应该亲手写过的代码——或者至少在理解之后亲手重写过一遍。",
  },
  {
    n: "05",
    title: "自己写：当学习本身就是目的的时候",
    body: "新语言、新框架、新领域——如果目标是把它内化，靠生成一路闯过去就违背了初衷。亲手写出代码时的那份挣扎不是浪费，它本身就是把知识写进记忆的过程。先建立起心智模型，再交出去，而不是反过来。",
  },
  {
    n: "06",
    title: "混合：AI 起草，你重写真正要紧的部分",
    body: "这是最被低估的一种做法：让助手产出第一稿，然后在合并之前把核心函数亲手重写一遍。样板代码你白拿，承重的逻辑留在你自己手上，而草稿和你的版本之间的 diff，就是一张精确的地图，标出你当时不知道的东西。",
  },
] as const;

const FAQ = [
  {
    q: "我怎么判断这段代码该自己写还是用 AI？",
    a: "用两个问题。第一：如果以后我不理解这段代码，要付出什么代价？代价高（核心逻辑、钱、认证，以及任何你会在压力下调试的东西）——自己写，或者让 AI 起草后再亲手重写。代价低（样板代码、胶水代码、你写过很多遍的模式）——放心交出去。第二：理解它是不是这次练习的目的？如果你正在学这门语言或这个领域，那就不管方便与否，自己写。按“今天什么最快”而不是按这两个问题来决定，正是开发者最终交付出自己解释不清的代码的原因。",
  },
  {
    q: "让 AI 写代码不是永远更快吗？",
    a: "产出更快，并不等于整体更快。对样板代码来说，是的——评审代价是几秒钟，也没什么需要理解的。对核心逻辑来说，你在写的时候“省下”的时间，有一部分被挪到了后面：调试你并不完全理解的代码、评审你只能盖章放行的改动，以及在每一次扩展之前重新学习自己的系统。团队也会发现，同一块区域里的第二个、第三个功能会更快，前提是第一个是由一个现在已经深刻理解它的人写的（或重写的）。速度是正确的衡量标准；只是你得在整个生命周期上衡量它，而不是只看编写那一步。",
  },
  {
    q: "哪些代码我应该永远亲手写？",
    a: "一份实用的“永远亲手写”清单：任何你在故障期间必须现场调试的东西；并发，以及任何带有顺序或时序假设的东西；认证、权限，以及任何碰钱的东西；你正在构建的功能的核心算法或状态机；以及任何你还在学习中的语言、框架或领域里的东西。它们有一个共同属性：不理解它们的代价会在以后支付，而且带利息。其余的一切都是交出去的候选——但要配上一次真正的评审。",
  },
  {
    q: "在 AI 时代，亲手写代码还重要吗？",
    a: "重要，但方式变了。快速产出语法的价值比过去低得多——助手做这件事已经够用。更值钱的是敲键盘周围的一切：把一个模糊的需求拆解成设计、判断一个方案对你的系统是否合适、调试，以及向队友解释代码。亲手写选定的代码，是训练这些判断能力的方法，而不是目的本身。关于这套已经变化的技能组合，我们在《AI 时代，还值得学编程吗？》里讲过。",
  },
  {
    q: "Covate 在“亲手写”与“交给 AI”的划分里扮演什么角色？",
    a: "Covate 不替你做决定——它让代价变得看得见。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验，在你作答之前暂停后续生成。当你交出去时，测验验证的是你以后会需要的那份理解；当你亲手写时，covate.org 上的学习台账（用 GitHub 登录——免费，没有任何需要购买的东西）记录你的正确率和最弱的主题，于是你能看出哪一项亲手练习真正有回报。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          什么时候亲手写代码，什么时候交给 AI
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          当目标是学习、逻辑很棘手，或者代码处在系统核心位置时，自己写；当它是样板代码、人人熟悉的常见模式，或者你能轻松验证的东西时，交给 AI。错误不在于选了哪一边——而在于按方便程度来选，而不是按“不理解这段代码要付出什么代价”来选。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            这个问题听起来像是在谈效率。它真正关乎的，是理解落在哪里。你代码库里的每一行，要么是你理解得足够透、能够调试、扩展和解释的东西，要么是你租来的东西。AI 会非常快地把代码行从一类挪到另一类，而且只朝一个方向。有意识地划分“亲手写”和“交给 AI”，就是你在拿走速度提升的同时，把承重的那些行留在第一类里的办法。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">逐个场景的划分</h2>
          <ol className="mt-6 space-y-5">
            {CASES.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">这些场景背后的那条规则</h2>
          <p className="mt-4">
            上面每一个场景都归结为一个问题：<strong>如果现在不理解它，以后要付出什么代价？</strong>样板代码几乎没有持有成本——从你的第二份工作起你就理解它了。核心逻辑、并发、认证和钱的持有成本极高，因为账单会在故障现场、功能扩展和面试里送来，而且带利息。持有成本低的地方交出去；持有成本高的地方自己写或重写。如果你想记住一条经验法则：<em>如果下周你不能在白板上把它重新推导出来，就自己写，或者重写一遍。</em>
          </p>
          <p className="mt-4">
            这也是对“我会丢掉技能吗？”的诚实回答——你丢掉的是你停止练习的那些，而你每次交出去的时候都在选择丢掉哪些。技能退化的机制和证据，写在
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              用 AI 会让你变成更差的程序员吗？一次坦诚的审视
            </a>
            里；让这种划分保持健康的日常习惯，写在
            <a href="/learn/how-to-avoid-over-relying-on-ai-when-coding" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              写代码时如何避免过度依赖 AI
            </a>
            里。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 让这个划分保持诚实</h2>
          <p className="mt-4 text-secondary">
            无论你把什么交出去，评审都必须是真的。Covate 是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验——在你作答之前暂停后续生成——于是每一处交出去的改动仍然要经过你的理解。每次会话都会同步到 covate.org 上免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            ：用 GitHub 登录，每一次同步过来的会话、你的累计正确率，以及你总是答错的主题都可以随时查看。没有任何需要购买的东西。
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
            <a href="/learn/should-you-still-learn-to-code-with-ai" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              AI 时代，还值得学编程吗？ →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
