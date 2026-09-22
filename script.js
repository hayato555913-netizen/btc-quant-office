/**
 * WorkAdventure 連携スクリプト (workadventure_script.js)
 * =======================================================
 * WorkAdventure のマップに組み込むことで、オープンソースの2Dバーチャルオフィス上で
 * AIエージェントたちとの近接会話、ゾーン案内、合議速報チャットを実現します。
 */

// WorkAdventure Scripting API の初期化
WA.onInit().then(() => {
  console.log("🚀 WorkAdventure AI QUANT SCRIPT LOADED!");

  // 初期アナウンス
  WA.chat.sendChatMessage(
    "🏛️【AI作戦本部】AI Quant Virtual Office へようこそ！各エリアを歩き回ってAIメンバーに話しかけてみてください。",
    "LightGBM最高司令官"
  );

  // 1. 各ゾーンへの進入検知＆ポップアップ対話
  setupZoneInteractions();

  // 2. 定期的な合議速報の受信・チャット配信ループ
  startCouncilSyncLoop();
});

// ゾーン侵入イベントの設定
function setupZoneInteractions() {
  let activePopup = null;

  // 🏛️ クオンツ合議室ゾーン
  WA.room.onEnterZone("council_zone", () => {
    activePopup = WA.ui.openPopup("council_table", "⚖️【LightGBM最高司令官】\n「各員の指標を精査した。現在はボラティリティ急拡大待ちの【STAY】だ。焦る必要はない。」", [
      {
        label: "詳細ダッシュボードを開く",
        className: "primary",
        callback: () => {
          WA.nav.openTab("/#tab_council");
        }
      },
      {
        label: "了解",
        className: "normal",
        callback: (popup) => popup.close()
      }
    ]);
  });

  WA.room.onLeaveZone("council_zone", () => {
    if (activePopup) activePopup.close();
  });

  // 🛡️ SRE死活監視ルーム
  WA.room.onEnterZone("watchdog_zone", () => {
    activePopup = WA.ui.openPopup("server_rack", "🐕【AI SRE Watchdog】\n「ワンワン！全プロセス（Bot, PID: 正常, 各ダッシュボード）元気に動いてるワン！安心してトレードを任せてほしいワン！」", [
      {
        label: "頭をなでる",
        className: "success",
        callback: (popup) => {
          popup.close();
          WA.chat.sendChatMessage("（Watchdogは嬉しそうにしっぽを振った！）", "AI Watchdog");
        }
      }
    ]);
  });

  WA.room.onLeaveZone("watchdog_zone", () => {
    if (activePopup) activePopup.close();
  });

  // 💼 取引執行フロア
  WA.room.onEnterZone("trading_zone", () => {
    activePopup = WA.ui.openPopup("trading_desk", "🤖【BTC Scalp Bot】\n「現在純資産: ¥27,676。ミリ秒単位でBybit板を監視中。条件合致次第、最速で指値・成行を発注します！」", [
      {
        label: "ポジション状況確認",
        className: "primary",
        callback: (popup) => {
          WA.chat.sendChatMessage("現在保有ポジション: なし (ノーポジション / 待機中)", "ScalpBot");
          popup.close();
        }
      }
    ]);
  });

  WA.room.onLeaveZone("trading_zone", () => {
    if (activePopup) activePopup.close();
  });

  // 🧪 クオンツ研究開発ラボ
  WA.room.onEnterZone("lab_zone", () => {
    activePopup = WA.ui.openPopup("lab_table", "📈【Quant Researcher】\n「昨晩のトレードログを集計しました。現在の推奨パラメータは【順張り閾値 0.58 / 逆張り閾値 0.62】です。」", [
      {
        label: "研究レポートを見る",
        className: "normal",
        callback: (popup) => popup.close()
      }
    ]);
  });

  WA.room.onLeaveZone("lab_zone", () => {
    if (activePopup) activePopup.close();
  });
}

// 合議ステータスの定時チャット通知
function startCouncilSyncLoop() {
  setInterval(async () => {
    try {
      const res = await fetch("/api/council_status");
      if (res.ok) {
        const data = await res.json();
        WA.chat.sendChatMessage(
          `🏛️【合議速報】判定: ${data.action_taken} | 純資産: ¥${Math.round(data.total_capital).toLocaleString()} | MVP: ${data.mvp_character}`,
          "クオンツ作戦司令部"
        );
      }
    } catch (e) {
      // オフライン時はスキップ
    }
  }, 300000);
}
