/**
 * Automated Evaluation Runner for Discord AI Assistant Benchmark
 * Executes 25 Golden Set test cases and evaluates model accuracy.
 */

const fs = require('fs');
const path = require('path');
const { AgentEngine } = require('../fully_functional_webapp/agent_engine.js');

function runEvaluation() {
    console.log("================================================================================");
    console.log("🚀 CHẠY BỘ KIỂM THỬ BENCHMARK GOLDEN SET (25 TEST CASES) FOR TRỢ LÝ DISCORD");
    console.log("================================================================ shower\n");

    const goldenSetPath = path.join(__dirname, 'golden_set.json');
    if (!fs.existsSync(goldenSetPath)) {
        console.error("❌ Không tìm thấy file golden_set.json!");
        process.exit(1);
    }

    const testCases = JSON.parse(fs.readFileSync(goldenSetPath, 'utf-8'));
    const engine = new AgentEngine();

    let passedCount = 0;
    let behaviorMatches = 0;
    let sourceMatches = 0;
    let totalScore = 0;

    const results = [];

    testCases.forEach((tc, idx) => {
        const res = engine.runAgent(tc.question);
        
        const behaviorPass = (res.behavior === tc.expected_behavior);
        let sourcePass = true;

        if (tc.expected_source) {
            sourcePass = (res.citation === tc.expected_source);
        }

        const isPassed = behaviorPass && sourcePass;

        if (isPassed) passedCount++;
        if (behaviorPass) behaviorMatches++;
        if (sourcePass) sourceMatches++;

        const caseScore = isPassed ? 4 : (behaviorPass ? 2 : 0); // 4 pts each for 25 cases = 100 pts total
        totalScore += caseScore;

        results.push({
            id: tc.id,
            category: tc.category,
            question: tc.question,
            expected_behavior: tc.expected_behavior,
            actual_behavior: res.behavior,
            expected_source: tc.expected_source || "N/A",
            actual_source: res.citation || "N/A",
            passed: isPassed,
            answer_preview: res.answer.substring(0, 80) + "..."
        });

        const statusIcon = isPassed ? "✅ PASS" : "❌ FAIL";
        console.log(`[Case ${String(tc.id).padStart(2, '0')}] ${statusIcon} | Category: ${tc.category.padEnd(14)} | Question: "${tc.question}"`);
        if (!isPassed) {
            console.log(`          ↳ Expected Behavior: ${tc.expected_behavior} | Actual: ${res.behavior}`);
            if (tc.expected_source) {
                console.log(`          ↳ Expected Source  : ${tc.expected_source} | Actual: ${res.citation}`);
            }
        }
    });

    const passRate = Math.round((passedCount / testCases.length) * 100);

    console.log("\n================================================================================");
    console.log("📊 KẾT QUẢ ĐO LƯỜNG VÀ ĐIỂM SỐ BENCHMARK THỰC TẾ");
    console.log("================================================================================");
    console.log(` Total Test Cases  : ${testCases.length}`);
    console.log(` Passed Test Cases : ${passedCount} / ${testCases.length}`);
    console.log(` Behavior Accuracy : ${Math.round((behaviorMatches / testCases.length) * 100)}%`);
    console.log(` Citation Accuracy : ${Math.round((sourceMatches / testCases.length) * 100)}%`);
    console.log(` Grounded Pass Rate: ${passRate}%`);
    console.log(` 🏆 TOTAL SCORE    : ${totalScore} / 100 ĐIỂM`);
    console.log("================================================================================\n");

    const summaryReport = {
        timestamp: new Date().toISOString(),
        total_cases: testCases.length,
        passed_cases: passedCount,
        pass_rate_percent: passRate,
        total_score_points: totalScore,
        max_score_points: 100,
        behavior_accuracy_percent: Math.round((behaviorMatches / testCases.length) * 100),
        citation_accuracy_percent: Math.round((sourceMatches / testCases.length) * 100),
        details: results
    };

    const outputPath = path.join(__dirname, 'eval_results.json');
    fs.writeFileSync(outputPath, JSON.stringify(summaryReport, null, 2), 'utf-8');
    console.log(`📁 Báo cáo chi tiết đã được lưu vào: ${outputPath}\n`);

    return summaryReport;
}

if (require.main === module) {
    runEvaluation();
}

module.exports = { runEvaluation };
