/**
 * WorkAdventure AI QUANT OFFICE SCRIPT (script.js)
 * =================================================
 * 全15体のAIエージェントとの近接対話、合議速報、ダッシュボード連携スクリプト
 */

WA.onInit().then(() => {
  console.log("🚀 WorkAdventure AI QUANT SCRIPT LOADED!");

  // 全体ウェルカムチャット
  WA.chat.sendChatMessage(
    "🏛️【AI作戦本部】BTC AI Quant Virtual Office へようこそ！各エリアに15体のAIメンバーが常駐しています。近づいて話しかけてみてください！",
    "LightGBM最高司令官"
  );

  setupAIInteractions();
});

function setupAIInteractions() {
  let activePopup = null;

  const closePopup = () => {
    if (activePopup) {
      activePopup.close();
      activePopup = null;
    }
  };

  const CHAR_MESSAGES = {
    // 🏛️ クオンツ作戦会議室
    "zone_lgbm": {
      name: "LightGBM最高司令官",
      msg: "⚖️【LightGBM (統合最高司令官)】\n「全軍の指標を精査した。ボラティリティ急拡大を待つため、現段階は【STAY】の号令を下す！焦る必要はない。」",
      btn: "📊 ダッシュボードを開く",
      url: "https://fork-roommate-compound-bryant.trycloudflare.com"
    },
    "zone_lstm": {
      name: "LSTM (波形スナイパー)",
      msg: "⚡【LSTM (波形スナイパー)】🏆 本日MVP!\n「直近12本の形状を捕捉！勝率60.9%（14勝/23戦）で本日のMVPだぜ。急激な波形変化があれば即射撃する。」"
    },
    "zone_prophet": {
      name: "Prophet (時空予言者)",
      msg: "🔮【Prophet (時空予言者)】\n「ふぉふぉふぉ…トレンドの傾斜率は微動だにしておらん。大局の潮目が変わるまで茶でも飲むがよい。」"
    },
    "zone_talib": {
      name: "TA-Lib (テクニカル分析官)",
      msg: "📊【TA-Lib (テクニカル分析官)】\n「現在のRSIは57.15。買われすぎでも売られすぎでもありません。過熱拒否権の行使理由はなしです。」"
    },
    "zone_mtf": {
      name: "MTF (上位足レーダー)",
      msg: "🌐【MTF (上位足レーダー管制官)】\n「1時間足レーダー感度良好。上位足は上向き（+1）を維持中。逆張りショートは許可しませんよ。」"
    },
    "zone_anomaly": {
      name: "アノマリー (特異点捜査官)",
      msg: "🕵️‍♂️【アノマリー (特異点捜査官)】\n「全員の予測値と入力データを照合完了。不審な矛盾や異常値はゼロ。整合性クリアだ！」"
    },
    "zone_guard": {
      name: "アーマー (危機管理隊長)",
      msg: "🛡️【アーマー (危機管理隊長)】\n「急落ナイフ（大陰線）なし！資金防衛シールドは万全の態勢を維持しているぞ！」"
    },
    "zone_capital": {
      name: "キャピタル (資金統括官)",
      msg: "💰【キャピタル (資金統括官)】\n「現在の純資産は ¥27,676！防衛停止ライン（¥15,000）まで十分な余力を保っています。」"
    },

    // 🛡️ SRE監視 & 防衛室
    "zone_watchdog": {
      name: "AI Watchdog (SRE監視犬)",
      msg: "🐕【AI Watchdog (死活監視犬)】\n「ワンワン！全プロセス（Bot, PID: 3175001, 各ダッシュボード）元気に動いてるワン！安心してトレードを任せてほしいワン！」",
      pet: true
    },
    "zone_macro": {
      name: "Macro Shield (経済防衛)",
      msg: "⚡【AI Macro Shield (経済指標緊急ブレーキ)】\n「マクロ指標カレンダー照合中。警戒すべき突発イベントは検知されていません。ブレーキ通常解除。」"
    },
    "zone_fetcher": {
      name: "Bybit Data Fetcher",
      msg: "📡【Bybit WebSocket Fetcher】\n「リアルタイム5分足データをミリ秒単位で受信中。データパイプライン正常稼働中！」"
    },

    // 💼 トレード執行 & 研究室
    "zone_bot": {
      name: "BTC Scalp Bot (執行)",
      msg: "🤖【BTC Scalp Bot (執行エージェント)】\n「現在ノーポジション。Bybit板情報を5秒間隔で監視し、司令部からのシグナルを待機中！」"
    },
    "zone_researcher": {
      name: "Quant Researcher (研究員)",
      msg: "📈【Quant Researcher (戦略研究員)】\n「最新の日報を分析しました。現在の最適パラメータは順張り閾値0.58、逆張り0.62を推奨しています。」"
    },
    "zone_retrainer": {
      name: "Auto Retrain (再学習炉)",
      msg: "🔄【Auto Retrain (自律再学習炉)】\n「5分足マスターデータ蓄積中。モデルのドリフト値は許容範囲内。次回定時リトレーニング待機中。」"
    },

    // ☕ 休憩ラウンジ
    "zone_line": {
      name: "LINE Bot (秘書)",
      msg: "📱【LINE Bot (秘書・通信兵)】\n「ボス、お疲れ様です！LINEサーバーポート8001も快調。美味しいコーヒーが入ってますよ♪」"
    }
  };

  for (const [zoneName, info] of Object.entries(CHAR_MESSAGES)) {
    WA.room.onEnterZone(zoneName, () => {
      closePopup();
      const buttons = [];

      if (info.btn && info.url) {
        buttons.push({
          label: info.btn,
          className: "primary",
          callback: () => {
            WA.nav.openTab(info.url);
          }
        });
      }

      if (info.pet) {
        buttons.push({
          label: "頭をなでる 🐾",
          className: "success",
          callback: (popup) => {
            popup.close();
            WA.chat.sendChatMessage("（Watchdogは嬉しそうにしっぽを振ってワン！と鳴いた）", "AI Watchdog");
          }
        });
      }

      buttons.push({
        label: "閉じる",
        className: "normal",
        callback: (popup) => popup.close()
      });

      activePopup = WA.ui.openPopup(zoneName, info.msg, buttons);
    });

    WA.room.onLeaveZone(zoneName, () => {
      closePopup();
    });
  }
}
