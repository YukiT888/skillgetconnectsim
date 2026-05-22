import Image from "next/image";
import { Simulator } from "@/components/Simulator/Simulator";

const insights = [
  "SNS規模と反応数から見込み生徒数を3シナリオで試算",
  "月額価格と開発費プランごとの売上・費用・利益を比較",
  "黒字化に必要な最低生徒数と次の打ち手を確認",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(8,145,178,0.35),transparent_34%),linear-gradient(135deg,rgba(16,33,77,0),rgba(8,145,178,0.16))]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14 lg:py-20">
          <div className="flex max-w-3xl flex-col justify-center">
            <div className="mb-6 w-full max-w-[320px] rounded-lg border border-cyan-300/20 bg-navy-800/90 px-4 py-3 shadow-lg shadow-cyan-950/20 sm:max-w-[420px] sm:px-5">
              <Image
                src="/skillget-connect-logo.png"
                alt="スキルゲットconnect"
                width={1376}
                height={768}
                priority
                className="h-auto w-full"
              />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200 sm:mb-4 sm:text-sm">
              Influencer English School Simulator
            </p>
            <h1 className="text-[2rem] font-bold leading-tight sm:text-5xl">
              あなたのSNSから、英会話スクール事業の黒字化ラインをシミュレーション。
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:mt-6 sm:text-lg sm:leading-8">
              フォロワー数、いいね数、保存数、コメント数、ファンクラブやオフ会の状況をもとに、見込み生徒数・月間売上・黒字化に必要な人数を試算できます。
            </p>
            <a
              href="#simulator"
              className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-cyan-400 px-6 py-3 text-sm font-bold text-navy-900 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-300 sm:mt-8 sm:w-fit"
            >
              無料でシミュレーションする
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((item, index) => (
            <div
              key={item}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-cyan-50 text-sm font-bold text-cyan-700">
                {index + 1}
              </div>
              <p className="font-semibold leading-7 text-slate-800">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="simulator" className="mx-auto max-w-6xl px-3 pb-12 sm:px-8 sm:pb-16">
        <Simulator />
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm leading-7 text-slate-600 sm:px-8">
          <p>
            表示金額はすべて税抜きです。実際の請求時には消費税が加算されます。
          </p>
          <p className="mt-2">
            本シミュレーションは、入力されたSNS情報や活動状況をもとにした概算です。実際の生徒獲得数、売上、利益を保証するものではありません。正式な事業計画や契約条件は、個別相談のうえ決定されます。
          </p>
        </div>
      </section>
    </main>
  );
}
